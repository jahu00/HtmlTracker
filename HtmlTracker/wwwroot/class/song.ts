interface ISong {
    speed: number,
    songLength: number,
    patternLength: number,
    measureLength: number,
    channelNumber: number,
    patterns: INote[][][],
    sequence: number[][],
}

class Song {
    speed: number = 120;

    private _songLength: number = 0;

    get songLength() {
        return this._songLength;
    }

    set songLength(value: number) {
        if (value < 1) {
            value = 1;
        }
        if (value == this._songLength) {
            return;
        }

        if (value < this._songLength) {
            for (let channelSequence of this.sequence) {
                //this.sequence.length = value;
                channelSequence.length = value;
            }
        }
        else {
            for (let channelSequence of this.sequence) {
                for (let n = this._songLength; n < value; n++) {
                    channelSequence.push(0);
                }
            }
        }
        this._songLength = value;
    }

    private _patternLength: number = 0;

    get patternLength() {
        return this._patternLength;
    }

    set patternLength(value: number) {
        if (value < 1) {
            value = 1;
        }

        if (value > 255) {
            value = 255;
        }

        if (value == this._patternLength) {
            return;
        }
        for (let channelPatterns of this.patterns) {
            for (let pattern of channelPatterns) {
                pattern.setLength(value);
            }
        }
        this._patternLength = value;
    }

    measureLength: number = 4;

    private _channelNumber: number = 0;

    get channelNumber() {
        return this._channelNumber;
    }

    set channelNumber(value) {
        if (value < 1) {
            value = 1;
        }
        if (value == this._channelNumber) {
            return;
        }
        if (value > this._channelNumber) {
            for (let i = this._channelNumber; i < value; i++) {
                //this.channels.push(new Channel());
                this.patterns.push([new Pattern(this.patternLength)]);
                this.sequence.push([]);
                for (let n = 0; n < this._songLength; n++) {
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
    }

    patterns: Pattern[][] = [];
    //channels: Channel[] = [];
    sequence: number[][] = [];

    constructor();
    constructor(json: string)
    constructor(song: any)
    constructor(options?: any) {
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
            for (let c = 0; c < this.channelNumber; c++) {
                var channelPatterns = [];
                for (let pattern of options.patterns[c]) {
                    channelPatterns.push(new Pattern(pattern));
                }
                this.patterns[c] = channelPatterns;
            }
        }

        if (typeof options.sequence != "undefined") {
            this.sequence = options.sequence;
        }
    }

    export(): ISong {
        var patterns = [];
        for (var c = 0; c < this.channelNumber; c++) {
            var channelPatterns = [];
            for (var pattern of this.patterns[c]) {
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
    }

}