var Renderer = (function () {
    function Renderer($container, song) {
        this.$container = $container;
        this.position = 0;
        this.step = 0;
    }
    Object.defineProperty(Renderer.prototype, "song", {
        get: function () {
            return this._song;
        },
        set: function (value) {
            this._song = value;
            this.position = 0;
            this.step = 0;
        },
        enumerable: true,
        configurable: true
    });
    Renderer.prototype.draw = function () {
        this.redrawTimeout = null;
    };
    return Renderer;
}());
//# sourceMappingURL=renderer.js.map