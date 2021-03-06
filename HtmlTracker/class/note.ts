﻿interface INote { value: number }

class Note
{
    private _value: number;

    get value(): number {
        return this._value;
    }

    set value(value) {
        if (value < -1) {
            value = -1;
        }
        if (value > maxNote) {
            value = maxNote;
        }
        if (value != this._value) {
            this._value = value;
        }
    }

    constructor();
    constructor(value: number);
    constructor(note: INote);
    constructor(a?: any)
    {
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

    //value: number;
    get tone() {
        /*if (this.value == -1) {
            return "==";
        }*/
        if (this.value <= 0) {
            return "";
        }
        return toneMap[(this.value - 1) % 12];
    }

    set tone(_value) {
        var currentOctave = this.octave;
        this.value = toneMap.indexOf(_value) + 1 + currentOctave * 12;
    }
    get octave() {
        if (this.value <= 0) {
            return null;
        }
        return Math.floor((this.value - 1) / 12);
    }
    set octave(_value) {
        var currentTone = (this.value - 1) % 12;
        this.value = _value * 12 + currentTone + 1;
    }

    clear(): void {
        this.value = 0;
    }

    break(): void {
        this.value = -1;
    }

    export(): INote {
        return {
            value: this.value
        };
    }
}