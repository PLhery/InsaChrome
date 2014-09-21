chrome.storage.onChanged.addListener(function(changes, namespace) { //On va regarder ce qui est tické
	for (key in changes) {
		if((key=="services" && (changes["services"].newValue == "CAS")) || (key=="state" && (changes["state"].newValue == "connecté"))) { //Si on est connecté à CAS
			chrome.runtime.sendMessage({method: "timetable"});
		}
	}
});