/**
 * In the browser, node wot only works in client mode with limited binding support.
 * Supported bindings: HTTP / HTTPS / WebSockets
 * 
 * After adding the following <script> tag to your HTML page:
 * <script src="https://cdn.jsdelivr.net/npm/@node-wot/browser-bundle@latest/dist/wot-bundle.min.js" defer></script>
 * 
 * you can access all node-wot functionality / supported packages through the "Wot" global object. 
 * Examples: 
 * var servient = new Wot.Core.Servient(); 
 * var client = new Wot.Http.HttpClient();
 * 
 **/

// **GLOBAL CONSTANTS**
// If a property's `@type` field has this value it gets the gauge widget
const GAUGE_AT_TYPE = "range";

// If a property's `@type` field has this value it gets the sparkline widget
const SPARKLINE_AT_TYPE = "discrete";



// Timer ID used for live monitoring
let monitorTimerID;

// List of property widgets used in live monitoring
let propertyWidgets = [];


function get_td(addr) {
	servient.start().then((thingFactory) => {
		helpers.fetch(addr).then((td) => {
			thingFactory.consume(td)
			.then((thing) => {
				disableLiveMonitor();
				removeInteractions();
				showInteractions(thing);
				monitorTimerID = enableLiveMonitor(thing);
			});
		}).catch((error) => {
			window.alert("Could not fetch TD.\n" + error)
		})
	})
}


function showInteractions(thing) {
	let td = thing.getThingDescription();
	for ( let property in td.properties ) {
		if (td.properties.hasOwnProperty(property)) {
			let item = document.createElement("li");
			let link = document.createElement("a");
			link.appendChild(document.createTextNode(property));
			item.appendChild(link);
			document.getElementById("properties").appendChild(item);

			item.onclick = (click) => {
				thing.readProperty(property)
				.then(res => window.alert(property + ": " + res))
				.catch(err => window.alert("error: " + err))
			}

			// Add property widgets (live monitoring)
			if (td.properties[property]["@type"] !== undefined) {
				if (td.properties[property]["@type"] === "range"
				&& td.properties[property]["minimum"] !== undefined
				&& td.properties[property]["maximum"] !== undefined) {
					
					// Add a gauge when possible
					thing.readProperty(property).then(value => {
						const min = td.properties[property]["minimum"];
						const max = td.properties[property]["maximum"];
						const gauge = new Gauge(property, value, min, max);
						propertyWidgets.push(gauge);
						gauge.addToDom("propertyMonitor");
						
					});
				} else if (td.properties[property]["@type"] === "discrete") {

					// Add a sparkline when possible
					thing.readProperty(property).then(value => {
						const sparkline = new Sparkline(property, value, "°C");
						propertyWidgets.push(sparkline);
						sparkline.addToDom("propertyMonitor");
					});
				}
			} else {
				// Add a generic widget otherwise
				thing.readProperty(property).then(value => {
					const widget = new GenericWidget(property, value);
					propertyWidgets.push(widget);
					widget.addToDom("propertyMonitor");
				});
			}
		}
	};
	for ( let action in td.actions ) {
		if (td.actions.hasOwnProperty(action)) {
			let item = document.createElement("li");
			let button = document.createElement("button");
			button.appendChild(document.createTextNode(action));
			button.className = "button tiny secondary"
			item.appendChild(button)
			document.getElementById("actions").appendChild(item);

			item.onclick = (click) => { 
				showSchemaEditor(action, thing) 
			}
		}
	};
	let eventSubscriptions = {}
	for ( let evnt in td.events ) {
		if (td.events.hasOwnProperty(evnt)) {
			let item = document.createElement("li");
			let link = document.createElement("a");
			link.appendChild(document.createTextNode(evnt));

			let checkbox = document.createElement("div");
			checkbox.className = "switch small"
			checkbox.innerHTML = '<input id="' + evnt + '" type="checkbox">\n<label for="' + evnt + '"></label>'
			item.appendChild(link);
			item.appendChild(checkbox)
			document.getElementById("events").appendChild(item);

			checkbox.onclick = (click) => {
				if (document.getElementById(evnt).checked && !eventSubscriptions[evnt]) {
					eventSubscriptions[evnt] = thing.events[evnt].subscribe(
						(response) => { window.alert("Event " + evnt + " detected\nMessage: " + response); },
						(error) => { window.alert("Event " + evnt + " error\nMessage: " + error); }
					)
				} else if (!document.getElementById(evnt).checked && eventSubscriptions[evnt]) {
					eventSubscriptions[evnt].unsubscribe();
				}
			}
		}
	};
	// Check if visible
	let placeholder = document.getElementById("interactions")
	if ( placeholder.style.display === "none") {
		placeholder.style.display = "block"
	}
}

function removeInteractions() {
	for (id of ["properties", "actions", "events"]) {
		let placeholder = document.getElementById(id);
		while (placeholder.firstChild){
			placeholder.removeChild(placeholder.firstChild);
		}
	}
}

function showSchemaEditor(action, thing) {
	let td = thing.getThingDescription();
	// Remove old editor
	removeSchemaEditor()

	let placeholder = document.getElementById('editor_holder');
	let editor;
	if (td.actions[action] && td.actions[action].input ) {  
		td.actions[action].input.title = action
		editor = new JSONEditor(
			placeholder, 
			{
				schema: td.actions[action].input,
				form_name_root: action
			}
		);
	}
	// Add invoke button
	let button = document.createElement("button")
	button.appendChild(document.createTextNode("Invoke"))
	placeholder.appendChild(button)

	button.onclick = () => { 
		let input = editor ? editor.getValue() : "";
		thing.invokeAction(action, input)
		.then((res) => { 
			if (res) {
				window.alert("Success! Received response: " + res)
			} else {
				window.alert("Executed successfully.")
			}
		})
		.catch((err) => { window.alert(err) })
		removeSchemaEditor()
	};
}

function removeSchemaEditor() {
	let placeholder = document.getElementById('editor_holder');
	while (placeholder.firstChild){
    	placeholder.removeChild(placeholder.firstChild);
	}
}


function enableLiveMonitor(thing) {
	return setInterval(() => {

		propertyWidgets.forEach(widget => {
			thing.readProperty(widget.property)
			.then(value => {
				widget.update(value);
			})
		});

	}, 1000);
}


function disableLiveMonitor() {
	propertyWidgets.forEach(widget => widget.removeFromDom("propertyMonitor"));
	propertyWidgets = [];

	clearInterval(monitorTimerID);
}


var servient = new Wot.Core.Servient();
servient.addClientFactory(new Wot.Http.HttpClientFactory());
var helpers = new Wot.Core.Helpers(servient);
document.getElementById("fetch").onclick = () => { get_td(document.getElementById("td_addr").value);  };
