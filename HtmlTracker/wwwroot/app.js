var App = (function () {
    function App() {
        var self = this;
        this.$screen = $("#content");
        window.onresize = function () { self.onScreenResize(); };
        this.onScreenResize();
        this.player = new Player();
        this.editor = new Editor(this.$screen, this);
    }
    App.prototype.onScreenResize = function () {
        this.$screen.css("height", window.innerHeight + "px");
    };
    return App;
}());
//# sourceMappingURL=app.js.map