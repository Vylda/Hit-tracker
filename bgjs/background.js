const requests = {};
const ports = {};

const filter = {
	urls: ["<all_urls>"],
	types: ["image"]
};


function onBeforeRequest(request) {

	let regex = /^https?:\/\/h.imedia.cz\/hit\//;
	if (!regex.test(request.url)) {
		return;
	}

	let tabId = request.tabId;
	let port = ports[tabId];
	if (!port) { return; } // no devtool avail, sorry

	let id = request.requestId;

	let filter = browser.webRequest.filterResponseData(id);
	filter.onstop = () => {
		filter.disconnect();
	}
	filter.ondata = event => {
		filter.write(event.data);
	}

	let body = request.requestBody;
	if (body) { body = body.raw[0].bytes; }

	requests[id] = {
		id,
		tabId,
		type: null,
		url: request.url,
		body
	}
}

function onBeforeSendHeaders(request) {
	let id = request.requestId;
	let record = requests[id];
	if (!record) { return; }
	delete requests[id];

	ports[record.tabId].postMessage(record);
}

function onErrorOccurred(details) {
	let id = details.requestId;
	delete requests[id];

	let record = {
		id,
		error: details.error
	}
	ports[details.tabId].postMessage(record);
}

browser.webRequest.onBeforeRequest.addListener(onBeforeRequest, filter, ["requestBody", "blocking"]);
browser.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders, filter, ["requestHeaders"]);
browser.webRequest.onErrorOccurred.addListener(onErrorOccurred, filter);

browser.runtime.onConnect.addListener(p => {
	let tabId = JSON.parse(p.name);
	ports[tabId] = p;
});
