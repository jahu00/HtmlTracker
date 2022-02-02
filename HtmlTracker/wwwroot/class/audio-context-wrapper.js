(function () {
    var context = null;
    window.getAudioContext = function () {
        if (context == null) {
            context = new (window.AudioContext || window.webkitAudioContext)();
        }
        return context;
    };
})();
//# sourceMappingURL=audio-context-wrapper.js.map