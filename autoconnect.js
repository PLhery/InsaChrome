//chrome.runtime.sendMessage({method: "autoconnect"});
var element;
if(document.getElementsByClassName('visualIconPadding').length && document.getElementsByClassName('visualIconPadding')[0].innerHTML.indexOf("S'identifier")>=0){
		element = document.getElementsByClassName('visualIconPadding')[0];
		connect();
}

if(document.getElementsByClassName('button').length && document.getElementsByClassName('button')[0].innerHTML.indexOf("Identifiez-vou")>=0){
		element = document.getElementsByClassName('button')[0];
		connect();
}

if(document.getElementsByClassName('btn-submit').length && document.getElementsByClassName('btn-submit')[0].value.indexOf("SE CONNECTER")>=0){
		element = document.getElementsByClassName('btn-submit')[0];
		connect();
}


function connect() {
		chrome.runtime.sendMessage({method: "connect"});

		chrome.storage.onChanged.addListener(function(changes, namespace) {
			for (key in changes) {
				if(key=="connect" && changes["connect"].newValue != "fini") {
					chrome.storage.local.set({connect: "fini"});
					
					if(changes[key].newValue=="ok"){
						
						element.innerHTML="Connecté";
						element.value="Connecté";
						
						chrome.runtime.sendMessage({method: "reload"});
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