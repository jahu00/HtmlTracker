class Renderer {
    //$container: any;

    private redrawTimeout: any;

    private _song: Song;

    position: number = 0;
    step: number = 0;

    get song() {
        return this._song;
    }

    set song(value: Song) {
        this._song = value;
        this.position = 0;
        this.step = 0;
    }

    constructor(public $container: any, song: Song) {
    }

    draw() {
        this.redrawTimeout  = null;
    }
}