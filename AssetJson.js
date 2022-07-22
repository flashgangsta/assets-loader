import {AssetData} from "./AssetData.js";

export class AssetJson extends AssetData {

	constructor(url) {
		super(url);
	}


	load() {
		super.load("json");
	}


	get json() {
		return super.data;
	}
}
