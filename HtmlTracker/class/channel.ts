var frequencies = [
    0,
    16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 29, 31,
    33, 35, 37, 39, 41, 44, 46, 49, 52, 55, 58, 62,
    65, 69, 73, 78, 82, 87, 92, 98, 104, 110, 117, 123,
    131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247,
    262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494,
    523, 554, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988,
    1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976,
    2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951,
    4186, 4434, 4698, 4978, 5274, 5588, 5920, 6272, 6644, 7040, 7458, 7902,
];
class Channel {
    oscilator: any = null;
    note: number = 0;
    constructor() {
    }

    stop() {
        this.killOscilator();
        this.note = 0;
    }

    playNote(note: any, duration?: number) {
        var self = this;
        if (typeof note == "object") {
            note = note.value;
        }
        if (note == 0) {
            return;
        }
        if (note == -1) {
            this.stop();
            return;
        }
        if (note != this.note) {
            this.newOscilator();
            this.note = note;
            this.oscilator.frequency.value = frequencies[this.note];
            this.oscilator.start();
        }
        if (typeof duration != "undefined") {
            setTimeout(function () {
                self.stop();
            }, duration);
        }
    }

    disconnect() {
        this.oscilator.diconnect();
    }

    newOscilator() {
        if (this.oscilator != null) {
            this.killOscilator();
        }
        this.oscilator = window.getAudioContext().createOscillator();
        this.oscilator.connect(window.getAudioContext().destination);
        this.oscilator.type = 'square';
    }

    killOscilator() {
        if (this.oscilator != null) {
            this.oscilator.stop();
            this.oscilator.disconnect();
            this.oscilator = null;
        }
    }
}