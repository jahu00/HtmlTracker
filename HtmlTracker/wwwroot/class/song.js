var Song = (function () {
    function Song(options) {
        this.speed = 120;
        this._songLength = 0;
        this._patternLength = 0;
        this.measureLength = 4;
        this._channelNumber = 0;
        this.patterns = [];
        //channels: Channel[] = [];
        this.sequence = [];
        if (typeof options == "string") {
            options = JSON.parse(options);
        }
        if (typeof options == "undefined") {
            options = {};
        }
        if (typeof options.speed != "undefined") {
            this.speed = options.speed;
        }
        if (typeof options.patternLength != "undefined") {
            this.patternLength = options.patternLength;
        }
        else {
            this.patternLength = 64;
        }
        if (typeof options.measureLength != "undefined") {
            this.measureLength = options.measureLength;
        }
        else {
            this.measureLength = 4;
        }
        if (typeof options.songLength != "undefined") {
            this.songLength = options.songLength;
        }
        else {
            this.songLength = 1;
        }
        if (typeof options.channelNumber != "undefined") {
            this.channelNumber = options.channelNumber;
        }
        else {
            this.channelNumber = 3;
        }
        if (typeof options.patterns != "undefined") {
            for (var c = 0; c < this.channelNumber; c++) {
                var channelPatterns = [];
                for (var _i = 0, _a = options.patterns[c]; _i < _a.length; _i++) {
                    var pattern = _a[_i];
                    channelPatterns.push(new Pattern(pattern));
                }
                this.patterns[c] = channelPatterns;
            }
        }
        if (typeof options.sequence != "undefined") {
            this.sequence = options.sequence;
        }
    }
    Object.defineProperty(Song.prototype, "songLength", {
        get: function () {
            return this._songLength;
        },
        set: function (value) {
            if (value < 1) {
                value = 1;
            }
            if (value == this._songLength) {
                return;
            }
            if (value < this._songLength) {
                for (var _i = 0, _a = this.sequence; _i < _a.length; _i++) {
                    var channelSequence = _a[_i];
                    //this.sequence.length = value;
                    channelSequence.length = value;
                }
            }
            else {
                for (var _b = 0, _c = this.sequence; _b < _c.length; _b++) {
                    var channelSequence = _c[_b];
                    for (var n = this._songLength; n < value; n++) {
                        channelSequence.push(0);
                    }
                }
            }
            this._songLength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Song.prototype, "patternLength", {
        get: function () {
            return this._patternLength;
        },
        set: function (value) {
            if (value < 1) {
                value = 1;
            }
            if (value > 255) {
                value = 255;
            }
            if (value == this._patternLength) {
                return;
            }
            for (var _i = 0, _a = this.patterns; _i < _a.length; _i++) {
                var channelPatterns = _a[_i];
                for (var _b = 0, channelPatterns_1 = channelPatterns; _b < channelPatterns_1.length; _b++) {
                    var pattern = channelPatterns_1[_b];
                    pattern.setLength(value);
                }
            }
            this._patternLength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Song.prototype, "channelNumber", {
        get: function () {
            return this._channelNumber;
        },
        set: function (value) {
            if (value < 1) {
                value = 1;
            }
            if (value == this._channelNumber) {
                return;
            }
            if (value > this._channelNumber) {
                for (var i = this._channelNumber; i < value; i++) {
                    //this.channels.push(new Channel());
                    this.patterns.push([new Pattern(this.patternLength)]);
                    this.sequence.push([]);
                    for (var n = 0; n < this._songLength; n++) {
                        this.sequence[i].push(0);
                    }
                }
            }
            else {
                /*for (let i = value; i < this._channelNumber; i++) {
                    this.channels[i].stop();
                }*/
                //this.channels.length = value;
                this.patterns.length = value;
                this.sequence.length = value;
            }
            this._channelNumber = value;
        },
        enumerable: true,
        configurable: true
    });
    Song.prototype.export = function () {
        var patterns = [];
        for (var c = 0; c < this.channelNumber; c++) {
            var channelPatterns = [];
            for (var _i = 0, _a = this.patterns[c]; _i < _a.length; _i++) {
                var pattern = _a[_i];
                channelPatterns.push(pattern.export());
            }
            patterns.push(channelPatterns);
        }
        return {
            speed: this.speed,
            measureLength: this.measureLength,
            patternLength: this.patternLength,
            songLength: this.songLength,
            channelNumber: this.channelNumber,
            patterns: patterns,
            sequence: this.sequence
        };
    };
    return Song;
}());
//# sourceMappingURL=song.js.map