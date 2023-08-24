
const ASSET_TYPE_UNKNOWN = 'unknown';
const ASSET_TYPE_IMAGE = 'image';
const ASSET_TYPE_AUDIO = 'audio';

const FILETYPES_IMAGE = ['jpg','png'];
const FILETYPES_AUDIO = ['mp3','wav'];

class AssetLoader {
	constructor (root) {
		this.root = root;
		this.queue = [];
		this.assets = {};
	}
	get numLoading () { let n = 0; for (let asset of this.assets) n += (asset.loaded) ? 0 : 1; return n; }
	get numLoaded () { return this.assets.getOwnPropertyNames().length; }
	get numAssets () { return this.numLoading + this.numLoaded; }
	get (path) {
		const asset = (this.assets[path] && this.assets[path].loaded)
			? this.assets[path].object
			: undefined;
		console.log(asset);
		return asset;
	}
	add (path,type) {
		const ext = path.split('.').slice(-1);
		this.queue.push({path:path, type:type});
	}
	loadAll (doOnLoad=()=>{}) {
		const self = this;
		while (this.queue.length > 0) {
			const curr = this.queue.shift();
			switch (curr.type) {
				case 'image':
					this.assets[curr.path] = {
						path: curr.path,
						type: curr.type,
						object: new Image(),
						loaded: false
					};
					this.assets[curr.path].object.src = this.root + '/' + curr.path;
					this.assets[curr.path].object.onload = function () {
						console.log('Loaded ' + self.root + '/' + curr.path);
						self.assets[curr.path].loaded = true;
					};
					break;
				case 'audio':
					// no loader built yet
					break;
				default:
					console.warn('File type of ' + curr.path + ' cannot be loaded.');
			}
		}
		doOnLoad();
	}

}



////////////////////////////////////



//// example usage ////

// init loader
let loader = new AssetLoader('source');
// add resources
loader.add('map-large2.png', 'image');
loader.add('song-art.jpg', 'image');
// afterwards
loader.loadAll(() => {
	let mapStub = loader.get('map-large2.png');
	let musartStub = loader.get('song-art.jpg');
	console.log(mapStub);
	// document.body.appendChild(mapStub);
	// document.body.appendChild(musartStub);
});

