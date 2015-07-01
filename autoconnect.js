//Injecté dans les pages INSA
chrome.runtime.sendMessage({method: "getInfos"}, function(response) { //on récupère les préferences utilisateur
	if(response['autoconnect'] == "true") { //Si l'utilisateur a activé la connexion automatique aux sites INSA
	
		if(document.getElementsByClassName('visualIconPadding').length && document.getElementsByClassName('visualIconPadding')[0].innerHTML.indexOf("S'identifier")>=0){ //Si il y a un lien "s'identifier" (cipcnet), on se connecte
			var element = document.getElementsByClassName('visualIconPadding')[0]; //L'élement sur lequel on va afficher "connexion..", c'est le fameux lien
			connexionLien(element, "CIPC"); //On se connecte avec l'animation des liens
		}

		if(document.getElementsByClassName('portalUser').length && document.getElementsByClassName('portalUser')[0].innerHTML.indexOf("Non connecté.")>=0){ //Si il y a un lien "Non connecté." (moodle), on se connecte
			var element = document.getElementsByClassName('portalUser')[0]; //L'élement sur lequel on va afficher "connexion..", c'est le fameux lien
			connexionLien(element, "Moodle"); //On se connecte avec l'animation des liens
		}

		if(document.getElementById('portalCASLoginLink') && document.getElementById('portalCASLoginLink').innerHTML.indexOf("Identifiez-vous")>=0){ //Si il y a un lien-bouton "Identifiez-vous" (planète), on se connecte
			var element = document.getElementById('portalCASLoginLink'); //L'élement sur lequel on va afficher "connexion..", c'est le fameux lien-bouton
			connexionLien(element, "Planete"); //On se connecte avec l'animation des liens
		}

		if(document.getElementsByClassName('connect').length && document.getElementsByClassName('connect')[0].value.indexOf("Se connecter")>=0){ //Si il y a un bouton "Se connecter" (zimbra), on se connecte
			var element = document.getElementsByClassName('connect')[0]; //L'élement sur lequel on va afficher "connexion..", c'est le fameux bouton
			connexionBouton(element, "Zimbra", "http://zmail.insa-lyon.fr"); //On se connecte avec l'animation des boutons
		}

		if(document.getElementsByClassName('btn-submit').length && document.getElementsByClassName('btn-submit')[0].value.indexOf("SE CONNECTER")>=0){ //Si il y a un bouton "SE CONNECTER" (CAS), on se connecte
			var element = document.getElementsByClassName('btn-submit')[0]; //L'élement sur lequel on va afficher "connexion..", c'est le fameux bouton
			connexionBouton(element, "CAS"); //On se connecte avec l'animation des boutons
		}


		function connexionLien(element, service, url) { //animation de connexion sur les liens

				chrome.storage.local.set({erreur: ""}); //Au début, pas d'erreur
				chrome.storage.local.set({state: "wait"}); //Notre état : attente..
				var connected = false; //On est pas connecté
				chrome.runtime.sendMessage({method: "connect"}); //On lance la connexion
				
				
				element.style.fontWeight = "bold"; //On met son contenu en gras.
				
				var texte="Connexion.."; //On prend le texte à afficher
				var couleursLettres=new Array("#e91e63","#00bcd4", "#8bc34a","#ffc107","#009688","#ff9800"); //Et un gros tas de couleurs
				var i=0;
				
				
				function boucle() { //Cette fonction sera executée toutes les 80 ms
					if(connected) //Si on est connecté, on arrête tout
						return;
						
					var couleur = couleursLettres[Math.floor(Math.random() * couleursLettres.length)]; //On prend une couleur au hasard
					var connectHtml=texte.substring(0, i%11) + "<span style='color:"+couleur+"'>" + texte.charAt(i%11) + "</span>" + texte.substring(i%11+1, texte.length); //On entoure la ième lettre de cette couleur
					
					element.innerHTML=connectHtml; //Et on injecte le tout dans l'element !
					
					
						i++; //On incrémente i (on passe à la lettre suivante)
							
				chrome.storage.local.get ("erreur", function (result) { //On regarde si une erreur est survenue
					if(result.erreur)  //S'il y en a une
						element.innerHTML=result.erreur.replace(/(<([^>]+)>)/ig,""); //On l'affiche sans html (retours ligne et liens)
					else 
						setTimeout(boucle, 80); //Sinon tout va bien on continue la boucle
					
				});		
					
				};boucle();

				chrome.storage.onChanged.addListener(function(changes, namespace) { //On va regarder ce qui est tické
					for (key in changes) {
						if(key=="services" && (changes["services"].newValue == service)) { //Si notre service est tické
								element.innerHTML="Connecté !"; //on l'affiche
								connected = true;
								if(url)
									window.location.href = url; //Si une url est donnée on y va
								else
									location.reload(); //Sinon on actualise la page
						}
					}
				});
			}
			
			function connexionBouton(element, service, url) {
			
				chrome.storage.local.set({erreur: ""}); //Au début, pas d'erreur
				chrome.storage.local.set({state: "wait"}); //Notre état : attente..
				var connected = false; //On est pas connecté
				chrome.runtime.sendMessage({method: "connect"}); //On lance la connexion
				
				
				var i=0; //tour 0
				function boucle() { //Cette fonction sera executée toutes les 300 ms
					if(connected) //Si on est connecté, on arrête tout
						return;
						
					var texte="Connexion"+Array(i%4+1).join('.')+Array(4-i%4).join(' '); //On prend le texte à afficher, avec i modulo 4 (0,1,2 ou 3) petits points (et des espaces pour garder une taille fixe)
					
					element.value=texte;
					
					i++; //tour suivant
					
					
					chrome.storage.local.get ("erreur", function (result) { //On regarde si une erreur est survenue
					if(result.erreur)  //S'il y en a une
						element.value=result.erreur.replace(/(<([^>]+)>)/ig,""); //On l'affiche sans html (retours ligne et liens)
					else 
						setTimeout(boucle, 300); //Sinon tout va bien on continue la boucle
					
					});	
				};boucle();
				
				chrome.storage.onChanged.addListener(function(changes, namespace) { //On va regarder ce qui est tické
					for (key in changes) {
						if(key=="services" && (changes["services"].newValue == service)) { //Si notre service est tické
								element.value="Connecté !"; //on l'affiche
								connected = true;
								if(url)
									window.location.href = url; //Si une url est donnée on y va
								else
									location.reload(); //Sinon on actualise la page
									
						}
					}
				});
			}
	}
});