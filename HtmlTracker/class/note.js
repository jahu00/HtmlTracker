var Note = (function () {
    function Note(a) {
        if (typeof a == "undefined") {
            this.value = 0;
        }
        else if (typeof a.value != "undefined") {
            this.value = a.value;
        }
        else {
            this.value = a;
        }
    }
    Object.defineProperty(Note.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (value < -1) {
                value = -1;
            }
            if (value > maxNote) {
                value = maxNote;
            }
            if (value != this._value) {
                this._value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Note.prototype, "tone", {
        //value: number;
        get: function () {
            /*if (this.value == -1) {
                return "==";
            }*/
            if (this.value <= 0) {
                return "";
            }
            return toneMap[(this.value - 1) % 12];
        },
        set: function (_value) {
            var currentOctave = this.octave;
            this.value = toneMap.indexOf(_value) + 1 + currentOctave * 12;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Note.prototype, "octave", {
        get: function () {
            if (this.value <= 0) {
                return null;
            }
            return Math.floor((this.value - 1) / 12);
        },
        set: function (_value) {
            var currentTone = (this.value - 1) % 12;
            this.value = _value * 12 + currentTone + 1;
        },
        enumerable: true,
        configurable: true
    });
    Note.prototype.clear = function () {
        this.value = 0;
    };
    Note.prototype.break = function () {
        this.value = -1;
    };
    Note.prototype.export = function () {
        return {
            value: this.value
        };
    };
    return Note;
}());
//# sourceMappingURL=note.js.map