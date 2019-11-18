const tbody = document.querySelector("tbody");
const tabId = browser.devtools.inspectedWindow.tabId;
const filterValue = document.createElement("input");
const isRegexInput = document.createElement("input");

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
			rowNumber.textContent = row.parentNode.children.length;

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
				value.textContent = JSON.stringify(dt.value);

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

function filterData(text) {
	filterValue.removeAttribute("style");
	if (!text) { return true; }
	let filterText = filterValue.value.trim();
	if (!filterText) { return true; }
	if (isRegexInput.checked) {
		try {
			let re = new RegExp(filterText);
			return re.test(text);
		} catch (err) {
			filterValue.style.color = "red";
			return true;

		}
		return false;
	} else {
		return text.includes(filterText);
	}
	return false;
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
	if (!record.error && "url" in record) { /* request */
		let url = new URL(record.url);
		if (url && url.searchParams) {
			let d = url.searchParams.get("d");
			if (d && filterData(d)) {

				let row = tbody.insertRow();

				buildRequest(row, d);

				let node = document.documentElement;
				node.scrollTop = node.scrollHeight;
			}
		}
	} else {
		let row = tbody.insertRow();
		row.className = "error";

		let rowNumber = row.insertCell();
		rowNumber.textContent = row.parentNode.children.length;

		let errorCell = row.insertCell();
		errorCell.className = "error";
		errorCell.setAttribute("colspan", 3);
		errorCell.textContent = record.error;
	}
}

function syncTheme() {
	document.body.dataset.theme = browser.devtools.panels.themeName
}


document.querySelector("#clear").addEventListener("click", () => {
	tbody.innerHTML = "";
});

{
	let filterContainer = document.createElement("div");
	filterContainer.id = "filter-container";
	let label = document.createElement("label");
	isRegexInput.setAttribute("type", 'checkbox');
	filterValue.setAttribute("type", "text");
	filterContainer.appendChild(filterValue);
	label.appendChild(isRegexInput);
	label.appendChild(document.createTextNode("RegExp"));
	filterContainer.appendChild(label);
	let isOpen = false;

	document.querySelector("#filter").addEventListener("click", () => {
		if (!isOpen) {
			document.body.appendChild(filterContainer);
		} else {
			if (document.body.contains(filterContainer)) {
				filterContainer.remove();
			}
		}
		isOpen = !isOpen;
	});
}
browser.devtools.panels.onThemeChanged.addListener(syncTheme);

syncTheme();

let port = browser.runtime.connect(null, { name: JSON.stringify(tabId) });
port.onMessage.addListener(onMessage);
