
// helpers
function cvw() { return isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth; }
function cvh() { return isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight; }
function randInt (min,max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function LoadingScreenContainer () {
	let e = document.createElement('div');
		e.style.background = 'transparent';
		e.style.position = 'absolute';
		e.style.display = 'inline-block';
		e.style.height = e.style.width = (cvh()/4).toString() + 'px';
		e.style.left = e.style.top = '50%';
		e.style.transform = 'translate(-50%, -50%)';
	return e;
}
function LoadingScreenRing (color, radius, thickness) {
	let e = document.createElement('div');
		e.style.background = 'transparent';
		e.style.position = 'absolute';
		e.style.display = 'inline-block';
		e.style.height = e.style.width = radius.toString() + '%';
		e.style.left = e.style.top = '50%';
		e.style.transform = 'translate(-50%, -50%)';
		e.style.borderRadius = '50%';
		e.style.border = thickness.toString() + 'px solid ' + color;
		// randomize border
		e.style.borderLeftColor = 'transparent';
		if (randInt(0,1)) e.style.borderRightColor = 'transparent';
		if (randInt(0,1)) e.style.borderBottomColor = 'transparent';
	return e;
}

class LoadingScreen {
	constructor (numRings, color) {
		this.parent = undefined;
		this.stopSignal = true;

		this.container = LoadingScreenContainer();
		this.rings = [];

		const MIN_RADIUS = 0.5;
		const THICKNESS = 2;
		const SPIN_RATE = 3000;
		const SPIN_VARIANCE = 500;
		for (let i = 0; i < numRings; i++) {
			let ring = {
				radius: 100 * (MIN_RADIUS + i*(1-MIN_RADIUS)/numRings),
				spinDir: randInt(0,1),
				spinRate: randInt(SPIN_RATE-SPIN_VARIANCE, SPIN_RATE+SPIN_VARIANCE),
				startAngle: randInt(0,359),
				domElement: undefined
			};
			ring.domElement = LoadingScreenRing(color, ring.radius, THICKNESS);
			this.container.appendChild(ring.domElement);
			this.rings.push(ring);
		}
	}
	attach (parent) {
		this.parent = parent ?? this.parent ?? document.body;
		this.parent.appendChild(this.container);
		this.stopSignal = false;
		this.animationLoop(this);
	}
	detach () {
		this.parent.removeChild(this.container);
		this.stopSignal = true;
	}
	animationLoop (self) {
		for (let ring of self.rings) {
			const rotSign = (ring.spinDir == 0) ? '-' : '';
			const rotMag = ring.startAngle + (Date.now()%ring.spinRate)/ring.spinRate * 360;
			ring.domElement.style.transform = 'translate(-50%, -50%) rotate(' + rotSign + rotMag + 'deg)';
		}
		if (self.stopSignal) return;
		requestAnimationFrame(() => {
			self.animationLoop(self)
		});
	}
}

////////////////////

/*

//// example usage ////

let loadingScreen = new LoadingScreen(7, '#00ff00');
loadingScreen.attach(document.body);

*/


