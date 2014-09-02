
chrome.runtime.sendMessage({method: "getInfos"}, function(response) {
	if(response['insainviteauto'] == "true") {
		if(!(!response['passe'] | response['passe'] == 'undefined' | response['nom'] == 'undefined'| !response['nom'])){
			document.getElementsByName("user")[0].value = response['nom'];
			document.getElementsByName("fqdn")[0].value = "insa-lyon.fr";
			document.getElementsByName("password")[0].value = response['passe'];
			
			var evObj = document.createEvent('Events');
			evObj.initEvent("click", true, false);
			document.getElementsByName("submit")[0].dispatchEvent(evObj);
		}


			
	}
});
