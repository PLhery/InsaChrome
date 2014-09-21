//injecté dans la page de connexion insainvité (la popup centrale)
chrome.runtime.sendMessage({method: "getInfos"}, function(response) { //on récupère les infos de connexion
	if(response['insainviteauto'] == "true") { //Si l'utilisateur a activé la connexion automatique à insa-invité 
		if(!(!response['passe'] | response['passe'] == 'undefined' | response['nom'] == 'undefined'| !response['nom'])){ //Si l'utilisateur a entré ses identifiants
			document.getElementsByName("user")[0].value = response['nom'];
			document.getElementsByName("fqdn")[0].value = "insa-lyon.fr";
			document.getElementsByName("password")[0].value = response['passe']; //On les rentre dans le formulaire
			
			var evObj = document.createEvent('Events');
			evObj.initEvent("click", true, false); 
			document.getElementsByName("submit")[0].dispatchEvent(evObj); //On simule un clic sur le bouton envoyer
		}


			
	}
});
