interface Window { getAudioContext: any, AudioContext: any, webkitAudioContext: any }
(function () {
    var context = null;
    window.getAudioContext = function () {
        if (context == null) {
            context = new (window.AudioContext || window.webkitAudioContext)();
        }
        return context;
    };
})();