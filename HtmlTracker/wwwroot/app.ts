//import { Settings } from "./class/settings"
interface Window { viewEngine: ViewEngine, XXH: any }
class App {

    editor: Editor;
    player: Player;
    settings: Settings;

    $screen: any;

    constructor() {
        var self = this;
        this.$screen = $("#content");
        window.onresize = function () { self.onScreenResize() };
        this.onScreenResize();

        this.settings = new Settings();

        this.player = new Player();
        this.editor = new Editor(this.$screen, this);
    }

    private onScreenResize() {
        this.$screen.css("height", window.innerHeight + "px");
    }
}