class Pattern extends Array {
    constructor(a) {
        super();
        if (typeof a == "number") {
            this.setLength(a);
        }
        else if (typeof a == "object") {
            for (let i = 0; i < a.length; i++) {
                this.push(new Note(a[i]));
            }
        }
    }
    setLength(value) {
        if (value == this.length) {
            return;
        }
        if (value < this.length) {
            this.length = value;
            return;
        }
        for (let i = this.length; i < value; i++) {
            this.push(new Note());
        }
    }
    export() {
        var result = [];
        for (var note of this) {
            result.push(note.export());
        }
        return result;
    }
}
//# sourceMappingURL=pattern.js.map