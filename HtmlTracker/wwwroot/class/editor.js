var elementMap = ["step", "tone", "octave"];
var Editor = (function () {
    function Editor($screen, app) {
        this.$screen = $screen;
        this.app = app;
        this._octave = 3;
        this._stepIncrement = 1;
        this.beepDuration = 250;
        this._position = 0;
        this._step = 0;
        this._selectedChannel = 0;
        this._selectedElement = 0;
        this.song = new Song();
        //console.log(this.song);
        //this.app.player.song = this.song;
        this.draw();
        this.initEvents();
    }
    Object.defineProperty(Editor.prototype, "octave", {
        get: function () {
            return this._octave;
        },
        set: function (value) {
            if (value < 0) {
                value = 0;
            }
            if (value > 7) {
                value = 7;
            }
            if (value != this._octave) {
                this._octave = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "stepIncrement", {
        get: function () {
            return this._stepIncrement;
        },
        set: function (value) {
            if (value < 0) {
                value = 0;
            }
            if (value > 32) {
                value = 32;
            }
            if (value != this._stepIncrement) {
                this._stepIncrement = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "selectedElement", {
        get: function () {
            return this._selectedElement;
        },
        set: function (value) {
            if (value < 0) {
                value == 0;
            }
            if (value >= elementMap.length) {
                value = elementMap.length - 1;
            }
            if (value != this._selectedElement) {
                this._selectedElement = value;
                this.adjustPosition();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "selectedChannel", {
        get: function () {
            return this._selectedChannel;
        },
        set: function (value) {
            if (value < 0) {
                value = 0;
            }
            if (value >= this.song.channelNumber) {
                value = this.song.channelNumber - 1;
            }
            if (value != this._selectedChannel) {
                this._selectedChannel = value;
                if (this.selectedElement != elementMap.indexOf("step")) {
                    this.selectedElement = elementMap.indexOf("step");
                }
                else {
                    this.adjustPosition();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "position", {
        //private drawTimeout: any = null;
        get: function () {
            return this._position;
        },
        set: function (value) {
            /*if (value < 0) {
                value = 0;
            }
            if (value >= this.song.songLength) {
                value = this.song.songLength - 1;
            }*/
            while (value < 0) {
                value += this.song.songLength;
            }
            value = value % this.song.songLength;
            if (value != this._position) {
                this._position = value;
                this.drawTrackEditor(false);
                this.drawSequenceEditor(false);
                this.adjustPosition();
                this.step = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "step", {
        get: function () {
            return this._step;
        },
        set: function (value) {
            if (value < 0) {
                value = 0;
            }
            if (value != this._step) {
                this._step = value;
                if (this.selectedElement != elementMap.indexOf("step")) {
                    this.selectedElement = elementMap.indexOf("step");
                }
                else {
                    this.adjustPosition();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "song", {
        get: function () {
            return this._song;
        },
        set: function (value) {
            this._song = value;
            this.position = 0;
            this.app.player.song = this.song;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "selectedNote", {
        get: function () {
            return this.song.patterns[this.selectedChannel][this.song.sequence[this.selectedChannel][this.position]][this.step];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Editor.prototype, "selectedFileCode", {
        get: function () {
            var $selectedFileRow = this.$screen.find(".file-row.active");
            if ($selectedFileRow.length == 1) {
                return $selectedFileRow.attr("data-code");
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Editor.prototype.initIntControl = function (selector, fieldName, callback) {
        var self = this;
        this.$screen.on("click", selector + ' .increment, ' + selector + ' .decrement', function (e) {
            e.preventDefault();
            var fieldSelector = fieldName;
            var item = self;
            while (fieldSelector.indexOf(".") > -1) {
                var fieldSelectorSplit = fieldSelector.split(".");
                item = item[fieldSelectorSplit.shift()];
                fieldSelector = fieldSelectorSplit.join(".");
            }
            if ($(this).hasClass("increment")) {
                item[fieldSelector]++;
            }
            else {
                item[fieldSelector]--;
            }
            $(selector + ' .value').html(item[fieldSelector]);
            if (typeof callback != "undefined") {
                callback();
            }
        });
    };
    Editor.prototype.initEvents = function () {
        var self = this;
        this.initIntControl(".song-length", "song.songLength", function () {
            self.position = self.position;
            self.drawSequenceEditor();
        });
        this.initIntControl(".speed", "song.speed");
        this.initIntControl(".measure-length", "song.measureLength", function () { self.draw(); });
        this.initIntControl(".pattern-length", "song.patternLength", function () {
            if (self.step >= self.song.patternLength) {
                self.step = self.song.patternLength - 1;
            }
            self.drawTrackEditor();
        });
        this.initIntControl(".channel-number", "song.channelNumber", function () {
            self.draw();
            self.app.player.adjustChannelNumber();
        });
        this.initIntControl(".position", "position");
        this.initIntControl(".octave", "octave");
        this.initIntControl(".step-increment", "stepIncrement");
        $(window).resize(function () { self.scrollTrackEditor(); });
        $('body').keypress(function (e) {
            e.preventDefault();
            var selectedNote = self.selectedNote;
            if (self.selectedElement == elementMap.indexOf("step") && e.key.length == 1 && typeof keyMap[e.key] != "undefined") {
                selectedNote.value = 12 * self.octave + keyMap[e.key] + 1;
                self.drawSelectedNote();
                self.beepNote(selectedNote);
                self.stepForward(self.stepIncrement);
            }
            if (self.selectedElement == elementMap.indexOf("tone") && e.key.length == 1 && toneMap.lastIndexOf(e.key.toUpperCase()) > -1) {
                //console.log("Edit tone", e.key);
                selectedNote.tone = e.key.toUpperCase();
                self.drawSelectedNote();
                self.beepNote(selectedNote);
                self.adjustPosition();
            }
            if (self.selectedElement == elementMap.indexOf("tone") && e.key.length == 1 && e.key == "#") {
                //console.log("Edit tone", "#");
                if (selectedNote.tone.indexOf("#") > -1) {
                    selectedNote.tone = selectedNote.tone[0];
                    self.beepNote(selectedNote);
                }
                else if (toneMap.indexOf(selectedNote.tone + "#") > -1) {
                    selectedNote.tone = selectedNote.tone + "#";
                    self.beepNote(selectedNote);
                }
                self.drawSelectedNote();
                self.adjustPosition();
            }
            if (self.selectedElement == elementMap.indexOf("octave") && e.key.length == 1) {
                var newOctave = parseInt(e.key);
                if (!isNaN(newOctave) && newOctave >= 0 && newOctave <= 8) {
                    selectedNote.octave = newOctave;
                    self.drawSelectedNote();
                    self.beepNote(selectedNote);
                    self.adjustPosition();
                }
            }
            if (e.key == " ") {
                selectedNote.value = -1;
                self.drawSelectedNote();
                self.stepForward(self.stepIncrement);
            }
            if (e.key == "Backspace") {
                selectedNote.value = 0;
                self.drawSelectedNote();
                self.stepForward(self.stepIncrement * -1);
            }
            if (e.key == "Delete") {
                selectedNote.value = 0;
                self.drawSelectedNote();
                self.stepForward(self.stepIncrement);
            }
            if (e.key == "ArrowUp") {
                self.stepForward(self.stepIncrement * -1);
            }
            if (e.key == "ArrowDown") {
                self.stepForward(self.stepIncrement);
            }
            if (e.key == "ArrowLeft") {
                self.moveCursorLeft();
            }
            if (e.key == "ArrowRight") {
                self.moveCursorRight();
            }
            if (e.key == "PageUp") {
                if (self.song.sequence[self.selectedChannel][self.position] > 0) {
                    self.song.sequence[self.selectedChannel][self.position]--;
                    self.drawTrackEditor(false);
                    self.drawSequenceEditor(false);
                    self.adjustPosition();
                }
            }
            if (e.key == "PageDown") {
                self.song.sequence[self.selectedChannel][self.position]++;
                if (self.song.patterns[self.selectedChannel].length <= self.song.sequence[self.selectedChannel][self.position]) {
                    self.song.patterns[self.selectedChannel].push(new Pattern(self.song.patternLength));
                }
                self.drawTrackEditor(false);
                self.drawSequenceEditor(false);
                self.adjustPosition();
            }
            //console.log(e.key);
        });
        var playerCallback = function (position, step) {
            self.position = position;
            self.step = step;
        };
        this.$screen.on("click", '.play-song-btn', function (e) {
            e.preventDefault();
            self.app.player.play(0, 0, playerCallback);
        });
        this.$screen.on("click", '.play-pattern-btn', function (e) {
            e.preventDefault();
            self.app.player.play(self.position, 0, playerCallback);
        });
        /*this.$screen.on("click", '.pause-btn', function (e) {
            e.preventDefault();
            //self.app.player.play();
            var player = self.app.player;
            if (player.state == PlayerState.Playing) {
                player.stop();
            }
            else {
                self.app.player.play(self.position, self.step, playerCallback);
            }
        });*/
        this.$screen.on("click", '.play-cursor-btn', function (e) {
            e.preventDefault();
            self.app.player.play(self.position, self.step, playerCallback);
        });
        this.$screen.on("click", '.stop-btn', function (e) {
            e.preventDefault();
            self.app.player.stop();
            //self.step = 0;
        });
        this.$screen.on("click", '.file-row', function (e) {
            self.$screen.find(".file-row").removeClass("active");
            $(this).addClass("active");
        });
        this.$screen.on("click", '.load-song-btn', function (e) {
            e.preventDefault();
            self.loadFile(self.selectedFileCode);
        });
        this.$screen.on("click", '.save-song-btn', function (e) {
            e.preventDefault();
            self.saveSelectedFile();
        });
        this.$screen.on("click", '.save-song-as-btn', function (e) {
            e.preventDefault();
            self.saveFileAs();
        });
        this.$screen.on("click", '.delete-song-btn', function (e) {
            e.preventDefault();
            var code = self.selectedFileCode;
            if (code != null && confirm("Delete selected song?")) {
                self.deleteFile(code);
            }
        });
        this.$screen.on("click", '.zap-song-btn', function (e) {
            e.preventDefault();
            if (confirm("Clear current song?")) {
                self.song = new Song();
                self.draw();
            }
        });
    };
    /*setPosition(position: number, step: number) {
        this.position = position;
        this.step = step;
    }*/
    Editor.prototype.draw = function (adjustPosition) {
        if (adjustPosition === void 0) { adjustPosition = true; }
        this.$screen.html(window.viewEngine.renderView("layout.html", this));
        if (adjustPosition) {
            this.adjustPosition();
        }
    };
    Editor.prototype.drawTrackEditor = function (adjustPosition) {
        if (adjustPosition === void 0) { adjustPosition = true; }
        this.$screen.find('.track-editor').html(window.viewEngine.renderView("track-editor.html", this));
        this.adjustPosition();
    };
    Editor.prototype.drawSongPanel = function (adjustPosition) {
        if (adjustPosition === void 0) { adjustPosition = true; }
        this.$screen.find('.song-panel').html(window.viewEngine.renderView("song-panel.html", this));
        if (adjustPosition) {
            this.adjustPosition();
        }
    };
    Editor.prototype.drawSongControls = function (adjustPosition) {
        if (adjustPosition === void 0) { adjustPosition = true; }
        this.$screen.find('.song-controls').html(window.viewEngine.renderView("song-controls.html", this));
        if (adjustPosition) {
            this.adjustPosition();
        }
    };
    Editor.prototype.drawSequenceEditor = function (adjustPosition) {
        if (adjustPosition === void 0) { adjustPosition = true; }
        this.$screen.find('.sequence-editor').html(window.viewEngine.renderView("sequence-editor.html", this));
        if (adjustPosition) {
            this.adjustPosition();
        }
    };
    Editor.prototype.drawSelectedNote = function () {
        this.$screen.find('.track-editor .pattern-row[data-step=' + this.step + '] .pattern-cell[data-channel=' + this.selectedChannel + '] .step').html(window.viewEngine.renderView("note.html", this.selectedNote));
    };
    Editor.prototype.drawFileList = function () {
        this.$screen.find('.file-list').html(window.viewEngine.renderView("file-list.html", this.getFileNames()));
    };
    Editor.prototype.adjustPosition = function () {
        this.$screen.find('.sequence-editor .active').removeClass("active");
        this.$screen.find('.track-editor .active').removeClass("active");
        var $sequenceRow = this.$screen.find('.sequence-editor .sequence-row[data-row=' + this.position + ']');
        $sequenceRow.addClass("active");
        $sequenceRow.find('.sequence-cell[data-channel=' + this.selectedChannel + ']').addClass("active");
        var $patternRow = this.$screen.find('.track-editor .pattern-row[data-step=' + this.step + ']');
        $patternRow.addClass("active");
        var $patternCell = $patternRow.find('.pattern-cell[data-channel=' + this.selectedChannel + ']');
        $patternCell.find('.' + elementMap[this.selectedElement]).addClass("active");
        this.scrollSequenceEditor();
        this.scrollTrackEditor($patternCell);
    };
    Editor.prototype.scrollSequenceEditor = function ($sequenceRow, $sequenceContainer) {
        if (typeof $sequenceRow == "undefined") {
            $sequenceRow = this.$screen.find(".sequence-row.active");
        }
        if (typeof $sequenceContainer == "undefined") {
            $sequenceContainer = this.$screen.find(".sequence-container");
        }
        var $sequence = $sequenceContainer.find('.sequence');
        var sequenceEditorOffset = $sequenceContainer.offset();
        var sequenceRowOffset = $sequenceRow.offset();
        var verticalOffset = sequenceRowOffset.top - $sequence.offset().top;
        $sequence.css("margin-top", ($sequenceContainer.height() / 2 - $sequenceRow.height() / 2 - verticalOffset) + "px");
    };
    Editor.prototype.scrollTrackEditor = function ($patternCell, $trackEditor) {
        if (typeof $patternCell == "undefined") {
            $patternCell = this.$screen.find('.track-editor .pattern-row[data-step=' + this.step + '] .pattern-cell[data-channel=' + this.selectedChannel + ']');
        }
        if (typeof $trackEditor == "undefined") {
            $trackEditor = this.$screen.find('.track-editor');
        }
        var $trackContainer = $trackEditor.find('.track-table');
        var trackEditorOffset = this.$screen.find('.track-editor').offset();
        var patternCellOffset = $patternCell.offset();
        var horizontalOverflow = (patternCellOffset.left + $patternCell.width()) - (trackEditorOffset.left + $trackEditor.width());
        if (horizontalOverflow > 0) {
            var marginLeft = parseInt($trackContainer.css("margin-left") || 0);
            $trackContainer.css("margin-left", (marginLeft - horizontalOverflow) + "px");
        }
        var horizontalUnderflow = trackEditorOffset.left - patternCellOffset.left;
        if (horizontalUnderflow > 0) {
            var marginLeft = parseInt($trackContainer.css("margin-left") || 0);
            $trackContainer.css("margin-left", (marginLeft + horizontalUnderflow) + "px");
        }
        var verticalOffset = patternCellOffset.top - $trackContainer.offset().top;
        $trackContainer.css("margin-top", ($trackEditor.height() / 2 - $patternCell.height() / 2 - verticalOffset) + "px");
        //console.log(horizontalUnderflow, horizontalOverflow);
    };
    Editor.prototype.stepForward = function (increment) {
        if (increment === void 0) { increment = 1; }
        var nextStep = (this.step + increment) % this.song.patternLength;
        if (nextStep < 0) {
            nextStep += this.song.patternLength;
        }
        this.step = nextStep;
    };
    Editor.prototype.moveCursorRight = function () {
        var selectedNote = this.selectedNote;
        if (selectedNote.value > 0 && this._selectedElement < elementMap.length - 1) {
            this.selectedElement += 1;
            return;
        }
        this.selectedChannel = (this.selectedChannel + 1) % this.song.channelNumber;
    };
    Editor.prototype.moveCursorLeft = function () {
        var selectedNote = this.selectedNote;
        if (selectedNote.value > 0 && this._selectedElement > 0) {
            this.selectedElement -= 1;
            return;
        }
        var nextChannel = this.selectedChannel - 1;
        if (nextChannel < 0) {
            nextChannel += this.song.channelNumber;
        }
        this.selectedChannel = nextChannel;
    };
    Editor.prototype.beepNote = function (note, duration) {
        if (typeof duration == "undefined") {
            duration = this.beepDuration;
        }
        this.app.player.playNote(note, this.selectedChannel, duration);
    };
    Editor.prototype.getFileNames = function () {
        if (typeof localStorage["song-list"] == "undefined") {
            return {};
        }
        else {
            return JSON.parse(localStorage["song-list"]);
        }
    };
    Editor.prototype.saveFileAs = function () {
        var fileName = prompt("Please enter file name:", "untitled");
        if (fileName != null) {
            this.saveFileByName(fileName);
        }
    };
    Editor.prototype.saveSelectedFile = function () {
        var code = this.selectedFileCode;
        if (code != null) {
            if (confirm("Overwrite selected song?")) {
                this.saveFileByCode(code);
            }
        }
        else {
            this.saveFileAs();
        }
    };
    Editor.prototype.saveFileByName = function (fileName) {
        var files = this.getFileNames();
        var code = window.XXH(fileName, 0).toString(16);
        this.saveFileByCode(code);
        files[code] = { name: fileName, code: code };
        localStorage["song-list"] = JSON.stringify(files);
        this.drawFileList();
    };
    Editor.prototype.saveFileByCode = function (code) {
        localStorage["song-" + code] = JSON.stringify(this.song.export());
    };
    Editor.prototype.loadFile = function (code) {
        this.app.player.stop();
        if (typeof localStorage["song-" + code] == "undefined") {
            alert("File not found!");
            return;
        }
        try {
            this.song = new Song(localStorage["song-" + code]);
            this.draw();
        }
        catch (e) {
            alert("Loading file failed!");
            this.song = new Song();
            this.draw();
            throw e;
        }
    };
    Editor.prototype.deleteFile = function (code) {
        localStorage.removeItem("song-key");
        var files = this.getFileNames();
        delete files[code];
        localStorage["song-list"] = JSON.stringify(files);
        this.drawFileList();
    };
    return Editor;
}());
//# sourceMappingURL=editor.js.map