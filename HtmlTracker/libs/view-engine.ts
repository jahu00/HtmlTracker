/**
* Helper class for vash views. Pulls views using sync XHR and caches them for future use.
*/
class ViewEngine {

    private views: any = {};

    /**
    * @param _defaultPath Instructs ViewEngine where to look for the views (defaults to ".")
    * @param _cacheViews Enables/disables caching of views (defaults to true)
    */
    constructor(private defaultPath: string = ".", private cacheViews: boolean = true) {
    }

    /**
    * Renders a vash view.
    *
    * @param viewName Name of the view
    * @param model Model to be used for rendering the view
    */
    public renderView(viewName, model): string
    {
        var view: any = {};
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
            view.template = (<any>window).vash.compile(view.raw);
        }
        return view.template(model);
    }
}