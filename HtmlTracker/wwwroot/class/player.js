var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Paused"] = 1] = "Paused";
    PlayerState[PlayerState["Playing"] = 2] = "Playing";
})(PlayerState || (PlayerState = {}));
var Player = (function () {
    function Player() {
        this.state = PlayerState.Paused;
        this.channels = [];
        this.position = 0;
        this.step = 0;
    }
    Object.defineProperty(Player.prototype, "song", {
        get: function () {
            return this._song;
        },
        set: function (value) {
            this._song = value;
            this.adjustChannelNumber();
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.adjustChannelNumber = function (value) {
        if (typeof value == "undefined") {
            value = this.song.channelNumber;
        }
        if (value == this.channels.length) {
            return;
        }
        if (value < this.channels.length) {
            for (var i = value; i < this.channels.length; i++) {
                this.channels[i].stop();
            }
            this.channels.length = value;
            return;
        }
        for (var i = this.channels.length; i < value; i++) {
            this.channels.push(new Channel());
        }
    };
    Player.prototype.play = function (position, step, callback) {
        if (position === void 0) { position = 0; }
        if (step === void 0) { step = 0; }
        if (typeof position != "undefined") {
            this.position = position;
        }
        if (typeof step != "undefined") {
            this.step = step;
        }
        this.adjustChannelNumber();
        this.state = PlayerState.Playing;
        this.playStep(callback);
    };
    Player.prototype.playStep = function (callback) {
        var self = this;
        if (this.state == PlayerState.Playing) {
            for (var i = 0; i < this.channels.length; i++) {
                this.channels[i].playNote(this.song.patterns[i][this.song.sequence[i][this.position]][this.step].value);
            }
            setTimeout(function () {
                if (self.state == PlayerState.Playing) {
                    self.step++;
                    if (self.step >= self.song.patternLength) {
                        self.step = 0;
                        self.position++;
                    }
                    if (self.position >= self.song.songLength) {
                        self.position = 0;
                    }
                    if (typeof callback != undefined) {
                        callback(self.position, self.step);
                    }
                    self.playStep(callback);
                }
            }, Math.floor(60000 / this.song.speed / this.song.measureLength));
        }
    };
    Player.prototype.stop = function () {
        this.state = PlayerState.Paused;
        for (var _i = 0, _a = this.channels; _i < _a.length; _i++) {
            var channel = _a[_i];
            channel.stop();
        }
    };
    Player.prototype.playNote = function (note, channel, duration) {
        this.adjustChannelNumber();
        this.channels[channel].playNote(note, duration);
    };
    return Player;
}());
//# sourceMappingURL=player.js.map