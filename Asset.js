import {AssetsLoaderEvent} from "./AssetsLoaderEvent.js";

export class Asset extends EventTarget {

	#url;
	#isLoading = false;
	#isLoaded = false;
	#isPaused = false;


	constructor(url) {
		super();
		this.#url = url;
	}

	load() {
		if(!this.#isLoaded) {
			this.#isLoading = true;
			this.dispatchEvent(new AssetsLoaderEvent(AssetsLoaderEvent.ASSET_LOAD_STARTED));
		}
	}

	pause() {
		if(!this.#isLoaded) {
			this.#isPaused = true;
			this.dispatchEvent(new AssetsLoaderEvent(AssetsLoaderEvent.ASSET_LOAD_PAUSED));
		}
	}


	resume() {
		if(!this.#isLoaded) {
			this.#isPaused = false;
			this.dispatchEvent(new AssetsLoaderEvent(AssetsLoaderEvent.ASSET_LOAD_RESUMED));
		}
	}


	stop() {
		if(!this.#isLoaded) {
			this.#isLoading = false;
			this.dispatchEvent(new AssetsLoaderEvent(AssetsLoaderEvent.ASSET_LOAD_STOPPED));
		}
	}

	dispose() {

	}


	_onLoaded() {
		this.#isLoaded = true;
		this.#isLoading = false;
		this.dispatchEvent(new AssetsLoaderEvent(AssetsLoaderEvent.ASSET_LOADED));
	}


	get url() {
		return this.#url;
	}

	get isLoading() {
		return this.#isLoading;
	}

	get isLoaded() {
		return this.#isLoaded;
	}

	get isPaused() {
		return this.#isPaused;
	}
}