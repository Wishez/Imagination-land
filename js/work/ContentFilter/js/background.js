chrome.app.runtime.onLaunched.addListener(function() {
  // chrome.app.window.create('window.html', {
  //   'outerBounds': {
  //     'width': 550,
  //     'height': 400
  //   }
  // });
  chrome.tabs.query({ //This method output active URL 
	    "active": true,
	    "currentWindow": true,
	    "status": "complete",
	    "windowType": "normal"
	}, function (tabs) {
	    for (tab in tabs) {
	        console.log(tabs[tab].url);
	    }
	});
});