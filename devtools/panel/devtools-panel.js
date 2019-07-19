const tbody = document.querySelector("tbody");
const tabId = browser.devtools.inspectedWindow.tabId;
let rows = {};

function toConsole(data) {
	let cmd = `inspect(${JSON.stringify(data)})`;
	browser.devtools.inspectedWindow.eval(cmd);
}

function buildRequest(row, d) {
	try {
		let dObj = JSON.parse(d)
		if ("action" in dObj) {
			let action = "", data = [], keys = Object.keys(dObj);

			keys.forEach(key => {
				if (key == "action" && !action) {
					action = dObj.action;
				} else {
					data.push({ "name": key, "value": dObj[key] });
				}
			});

			let rowNumber = row.insertCell();
			rowNumber.textContent = Object.keys(rows).length;

			let actionCell = row.insertCell();
			actionCell.textContent = action;
			actionCell.className = "action";

			let paramNameCell = row.insertCell();
			let paramValueCell = row.insertCell();

			paramValueCell.onclick = () => {
				let dataToConsole = Object.assign({}, dObj);
				toConsole(dataToConsole);
			};

			data.forEach(dt => {
				let name = document.createElement("span");
				let value = document.createElement("span");

				name.textContent = dt.name;
				value.textContent = dt.value;

				paramNameCell.appendChild(name);
				paramValueCell.appendChild(value);
			});
		}
	} catch (err) {
		let errorCell = row.insertCell();
		errorCell.textContent = err;
		errorCell.setAttribute("colspan", 4);
		console.error(err);
	}
}


/**
 * @param {object} record
 * @param {string} record.id
 * @param {string} record.tabId
 * @param {null||string} record.type
 * @param {number} [record.status]
 * @param {string} [record.url]
 */
function onMessage(record) {
	let id = record.id;
	let row = rows[id];

	if (row) { /* response */
		delete rows[id];
	} else if (!record.error && "url" in record) { /* request */
		let url = new URL(record.url);
		if (url && url.searchParams) {
			let d = url.searchParams.get("d");
			if (d) {
				let row = tbody.insertRow();
				rows[id] = row;

				buildRequest(row, d);

				let node = document.documentElement;
				node.scrollTop = node.scrollHeight;
			}
		}
	}
}

function syncTheme() {
	document.body.dataset.theme = browser.devtools.panels.themeName
}


document.querySelector("#clear").onclick = () => {
	tbody.innerHTML = "";
	rows = {};
}

browser.devtools.panels.onThemeChanged.addListener(syncTheme);

syncTheme();

let port = browser.runtime.connect(null, { name: JSON.stringify(tabId) });
port.onMessage.addListener(onMessage);
