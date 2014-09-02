if(document.getElementById("username") && !document.getElementById("credentials.errors")) {
	chrome.runtime.sendMessage({method: "getInfos"}, function(response) {
		document.getElementById("username").value=response['nom'];
		document.getElementById("password").value=response['passe'];
		
		var evObj = document.createEvent('Events');
		evObj.initEvent("click", true, false);
		document.getElementsByName("submit")[0].dispatchEvent(evObj);
	});

}
else {
	chrome.storage.local.set({connect: "nope"});
}