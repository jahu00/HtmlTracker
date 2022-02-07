class App {
    constructor() {
        var self = this;
        this.$screen = $("#content");
        window.onresize = function () { self.onScreenResize(); };
        this.onScreenResize();
        this.settings = new Settings();
        this.player = new Player();
        this.editor = new Editor(this.$screen, this);
    }
    onScreenResize() {
        this.$screen.css("height", window.innerHeight + "px");
    }
}
//# sourceMappingURL=app.js.map