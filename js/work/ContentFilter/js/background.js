const injectScriptWithUuid = uuid => {
	if (!uuid) {
		setTimeout(function() {
			injectScriptWithUuid(window.uuid);
		}, 500);
	} else {	
		chrome.tabs.executeScript({
			code: `localStorage.setItem("user_uuid", "${uuid}");console.log("${uuid}");`
		});
		// chrome.tabs.executeScript({
		// 	file: `main.js`
		// });
	}
};

injectScriptWithUuid(window.uuid);