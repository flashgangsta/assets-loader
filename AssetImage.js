import {Asset} from "./Asset.js";

export class AssetImage extends Asset {

	#image;
	#eventHandlers;

	constructor(url) {
		super(url);
	}

	load() {
		super.load();
		this.#image = new Image();
		this.#eventHandlers = {
			loaded: this.#onLoaded.bind(this)
		};
		this.#image.addEventListener("load", this.#eventHandlers.loaded, {once: true});
		this.#image.src = this.url;
	}


	pause() {
		this.#image.src = "";
		super.pause();
	}


	resume() {
		this.#image.src = this.url;
		super.resume();
	}


	stop() {
		this.#image.src = "";
		this.#image.removeEventListener("load", this.#eventHandlers.loaded);
		this.#image = null;
		super.stop();
	}


	get img() {
		return this.#image;
	}


	#onLoaded() {
		this.#image.removeEventListener("load", this.#eventHandlers.loaded);
		this.#eventHandlers = null;
		super._onLoaded();
	}
}
