
const COLORS_BLUE = Object.freeze({
	lineColor: '#88f7fc',
	glowColor: '#00ffff'
});
const COLORS_ORANGE = Object.freeze({
	lineColor: '#fca558',
	glowColor: '#f07d18'
});
const COLORS_GREEN = Object.freeze({
	lineColor: '#abff8a',
	glowColor: '#00ff20'
});

const DEFAULT_WIDGET_SETTINGS = Object.freeze({
	color: COLORS_ORANGE.lineColor,
	borderWidth: 2,
	borderRadius: 9,
	tabScaleH: 7,	// tab is 3 bubble wide, 1 bubbles tall
	tabScaleV: 1,
	appScaleH: 17,	// app is 6 bubbles wide, 3 bubbles tall
	appScaleV: 8
});

const DAYS_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const gameLocStub = {
	azi : 150.2
};
const weatherStub = {
	location : 'Los Angeles',
	lat : 34.067,
	lon : -118.440,
	condition : 'Mostly Cloudy',
	temperature : {
		c : 15.0,
		f : 59
	},
	hi : {
		c : 17.8,
		f : 64
	},
	lo : {
		c : 8.3,
		f : 47
	}
};
const audioStub = {
	title : 'AHX Log 024',
	paused : true,
	duration : 72.0,
	currentTime : 34.4,

	currentTimeStr : () => timeStr(audioStub.currentTime),
	durationStr : () => timeStr(audioStub.duration)
};

let preferredUnits = {
	time : '24',
	temperature : 'f',
	distance : 'm'
};

/////////////////////

function timeStr (seconds = 0) {
	let s = Math.floor(seconds % 60).toString().padStart(2,'0');
	let m = Math.floor(seconds/60) % 60;
	let M = (Math.floor(seconds/60) % 60).toString().padStart(2,'0');
	let h = Math.floor(seconds/60/60);
	return (h>0) ? (h+':'+M+':'+s) : (m+':'+s);
}
function latlonStr (coord = 0) {
	let s = (coord < 0) ? '' : '+';
	let c = coord.toFixed(3).padStart(7,'0');
	return s + c;
}

class WidgetController {
	constructor (colors, gridUnit) {
		this.settings = {};
		this.menu = [];
		this.widgets = [];
	}
	addWidget (gridX=0, gridY=0, widget) {
		// init handled per-widget
	}
	updateSettings () {
		for (let widget of this.menu)       widget.updateSettings(this.settings);
		for (let widget of this.panelLeft)  widget.updateSettings(this.settings);
	}
	tick () {
		for (let widget of this.menu)       widget.tick();
		for (let widget of this.panelLeft)  widget.tick();
	}
}

///////////////////////////////////////////

class Bubble {
	constructor (x, y) {
		this._parent = document.body;
		this._x = x ?? 0;
		this._y = y ?? 0;

		this.domElement = document.createElement('div');
		this.domElement.classList.add('bubble');

		// apply initial settings per-widget
		this.setPos();
		this.updateSettings();
	}
	get x () { return this._x; }
	set x (x) { this.setPos(x,undefined); }
	get y () { return this._y; }
	set y (y) { this.setPos(undefined,y); }
	setPos(x, y) {
		this._x = x ?? this._x ?? 0;
		this._y = y ?? this._y ?? 0;
		this.domElement.style.left = this._x;
		this.domElement.style.top  = this._y;
	}
	attach (parent) {
		this._parent = parent ?? this._parent ?? document.body;
		parent.appendChild(this.domElement);
	}
	detach () {
		this._parent.removeChild(this.domElement);
	}
	updateSettings (settings={}) {}
	tick () {}
}

class BubbleClockDigital extends Bubble {
	constructor (x, y) {
		super(x,y);

		this.timeText = document.createElement('div');
		this.timeText.style.fontSize = 'calc(0.65 * var(--grid-unit))';
		this.domElement.appendChild(this.timeText);

		this.tick();
	}
	tick () {
		const d = new Date();
		const HH = d.getHours().toString().padStart(2,'0');
		const mm = d.getMinutes().toString().padStart(2,'0');
		this.timeText.innerHTML = HH + ':' + mm;
	}
}
class BubbleClockAnalogue extends Bubble {
	constructor (x, y) {
		super(x,y);

		this.center = document.createElement('div');
		this.center.classList.add('circle-filled');
		this.center.style.width = this.center.style.height = '7%';
		this.domElement.appendChild(this.center);

		this.secondHand = document.createElement('div');
		this.secondHand.classList.add('clock-hand');
		// this.secondHand.style.width = '1px';
		// this.secondHand.style.height = 'calc(0.75 * var(--grid-unit))';
		this.domElement.appendChild(this.secondHand);

		this.minuteHand = document.createElement('div');
		this.minuteHand.classList.add('clock-hand');
		this.minuteHand.style.width = '1.5px';
		// this.minuteHand.style.height = 'calc(0.75 * var(--grid-unit))';
		this.domElement.appendChild(this.minuteHand);

		this.hourHand = document.createElement('div');
		this.hourHand.classList.add('clock-hand');
		this.hourHand.style.width = '2.5px';
		this.hourHand.style.height = 'calc(0.5 * var(--grid-unit))';
		this.domElement.appendChild(this.hourHand);

		this.tick();
	}
	tick () {
		const d = new Date();
		const thetaSeconds = 2*Math.PI * (d.getSeconds() / 60);
		const thetaMinutes = 2*Math.PI * (d.getMinutes() / 60);
		const thetaHours   = 2*Math.PI * ((d.getHours()%12) / 12);
		this.secondHand.style.transform = 'translate(-50%,-100%) rotate(' + thetaSeconds + 'rad)';
		this.minuteHand.style.transform = 'translate(-50%,-100%) rotate(' + thetaMinutes + 'rad)';
		this.hourHand.style.transform = 'translate(-50%,-100%) rotate(' + thetaHours + 'rad)';
	}
}
class BubbleClockFoundation extends Bubble {
	constructor (x, y) {
		super(x,y);

		this.timeText = document.createElement('div');
		this.timeText.style.fontSize = 'calc(0.8 * var(--grid-unit))';
		this.domElement.appendChild(this.timeText);

		this.secondsDot = document.createElement('div');
		this.secondsDot.classList.add('circle-filled');
		this.secondsDot.style.width = this.secondsDot.style.height = 'calc(0.15 * var(--grid-unit))';
		this.secondsDot.style.transform = 'translate(-50%,-50%) rotate(0deg) translate(0,calc(-0.7 * var(--grid-unit)))';
		this.domElement.appendChild(this.secondsDot);

		this.minutesDot = document.createElement('div');
		this.minutesDot.classList.add('circle');
		this.minutesDot.style.width = this.minutesDot.style.height = 'calc(0.3 * var(--grid-unit))';
		this.minutesDot.style.transform = 'translate(-50%,-50%) rotate(0deg) translate(0,calc(-0.7 * var(--grid-unit)))';
		this.domElement.appendChild(this.minutesDot);

		this.tick();
	}
	tick () {
		const d = new Date();
		const HH = d.getHours().toString().padStart(2,'0');
		const thetaSeconds = 2*Math.PI * (d.getSeconds() / 60);
		const thetaMinutes = 2*Math.PI * (d.getMinutes() / 60);
		this.timeText.innerHTML = HH;
		this.secondsDot.style.transform = 'translate(-50%,-50%) rotate('+thetaSeconds+'rad) translate(0,calc(-0.7 * var(--grid-unit)))';
		this.minutesDot.style.transform = 'translate(-50%,-50%) rotate('+thetaMinutes+'rad) translate(0,calc(-0.7 * var(--grid-unit)))';
	}
}
class BubbleCalendar extends Bubble {
	constructor (x, y) {
		super(x,y);

		this.monthText = document.createElement('div');
		this.monthText.style.top = '25%';
		this.monthText.style.fontSize = 'calc(0.5 * var(--grid-unit))';
		this.domElement.appendChild(this.monthText);

		this.dayText = document.createElement('div');
		this.dayText.style.top = '60%';
		this.dayText.style.fontSize = 'calc(1.0 * var(--grid-unit))';
		this.domElement.appendChild(this.dayText);

		this.tick();
	}
	tick () {
		const d = new Date();
		this.dayText.innerHTML = d.getDate();
		this.monthText.innerHTML = MONTHS_SHORT[d.getMonth()];
	}
}
class BubblePlayer extends Bubble {
	constructor (x, y) {
		super(x,y);

		this.icon = document.createElement('div');
		this.icon.innerHTML = '<div class="icon-play"></div>';
		this.domElement.appendChild(this.icon);

		this.tick();
	}
	tick () {
		// this.icon.innerHTML = '<div class="icon-play"></div>';
	}
}
class BubblePlayerDummy extends BubblePlayer {
	constructor (x,y) {
		super(x,y);
		this.icon.innerHTML = '<div class="icon-pause"></div>';
	}
}
class BubbleWeather extends Bubble {
	constructor (x, y) {
		super(x,y);

		this.temperatureText = document.createElement('div');
		this.temperatureText.style.fontSize = 'calc(0.85 * var(--grid-unit))';
		this.temperatureText.style.left = 'calc(50% + 0.15 * var(--grid-unit))';
		this.domElement.appendChild(this.temperatureText);

		this.tick();
	}
	tick () {
		const dummyUnits = {
			f : '<sup>F</sup>',
			c : '<sup>C</sup>',
			deg : '°'
		};
		const c = Math.round( weatherStub.temperature[preferredUnits.temperature] );
		const u = dummyUnits['deg'];
		this.temperatureText.innerHTML = c + u;
	}
}
class BubbleHeartrate extends Bubble {
	constructor (x, y) {
		super(x,y);

		this.icon = document.createElement('div');
		this.icon.innerHTML = getSvgHeart(getCSSVar('--line-color-orange'));
		this.domElement.appendChild(this.icon);

		this.tick();
	}
	tick () {}
}
class BubbleCompass extends Bubble {
	constructor (x, y) {
		super(x,y);

		this.center = document.createElement('div');
		this.center.style.backgroundColor = 'var(--line-color-orange)';
		this.center.style.width = this.center.style.height = '15%';
		this.center.style.transform = 'translate(-50%,-50%) rotate(-45deg) skew(165deg,165deg)';
		this.domElement.appendChild(this.center);

		this.north = document.createElement('div');
		this.north.innerHTML = 'N';
		this.north.style.fontSize = 'calc(0.4 * var(--grid-unit))';
		this.north.style.transformOrigin = '50% 50%';
		this.north.style.transform = 'translate(-50%,calc(-50% - 0.6 * var(--grid-unit)))';
		this.domElement.appendChild(this.north);

		this.south = document.createElement('div');
		this.south.innerHTML = 'S';
		this.south.style.fontSize = 'calc(0.4 * var(--grid-unit))';
		this.south.style.transformOrigin = '50% 50%';
		this.south.style.transform = 'translate(-50%,calc(-50% + 0.6 * var(--grid-unit)))';
		this.domElement.appendChild(this.south);

		this.east = document.createElement('div');
		this.east.innerHTML = 'E';
		this.east.style.fontSize = 'calc(0.4 * var(--grid-unit))';
		this.east.style.transformOrigin = '50% 50%';
		this.east.style.transform = 'translate(calc(-50% + 0.6 * var(--grid-unit)),-50%)';
		this.domElement.appendChild(this.east);

		this.west = document.createElement('div');
		this.west.innerHTML = 'W';
		this.west.style.fontSize = 'calc(0.4 * var(--grid-unit))';
		this.west.style.transformOrigin = '50% 50%';
		this.west.style.transform = 'translate(calc(-50% - 0.6 * var(--grid-unit)),-50%)';
		this.domElement.appendChild(this.west);

		this.tick();
	}
	tick () {
		const rotStr = 'rotate(-'+gameLocStub.azi+'deg)';
		const unrotStr = 'rotate('+gameLocStub.azi+'deg)';
		this.north.style.transform = 'translate(-50%,-50%) ' + rotStr + ' translate(0%,calc(0% - 0.6 * var(--grid-unit))) ' + unrotStr;
		this.south.style.transform = 'translate(-50%,-50%) ' + rotStr + ' translate(0%,calc(0% + 0.6 * var(--grid-unit))) ' + unrotStr;
		this.east.style.transform  = 'translate(-50%,-50%) ' + rotStr + ' translate(calc(0% + 0.6 * var(--grid-unit)),0%) ' + unrotStr;
		this.west.style.transform  = 'translate(-50%,-50%) ' + rotStr + ' translate(calc(0% - 0.6 * var(--grid-unit)),0%) ' + unrotStr;
	}
}

class Tab {
	constructor (x, y) {
		this._parent = document.body;
		this._x = x ?? 0;
		this._y = y ?? 0;

		this.domElement = document.createElement('div');
		this.domElement.classList.add('tab');

		this.bubble = new Bubble();

		// apply initial settings per-widget
		this.setPos();
		this.updateSettings();
	}
	get x () { return this._x; }
	set x (x) { this.setPos(x,undefined); }
	get y () { return this._y; }
	set y (y) { this.setPos(undefined,y); }
	setPos(x, y) {
		this._x = x ?? this._x ?? 0;
		this._y = y ?? this._y ?? 0;
		this.domElement.style.left = this.bubble.domElement.style.left = this._x;
		this.domElement.style.top = this.bubble.domElement.style.top  = this._y;
	}
	attach (parent) {
		this._parent = parent ?? this._parent ?? document.body;
		parent.appendChild(this.domElement);
		parent.appendChild(this.bubble.domElement);
	}
	detach () {
		this._parent.removeChild(this.domElement);
		this._parent.removeChild(this.bubble.domElement);
	}
	updateSettings (settings={}) {}
	tick () {}
}

class TabClock extends Tab {
	constructor (x, y) {
		super(x,y);

		this.bubble = new BubbleClockFoundation();

		this.timeText = document.createElement('div');
		this.timeText.style.fontSize = 'calc(1.2 * var(--grid-unit))';
		this.timeText.style.left = 'calc(50% - 0.25 * var(--grid-unit))';
		this.domElement.appendChild(this.timeText);

		this.setPos();
		this.tick();
	}
	tick () {
		const d = new Date();
		const HH = d.getHours().toString().padStart(2,'0');
		const mm = d.getMinutes().toString().padStart(2,'0');
		this.timeText.innerHTML = HH + ':' + mm;
		
		this.bubble.tick();
	}
}
class TabCalendar extends Tab {
	constructor (x, y) {
		super(x,y);

		this.bubble = new BubbleCalendar();

		this.dayText = document.createElement('div');
		this.dayText.style.fontSize = 'calc(0.5 * var(--grid-unit))';
		this.dayText.style.top = '25%';
		this.dayText.style.left = '5%';
		this.dayText.style.transform = 'translate(0,-50%)'; // left anchor
		this.domElement.appendChild(this.dayText);

		this.dateText = document.createElement('div');
		this.dateText.style.fontSize = 'calc(0.9* var(--grid-unit))';
		this.dateText.style.top = '65%';
		this.dateText.style.left = '5%';
		this.dateText.style.transform = 'translate(0,-50%)'; // left anchor
		this.domElement.appendChild(this.dateText);

		this.setPos();
		this.tick();
	}
	tick () {
		const d = new Date();
		const EEEE = DAYS_LONG[ d.getDay() ];
		const mm = (d.getMonth() + 1).toString().padStart(2,'0');
		const dd = d.getDate().toString().padStart(2,'0');
		const yyyy = d.getFullYear().toString();
		this.dayText.innerHTML = EEEE;
		this.dateText.innerHTML = mm + '/' + dd + '/' + yyyy;
		
		this.bubble.tick();
	}
}
class TabWeather extends Tab {
	constructor (x, y) {
		super(x,y);

		this.bubble = new BubbleWeather();

		this.locText = document.createElement('div');
		this.locText.style.fontSize = 'calc(0.8 * var(--grid-unit))';
		// this.locText.style.left = '45%'; // re-center if translate(-50%,x)
		this.locText.style.top = '32%';
		this.locText.style.left = '5%';
		this.locText.style.transform = 'translate(0,-50%)'; // left anchor
		this.domElement.appendChild(this.locText);

		this.conditionText = document.createElement('div');
		this.conditionText.style.fontSize = 'calc(0.45 * var(--grid-unit))';
		this.conditionText.style.top = '75%';
		this.conditionText.style.left = '6%';
		this.conditionText.style.transform = 'translate(0,-50%)'; // left anchor
		this.domElement.appendChild(this.conditionText);

		this.hiloText = document.createElement('div');
		this.hiloText.style.fontSize = 'calc(0.45 * var(--grid-unit))';
		this.hiloText.style.top = '75%';
		this.hiloText.style.left = '83%';
		this.hiloText.style.transform = 'translate(-100%,-50%)'; // right anchor
		this.domElement.appendChild(this.hiloText);

		this.setPos();
		this.tick();
	}
	tick () {
		this.locText.innerHTML = weatherStub.location;
		this.conditionText.innerHTML = weatherStub.condition;
		this.hiloText.innerHTML = Math.round(weatherStub.hi[preferredUnits.temperature]) + '/' + Math.round(weatherStub.lo[preferredUnits.temperature]);
		
		this.bubble.tick();
	}
}
class TabPlayer extends Tab {
	constructor (x, y) {
		super(x,y);

		this.bubble = new BubblePlayer();

		this.titleText = document.createElement('div');
		this.titleText.style.fontSize = 'calc(0.55 * var(--grid-unit))';
		this.titleText.style.left = '45%'; // re-center if translate(-50%,x)
		this.titleText.style.top = '32%';
		this.domElement.appendChild(this.titleText);

		this.progressBarBase = document.createElement('div');
		this.progressBarBase.style.backgroundColor = 'var(--line-color-orange-transparent)';
		this.progressBarBase.style.width = '78%';
		this.progressBarBase.style.height = '3%';
		this.progressBarBase.style.left = '5%';
		this.progressBarBase.style.top = '65%';
		this.progressBarBase.style.transform = 'translate(0,-50%)'; // left anchor
		this.domElement.appendChild(this.progressBarBase);

		this.progressBar = document.createElement('div');
		this.progressBar.style.backgroundColor = 'var(--line-color-orange)';
		this.progressBar.style.height = '3%';
		this.progressBar.style.left = '5%';
		this.progressBar.style.top = '65%';
		this.progressBar.style.transform = 'translate(0,-50%)'; // left anchor
		this.domElement.appendChild(this.progressBar);

		this.currentTimeText = document.createElement('div');
		this.currentTimeText.style.fontSize = 'calc(0.45 * var(--grid-unit))';
		this.currentTimeText.style.left = '5%';
		this.currentTimeText.style.top = '80%';
		this.currentTimeText.style.transform = 'translate(0,-50%)'; // left anchor
		this.domElement.appendChild(this.currentTimeText);

		this.durationText = document.createElement('div');
		this.durationText.style.fontSize = 'calc(0.45 * var(--grid-unit))';
		this.durationText.style.left = '83%';
		this.durationText.style.top = '80%';
		this.durationText.style.transform = 'translate(-100%,-50%)'; // right anchor
		this.domElement.appendChild(this.durationText);

		this.setPos();
		this.tick();
	}
	tick () {
		this.titleText.innerHTML = audioStub.title;
		this.progressBar.style.width = (78 * audioStub.currentTime/audioStub.duration) + '%';
		this.currentTimeText.innerHTML = timeStr(audioStub.currentTime);
		this.durationText.innerHTML = timeStr(audioStub.duration);
		
		this.bubble.tick();
	}
}
class TabCompass extends Tab {
	constructor (x, y) {
		super(x,y);

		this.bubble = new BubbleCompass();

		this.latText = document.createElement('div');
		this.latText.style.fontSize = 'calc(0.5 * var(--grid-unit))';
		this.latText.style.top = '30%';
		this.latText.style.left = '5%';
		this.latText.style.transform = 'translate(0,-50%)'; // left anchor
		this.domElement.appendChild(this.latText);

		this.lonText = document.createElement('div');
		this.lonText.style.fontSize = 'calc(0.5 * var(--grid-unit))';
		this.lonText.style.top = '70%';
		this.lonText.style.left = '5%';
		this.lonText.style.transform = 'translate(0,-50%)'; // left anchor
		this.domElement.appendChild(this.lonText);

		this.aziText = document.createElement('div');
		this.aziText.style.fontSize = 'calc(1.0 * var(--grid-unit))';
		this.aziText.style.top = '50%';
		this.aziText.style.left = '69%';
		this.domElement.appendChild(this.aziText);

		this.setPos();
		this.tick();
	}
	tick () {
		this.latText.innerHTML = 'lat' + latlonStr(weatherStub.lat);
		this.lonText.innerHTML = 'lon' + latlonStr(weatherStub.lon);
		this.aziText.innerHTML = Math.round(gameLocStub.azi) + '°';
		
		this.bubble.tick();
	}
}

class App {
	constructor (x, y) {
		this._parent = document.body;
		this._x = x ?? 0;
		this._y = y ?? 0;

		this.domElement = document.createElement('div');
		this.domElement.classList.add('app');

		this.bubble = new Bubble();

		// apply initial settings per-widget
		this.setPos();
		this.updateSettings();
	}
	get x () { return this._x; }
	set x (x) { this.setPos(x,undefined); }
	get y () { return this._y; }
	set y (y) { this.setPos(undefined,y); }
	setPos(x, y) {
		this._x = x ?? this._x ?? 0;
		this._y = y ?? this._y ?? 0;
		this.domElement.style.left = this.bubble.domElement.style.left = this._x;
		this.domElement.style.top = this.bubble.domElement.style.top  = this._y;
	}
	attach (parent) {
		this._parent = parent ?? this._parent ?? document.body;
		parent.appendChild(this.domElement);
		parent.appendChild(this.bubble.domElement);
	}
	detach () {
		this._parent.removeChild(this.domElement);
		this._parent.removeChild(this.bubble.domElement);
	}
	updateSettings (settings={}) {}
	tick () {}
}


/////////////////////////////////////////////



