import {Asset} from "./Asset.js";

export class AssetMedia extends Asset {

	static get TYPE_VIDEO() { return "VIDEO" };
	static get TYPE_AUDIO() { return "AUDIO" };

	#media;
	#type;
	#eventHandlers;

	constructor(url, type) {
		super(url);

		if(!type || (type !== AssetMedia.TYPE_AUDIO && type !== AssetMedia.TYPE_VIDEO)) {
			debugger
			throw new Error(`type is required attribute, and must be set one of twe values: ${AssetMedia.TYPE_AUDIO} or ${AssetMedia.TYPE_VIDEO}`);
		}

		this.#type = type;
	}


	load() {
		super.load();
		if(this.#type === AssetMedia.TYPE_AUDIO) {
			this.#media = new Audio();
		} else if(this.#type === AssetMedia.TYPE_VIDEO) {
			const video = this.#media = document.createElement("video");
			video.setAttribute("preload", "auto");

		}

		this.#eventHandlers = {
			loaded: this.#onLoaded.bind(this)
		}
		this.#media.addEventListener('canplaythrough', this.#eventHandlers.loaded, {once: true});
		this.#media.src = this.url;
	}


	stop() {
		this.#media.src = "";
		this.#media.removeEventListener('canplaythrough', this.#eventHandlers.loaded);
		this.#media = null;
		super.stop();
	}


	pause() {
		this.#media.src = "";
		super.pause();
	}


	resume() {
		this.#media.src = this.url;
		super.resume();
	}


	get mediaDomElement() {
		return this.#media;
	}


	get mediaDomElementType() {
		return this.#type;
	}


	#onLoaded() {
		this.#media.removeEventListener('canplaythrough', this.#eventHandlers.loaded);
		this.#eventHandlers = null;
		super._onLoaded();
	}
}