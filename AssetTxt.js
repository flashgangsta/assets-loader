import {AssetData} from "./AssetData.js";

export class AssetTxt extends AssetData {

	constructor(url) {
		super(url);
	}


	load() {
		super.load("text")
	}


	get text() {
		return super.data;
	}
}