		var element = document.getElementById('service');
		connect();


function connect() {
		chrome.runtime.sendMessage({method: "connect"});

		chrome.storage.onChanged.addListener(function(changes, namespace) {
			for (key in changes) {
				if(key=="connect" && changes["connect"].newValue != "fini") {
					chrome.storage.local.set({connect: "fini"});
					
					if(changes[key].newValue=="ok"){
						
						element.innerHTML="Connecté";
						element.value="Connecté";
						
						chrome.runtime.sendMessage({method: "timetable"});
					}
					else if(changes[key].newValue=="nope") {
						element.innerHTML="Une erreur est survenue : vos identifiants sont-ils corrects ?";
						element.value="Une erreur est survenue : vos identifiants sont-ils corrects ?";
					}
					else if(changes[key].newValue=="debut") {
							element.innerHTML="Connexion...";
							element.value="Connexion...";
					}else {
						element.innerHTML= "Connexion... <i>("+changes[key].newValue+")</i>";
						element.value= "Connexion... ("+changes[key].newValue+")";
					}
				}
			}
      });
}