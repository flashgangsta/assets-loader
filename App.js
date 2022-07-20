import {AssetsLoader} from "./AssetsLoader.js";
import {AssetsLoaderEvent} from "./AssetsLoaderEvent.js";

export class App {

	#progressbar;
	#progressbarText;
	#progressbarLoadingText;
	#loadingIndicationInterval;
	#assetsLoader;
	#buttonStartLoad;
	#buttonStopLoad;
	#buttonPauseLoad;
	#buttonResumeLoad;
	#assetsList;
	#eventHandlers;

	constructor() {
		const assetsLoader = this.#assetsLoader = window.loader = new AssetsLoader();
		this.#progressbar = document.querySelector("#progressbar");
		this.#progressbarText = document.querySelector("#progressbar-text");
		this.#progressbarLoadingText = document.querySelector("#progressbar-loading-text");

		this.#buttonStartLoad = document.querySelector("#buttonStartLoad");
		this.#buttonStopLoad = document.querySelector("#buttonStopLoad");
		this.#buttonPauseLoad = document.querySelector("#buttonPauseLoad");
		this.#buttonResumeLoad = document.querySelector("#buttonResumeLoad");


		this.#eventHandlers = {
			assetLoadProgress: this.#onLoadProgress.bind(this),
			allAssetsLoaded: this.#onAllAssetsLoaded.bind(this),
			buttonStartClick: this.#onStartLoadButtonClick.bind(this),
			buttonStopClick: this.#onStopLoadButtonClick.bind(this),
			buttonPauseClick: this.#onPauseLoadButtonClick.bind(this),
			buttonResumeClick: this.#onResumeLoadButtonClick.bind(this)
		}

		assetsLoader.addEventListener(AssetsLoaderEvent.ASSETS_LOAD_STARTED, this.#eventHandlers.assetLoadProgress);
		assetsLoader.addEventListener(AssetsLoaderEvent.ASSET_LOAD_PROGRESS, this.#eventHandlers.assetLoadProgress);
		assetsLoader.addEventListener(AssetsLoaderEvent.ALL_ASSETS_LOADED, this.#eventHandlers.allAssetsLoaded);

		this.#buttonStartLoad.addEventListener("click", this.#eventHandlers.buttonStartClick, {once: true});
		this.#buttonStopLoad.addEventListener("click", this.#eventHandlers.buttonStopClick, {once: true});
		this.#buttonPauseLoad.addEventListener("click", this.#eventHandlers.buttonPauseClick);
		this.#buttonResumeLoad.addEventListener("click", this.#eventHandlers.buttonResumeClick);

		fetch("/config.json")
			.then(response => response.json())
			.then(json => {
				const data = json.data;
				for(let i = 0, len = data.length; i < len; i++) {
					let node = data[i];
					if(node.name === "assets") {
						this.#assetsList = node.list;
						this.#buttonStartLoad.disabled = false;
						break;
					}
				}
			});

	}


	#onStartLoadButtonClick(event) {
		this.#buttonStartLoad.disabled = true;
		this.#buttonStopLoad.disabled = false;
		this.#buttonPauseLoad.disabled = false;
		this.#assetsLoader.startLoad(this.#assetsList);
		this.#startLoadingProgressTextIndication();
	}


	#onPauseLoadButtonClick(event) {
		this.#assetsLoader.pauseLoad();
		clearInterval(this.#loadingIndicationInterval);
		this.#loadingIndicationInterval = null;
		this.#progressbarLoadingText.textContent = "Loading paused";
		this.#buttonPauseLoad.disabled = true;
		this.#buttonResumeLoad.disabled = false;
	}


	#onResumeLoadButtonClick(event) {
		this.#buttonResumeLoad.disabled = true;
		this.#buttonPauseLoad.disabled = false;
		this.#startLoadingProgressTextIndication();
		this.#assetsLoader.resumeLoad();
	}


	#onStopLoadButtonClick(event) {
		this.#buttonResumeLoad.disabled = true;
		this.#buttonPauseLoad.disabled = false;
		this.#assetsLoader.stopLoad();
		this.#onLoadStopped();
	}


	#onLoadProgress(event) {
		const assetsLoader = event.currentTarget;
		const progressbar = this.#progressbar;
		const progress = assetsLoader.progress;
		const progressText = progress + "%";
		progressbar.value = progress;
		progressbar.textContent = progressText;
		this.#progressbarText.textContent = `Loaded ${assetsLoader.loadedCount} from ${assetsLoader.total} (${progressText})`
	}


	#onAllAssetsLoaded(event) {
		this.#onLoadStopped();
	}


	#onLoadStopped() {
		const assetsLoader = this.#assetsLoader;
		this.#buttonStopLoad.disabled = true;
		this.#buttonPauseLoad.disabled = true;
		clearInterval(this.#loadingIndicationInterval);
		this.#loadingIndicationInterval = null;
		this.#progressbarLoadingText.textContent = "";

		assetsLoader.removeEventListener(AssetsLoaderEvent.ASSETS_LOAD_STARTED, this.#eventHandlers.assetLoadProgress);
		assetsLoader.removeEventListener(AssetsLoaderEvent.ASSET_LOAD_PROGRESS, this.#eventHandlers.assetLoadProgress);
		assetsLoader.removeEventListener(AssetsLoaderEvent.ALL_ASSETS_LOADED, this.#eventHandlers.allAssetsLoaded);

		this.#buttonStartLoad.removeEventListener("click", this.#eventHandlers.buttonStartClick);
		this.#buttonStopLoad.removeEventListener("click", this.#eventHandlers.buttonStopClick);
		this.#buttonPauseLoad.removeEventListener("click", this.#eventHandlers.buttonPauseClick);
		this.#buttonResumeLoad.removeEventListener("click", this.#eventHandlers.buttonResumeClick);
	}


	#startLoadingProgressTextIndication() {
		if(this.#loadingIndicationInterval) return;
		let i = 0;

		this.#loadingIndicationInterval = setInterval(() => {
			this.#progressbarLoadingText.textContent = "Loading" + [...new Array(i)].map(() => ".").join("");
			if(i === 3) {
				i = 0;
			} else {
				i++;
			}
		}, 400);
	}
}

new App();
