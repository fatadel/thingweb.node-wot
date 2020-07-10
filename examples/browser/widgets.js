class Widget {
    constructor(domID, property, initVal, symbol) {
        this.domID = domID;
		this.property = property;
		this.initVal = initVal;
		this.symbol = symbol;
    }

    addToDom(rootID) {
        // Assumes that rootID is a table
		const tbody = document.getElementById(rootID).getElementsByTagName("tbody")[0];
		const tr = document.createElement("tr");
        tr.innerHTML = `<td>${this.property}</td><td><div id="${this.domID}"></div></td>`;
        
        tbody.appendChild(tr);
    };

    removeFromDom(rootID) {
		let tbody = document.getElementById(rootID).getElementsByTagName("tbody")[0];
		for (const child of tbody.children) {
			if (child.querySelector("#" + this.domID)) {
				child.remove();
				break;
			}
		}
	};
}


class Gauge extends Widget {
	constructor(property, initVal, min, max, symbol="%", decimals=0) {
        const domID = "gauge-" + property;
        super(domID, property, initVal, symbol);

		this.min = min;
		this.max = max;
		this.decimals = decimals;
		this._gauge = undefined;
	}

	addToDom(rootID) {
		super.addToDom(rootID);

		this._gauge = new JustGage({
			id: this.domID,
			value: this.initVal,
			symbol: this.symbol,
			min: this.min,
			max: this.max,
			decimals: this.decimals,
			gaugeWidthScale: 0.6,
			label: this.property,
			labelFontColor: '#404040',
			labelMinFontSize: 12,
			pointer: true
		});
	};

	update(value) {
		if (!this._gauge) return;
		this._gauge.refresh(value);
	};
}


class Sparkline extends Widget {
	constructor(property, initVal, symbol, cacheLimit=100) {
        const domID = "sparkline-" + property;
        super(domID, property, initVal, symbol);

		this.cacheLimit = cacheLimit;
		this._cached_values = [initVal];
		this._sparkline = undefined;
	}

	addToDom(rootID) {
		super.addToDom(rootID);

		const options = {
			series: [{
				name: this.property,
				data: this.cachedValues
			}],
			chart: {
				type: 'area',
				height: 160,
				sparkline: {
					enabled: true
				},
			},
			stroke: {
				curve: 'straight'
			},
			fill: {
				opacity: 0.3
			},
			xaxis: {
				crosshairs: {
					width: 1
				},
			},
			title: {
				// show last value as title
				text: this.cachedValues[this.cachedValues.length - 1] + this.symbol,
				offsetX: 0,
				style: {
					fontSize: '24px',
				}
			},
			subtitle: {
				text: this.property,
				offsetX: 0,
				style: {
					fontSize: '14px',
				}
			}
		};

		this._sparkline = new ApexCharts(document.querySelector("#" + this.domID), options);
		this._sparkline.render();
	};

	update(value) {
		this.addToCache(value);

		if (!this._sparkline) return;

		// Update the sparkline graph
		this._sparkline.updateSeries([{
			data: this.cachedValues
		}]);

		// Update title with current value
		this._sparkline.updateOptions({
			title: {
				text: value + this.symbol
			}
		});
	};

	addToCache(value) {
		this._cached_values.push(value);

		if (this.cachedValues.length > this.cacheLimit) {
			this._cached_values.shift();
		}
	};

	get cachedValues() {
		return this._cached_values;
	}
}
