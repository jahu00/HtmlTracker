/**
* Helper class for vash views. Pulls views using sync XHR and caches them for future use.
*/
var ViewEngine = (function () {
    /**
    * @param _defaultPath Instructs ViewEngine where to look for the views (defaults to ".")
    * @param _cacheViews Enables/disables caching of views (defaults to true)
    */
    function ViewEngine(defaultPath, cacheViews) {
        if (defaultPath === void 0) { defaultPath = "."; }
        if (cacheViews === void 0) { cacheViews = true; }
        this.defaultPath = defaultPath;
        this.cacheViews = cacheViews;
        this.views = {};
    }
    /**
    * Renders a vash view.
    *
    * @param viewName Name of the view
    * @param model Model to be used for rendering the view
    */
    ViewEngine.prototype.renderView = function (viewName, model) {
        var view = {};
        var viewPath = this.defaultPath + "/" + viewName;
        if (!this.cacheViews || typeof this.views[viewPath] == "undefined") {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', viewPath, false); // sync request
            xhr.send();
            view.raw = xhr.responseText;
            this.views[viewPath] = view;
        }
        else {
            view = this.views[viewPath];
        }
        if (typeof view.template == "undefined") {
            view.template = window.vash.compile(view.raw);
        }
        return view.template(model);
    };
    return ViewEngine;
}());
//# sourceMappingURL=view-engine.js.map