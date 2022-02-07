var StorageLocation;
(function (StorageLocation) {
    StorageLocation[StorageLocation["Local"] = 1] = "Local";
    StorageLocation[StorageLocation["Remote"] = 2] = "Remote";
})(StorageLocation || (StorageLocation = {}));
class Settings {
    constructor() {
        this.storageLocation = StorageLocation.Local;
    }
}
//# sourceMappingURL=settings.js.map