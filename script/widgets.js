
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

class WidgetController {
	constructor (colors, gridUnit) {
		this.settings = {};
		this.menu = [];
		this.widgets = [];
	}
	addWidget (gridX=0, gridY=0, widget) {
		// do stuff
		// no initial update, it's handled per-widget
	}
	updateSettings () {
		for (let widget of this.menu)       widget.updateSettings(this);
		for (let widget of this.panelLeft)  widget.updateSettings(this);
	}
	tick () {
		for (let widget of this.menu)       widget.tick();
		for (let widget of this.panelLeft)  widget.tick();
	}
}

///////////////////////////////////////////

class Bubble {
	constructor (x, y, settings={}) {
		this._x = x ?? 0;
		this._y = y ?? 0;
		this.settings = {
			color: settings.color ?? DEFAULT_WIDGET_SETTINGS.color,
			gridUnit: settings.gridUnit ?? DEFAULT_WIDGET_SETTINGS.gridUnit,
			borderWidth : settings.borderRadius ?? DEFAULT_WIDGET_SETTINGS.borderRadius
		};

		// bubble border
		this.border = document.createElement('div');
		this.border.style.borderRadius = '50%';
		c.appendChild(border);
		// bubble container
		this.domElement = document.createElement('div');
		this.domElement.style.borderRadius = '50%';
		this.domElement.style.overflow = 'hidden';
		tc.appendChild(domElement);

		// apply initial settings per-widget
		this.setPos();
		this.updateSettings();
	}
	set x (x) { this.setPos(x,undefined); }
	set y (y) { this.setPos(undefined,y); }
	setPos(x, y) {
		this._x = parseFloat(x) ?? this._x ?? 0;
		this._y = parseFloat(y) ?? this._y ?? 0;
		this.border.style.left   = this.domElement.style.left   = Math.round(this._x - this.settings.gridUnit).toString() + 'px';
		this.border.style.top    = this.domElement.style.top    = Math.round(this._y - this.settings.gridUnit).toString() + 'px';
	}
	updateSettings (settings={}) {
		this.settings = {
			color:			settings.color ?? this.settings.color ?? DEFAULT_WIDGET_SETTINGS.color,
			gridUnit:		settings.gridUnit ?? this.settings.gridUnit ?? DEFAULT_WIDGET_SETTINGS.gridUnit,
			borderWidth :	settings.borderRadius ?? this.settings.borderRadius ?? DEFAULT_WIDGET_SETTINGS.borderRadius
		};
		// color
		this.bubble.style.border = this.settings.borderWidth.toString() + 'px solid ' + this.settings.color;
		// grid unit
		this.border.style.width  = this.domElement.style.width  = Math.round(2*this.settings.gridUnit).toString() + 'px';
		this.border.style.height = this.domElement.style.height = Math.round(2*this.settings.gridUnit).toString() + 'px';
		this.border.style.left   = this.domElement.style.left   = Math.round(this._x - this.settings.gridUnit).toString() + 'px';
		this.border.style.top    = this.domElement.style.top    = Math.round(this._y - this.settings.gridUnit).toString() + 'px';
	}
	tick () {
		// no-op
	}
}


