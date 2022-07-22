import {AssetImage} from "./AssetImage.js";
import {AssetsLoaderEvent} from "./AssetsLoaderEvent.js";
import {AssetMedia} from "./AssetMedia.js";
import {AssetJson} from "./AssetJson.js";
import {AssetTxt} from "./AssetTxt.js";

export class AssetsLoader extends EventTarget {

	#loadedCount = 0;
	#total = 0;
	#assetsListByURL = {};
	#notLoadedAssetsListByURL = {};
	#loadedAssetsListByUrl = {};
	#eventHandlers = {};

	constructor() {
		super();
	}

	startLoad(assetURLsList, downloadTogether=true) {
		assetURLsList.forEach((url, index) => {
			if(url && typeof url === "string" && !this.#assetsListByURL.hasOwnProperty(url)) {
				const extension = this.#getFileExtension(url);
				let handlers = this.#eventHandlers[url] = {};
				let asset;
				switch (extension) {
					case "jpg":
					case "jpeg":
					case "jpe":
					case "png":
					case "gif":
					case "bmp":
					case "ico":
					case "apng":
					case "svg":
					case "webp":
					case "odd":
						asset = new AssetImage(url);
						break;
					case "mp3":
					case "wav":
					case "aac":
					case "flac":
					case "ogg":
						asset = new AssetMedia(url, AssetMedia.TYPE_AUDIO);
						break;
					case "webm":
					case "mp4":
						asset = new AssetMedia(url, AssetMedia.TYPE_VIDEO);
						break;
					case "json":
						asset = new AssetJson(url);
						break;
					case "txt":
						asset = new AssetTxt(url);
						break;
				}
				this.#total ++;
				this.#assetsListByURL[url] = this.#notLoadedAssetsListByURL[url] = asset;

				handlers.loaded = this.#onAssetLoaded.bind(this);
				handlers.stopped = this.#onAssetLoadStopped.bind(this);

				asset.addEventListener(AssetsLoaderEvent.ASSET_LOADED, handlers.loaded, {once: true});
				asset.addEventListener(AssetsLoaderEvent.ASSET_LOAD_STOPPED, handlers.stopped, {once: true});
				asset.load();
			}
		});

		this.dispatchEvent(new AssetsLoaderEvent(AssetsLoaderEvent.ASSETS_LOAD_STARTED));
	}

	pauseLoad() {
		const notLoadedAssets = this.#notLoadedAssetsListByURL;
		for(let key in notLoadedAssets) {
			let asset = notLoadedAssets[key];
			asset.pause();
		}
	}

	stopLoad() {
		const assets = this.#assetsListByURL;
		for(let key in assets) {
			let asset = assets[key];
			if(asset.isLoading) {
				asset.stop();
			}
		}
	}


	resumeLoad() {
		const notLoadedAssets = this.#notLoadedAssetsListByURL;
		for(let key in notLoadedAssets) {
			let asset = notLoadedAssets[key];
			asset.resume();
		}
	}


	getAssetByURL(url) {
		return (this.#assetsListByURL || this.#loadedAssetsListByUrl)[url];
	}


	getLoadedAssets() {
		return this.#loadedAssetsListByUrl;
	}


	get progress() {
		return Math.floor(this.#loadedCount / this.#total * 100 || 0);
	}


	get loadedCount() {
		return this.#loadedCount;
	}


	get total() {
		return this.#total;
	}


	#onAssetLoaded(event) {
		const asset = event.currentTarget;
		const url = asset.url;
		delete this.#notLoadedAssetsListByURL[url];
		this.#loadedAssetsListByUrl[url] = asset;
		this.#loadedCount ++;
		this.dispatchEvent(new AssetsLoaderEvent(AssetsLoaderEvent.ASSET_LOAD_PROGRESS));
		if(this.#loadedCount === this.#total) {
			this.dispatchEvent(new AssetsLoaderEvent(AssetsLoaderEvent.ALL_ASSETS_LOADED));
		}
	}


	#onAssetLoadStopped(event) {
		const asset = event.currentTarget;
		const url = asset.url;
		const handlers = this.#eventHandlers[url];
		asset.removeEventListener(AssetsLoaderEvent.ASSET_LOADED, handlers.loaded);
		asset.removeEventListener(AssetsLoaderEvent.ASSET_LOAD_STOPPED, handlers.stopped);
		delete this.#notLoadedAssetsListByURL[url];
		delete this.#assetsListByURL[url];
		this.#total--;
		this.dispatchEvent(new AssetsLoaderEvent(AssetsLoaderEvent.ASSET_LOAD_PROGRESS));
	}


	#getFileExtension(url) {
		return url.split('.').pop().toLowerCase();
	}
}
