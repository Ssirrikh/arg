
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

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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
		this._x = x ?? 0;
		this._y = y ?? 0;

		this.domElement = document.createElement('div');
		this.domElement.classList.add('bubble');
		document.body.appendChild(this.domElement);

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
class BubbleMusicPlayer extends Bubble {
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
class BubbleMusicPlayerDummy extends BubbleMusicPlayer {
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
		const dummyTemperature = 59;
		this.temperatureText.innerHTML = dummyTemperature + dummyUnits['deg'];
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

		this.north = document.createElement('div');
		this.north.innerHTML = '<b>N</b>';
		this.north.style.fontSize = 'calc(0.5 * var(--grid-unit))';
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
		const AZIMUTH = 28;
		const rotStr = 'rotate(-'+AZIMUTH+'deg)';
		const unrotStr = 'rotate('+AZIMUTH+'deg)';
		this.north.style.transform = 'translate(-50%,-50%) ' + rotStr + ' translate(0%,calc(0% - 0.6 * var(--grid-unit))) ' + unrotStr;
		this.south.style.transform = 'translate(-50%,-50%) ' + rotStr + ' translate(0%,calc(0% + 0.6 * var(--grid-unit))) ' + unrotStr;
		this.east.style.transform  = 'translate(-50%,-50%) ' + rotStr + ' translate(calc(0% + 0.6 * var(--grid-unit)),0%) ' + unrotStr;
		this.west.style.transform  = 'translate(-50%,-50%) ' + rotStr + ' translate(calc(0% - 0.6 * var(--grid-unit)),0%) ' + unrotStr;
	}
}

/////////////////////////////////////////////



