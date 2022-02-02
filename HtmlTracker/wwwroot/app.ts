interface Window { viewEngine: ViewEngine, XXH: any }
class App {

    editor: Editor;
    player: Player;

    $screen: any;

    constructor() {
        var self = this;
        this.$screen = $("#content");
        window.onresize = function () { self.onScreenResize() };
        this.onScreenResize();

        this.player = new Player();
        this.editor = new Editor(this.$screen, this);
    }

    private onScreenResize() {
        this.$screen.css("height", window.innerHeight + "px");
    }
}