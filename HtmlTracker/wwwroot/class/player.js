var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Paused"] = 1] = "Paused";
    PlayerState[PlayerState["Playing"] = 2] = "Playing";
})(PlayerState || (PlayerState = {}));
class Player {
    constructor() {
        this.state = PlayerState.Paused;
        this.channels = [];
        this.position = 0;
        this.step = 0;
    }
    get song() {
        return this._song;
    }
    set song(value) {
        this._song = value;
        this.adjustChannelNumber();
    }
    adjustChannelNumber(value) {
        if (typeof value == "undefined") {
            value = this.song.channelNumber;
        }
        if (value == this.channels.length) {
            return;
        }
        if (value < this.channels.length) {
            for (let i = value; i < this.channels.length; i++) {
                this.channels[i].stop();
            }
            this.channels.length = value;
            return;
        }
        for (let i = this.channels.length; i < value; i++) {
            this.channels.push(new Channel());
        }
    }
    play(position = 0, step = 0, callback) {
        if (typeof position != "undefined") {
            this.position = position;
        }
        if (typeof step != "undefined") {
            this.step = step;
        }
        this.adjustChannelNumber();
        this.state = PlayerState.Playing;
        this.playStep(callback);
    }
    playStep(callback) {
        var self = this;
        if (this.state == PlayerState.Playing) {
            for (let i = 0; i < this.channels.length; i++) {
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
    }
    stop() {
        this.state = PlayerState.Paused;
        for (let channel of this.channels) {
            channel.stop();
        }
    }
    playNote(note, channel, duration) {
        this.adjustChannelNumber();
        this.channels[channel].playNote(note, duration);
    }
}
//# sourceMappingURL=player.js.map