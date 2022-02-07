enum StorageLocation {
    Local = 1,
    Remote = 2
}

class Settings {
    public storageLocation: StorageLocation = StorageLocation.Local;
}