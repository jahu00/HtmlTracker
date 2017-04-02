var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Pattern = (function (_super) {
    __extends(Pattern, _super);
    function Pattern(a) {
        _super.call(this);
        if (typeof a == "number") {
            this.setLength(a);
        }
        else if (typeof a == "object") {
            for (var i = 0; i < a.length; i++) {
                this.push(new Note(a[i]));
            }
        }
    }
    Pattern.prototype.setLength = function (value) {
        if (value == this.length) {
            return;
        }
        if (value < this.length) {
            this.length = value;
            return;
        }
        for (var i = this.length; i < value; i++) {
            this.push(new Note());
        }
    };
    Pattern.prototype.export = function () {
        var result = [];
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var note = _a[_i];
            result.push(note.export());
        }
        return result;
    };
    return Pattern;
}(Array));
//# sourceMappingURL=pattern.js.map