import {Asset} from "./Asset.js";

export class AssetData extends Asset {

	#abortController;
	#data;
	#fetch;
	#type;


	constructor(url) {
		super(url);
	}


	load(type) {
		this.#type = type;
		super.load();
		this.#startLoad();
	}


	stop() {
		this.#abortController?.abort();
		this.#abortController = null;
		this.#fetch = null;
		super.stop();
	}


	pause() {
		this.#abortController?.abort();
		super.pause();
	}


	resume() {
		this.#startLoad();
		super.resume();
	}


	get data() {
		return this.#data;
	}


	#startLoad() {
		this.#abortController = new AbortController();
		this.#fetch = fetch(this.url, {method: "get", signal: this.#abortController.signal});
		this.#fetch
			.then(response => response[this.#type]())
			.then((data) => {
				this.#data = data;
				this.#onLoaded(data);
			})
			.catch((error) => { //DOMException: The user aborted a request.
				//when aborting fetch
				console.info(error);
			});
	}


	#onLoaded(data) {
		this.#data = data;
		this.#abortController = null;
		this.#fetch = null;
		super._onLoaded();
	}
}