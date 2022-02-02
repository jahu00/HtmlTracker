class Pattern extends Array<Note>{
    constructor();
    constructor(length: number);
    constructor(notes: number[]);
    constructor(a?: any)
    {
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

    setLength(value: number) {
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

    export(): INote[] {
        var result = [];
        for (var note of this) {
            result.push(note.export());
        }
        return result;
    }
}
