export class AssetsLoaderEvent extends Event {

	static get ASSETS_LOAD_STARTED() { return "ASSETS_LOAD_STARTED" };
	static get ASSET_LOADED() { return "ASSET_LOADED" };
	static get ALL_ASSETS_LOADED() { return "ALL_ASSETS_LOADED" };
	static get ASSET_LOAD_PROGRESS() { return "ASSET_LOAD_PROGRESS" };
	static get ASSET_LOAD_STOPPED() { return "ASSET_LOAD_STOPPED" };
	static get ASSET_LOAD_STARTED() { return "ASSET_LOAD_STARTED" };
	static get ASSET_LOAD_PAUSED() { return "ASSET_LOAD_PAUSED" };
	static get ASSET_LOAD_RESUMED() { return "ASSET_LOAD_RESUMED" };

	constructor(type) {
		super(type);
	}
}