class Renderer {
    constructor($container, song) {
        this.$container = $container;
        this.position = 0;
        this.step = 0;
    }
    get song() {
        return this._song;
    }
    set song(value) {
        this._song = value;
        this.position = 0;
        this.step = 0;
    }
    draw() {
        this.redrawTimeout = null;
    }
}
//# sourceMappingURL=renderer.js.map