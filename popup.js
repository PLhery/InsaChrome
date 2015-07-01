/*===========================================
**==== Code lié à la page "popup.html" ======
**===========================================*/

chrome.runtime.sendMessage({method: "popupStart"}); //On prévient le Background que la popup est lancée.

chrome.storage.local.set({	services: "aucun",	//créer l'attribut services en précisant qu'aucun n'est checké
							state: "wait",		// -- state sur le chargement
							erreur: "",			// -- erreur vide
							infos: ""});		// -- infos vide



/** ====== Code à effectuer sur un évènement ===== **/

chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
	
		/* Check des services INSA */
		
		if(key == "services" && changes["services"].newValue != "aucun") {
			document.getElementById('ch' + changes["services"].newValue).checked =true; //on le checké
			if($('input:checked').length == $('input').length) { //si tous les services sont checkés
				chrome.storage.local.set({state: "connecté"}) //On passe l'état à connecté
				$("#services").slideUp()	//On lance l'animation
				setTimeout(function(){  chrome.runtime.sendMessage({method: "popupStart"});   }, 2000); //On relance la récupération d'informations après 1 seconde (le temps d'afficher le check)

				chrome.tabs.query({url : "*://*.insa-lyon.fr/*"}, function(tabs) { //On actualise les pages INSA
					tabs.forEach(function(tab) {
									chrome.tabs.reload(tab.id);
								});
				});
			}
		}

		/* Etat connecté */
		
		if(key == "state" && changes["state"].newValue == "connexion") {
			$("#wait").slideUp();
			$("#services").slideDown();
			
		}
		
		/* Erreur */
		
		if(key == "erreur" && changes["erreur"].newValue) {
			$("#services").stop().slideUp();
			$("#wait").stop().slideUp();
			$("#informations").stop().slideUp();
			$("#message").html(changes["erreur"].newValue);
			$("#erreur").slideDown();
		}
		
		/* Reception d'infos */
		
		if(key == "infos" && changes["infos"].newValue) {
			document.getElementById('mails').innerHTML = changes[key].newValue[0]; //On les inscrit dans les cases
			document.getElementById('solde').innerHTML = changes[key].newValue[1];
			document.getElementById('soldeforfait').innerHTML = changes[key].newValue[2];
			
			if(changes[key].newValue[6] && !isNaN(changes[key].newValue[6]) && $("#afficherPokemon").length > 0) //Si on a le rang, affiche le pokemon, sinon affiche la tête du logué. Si aucun des deux n'est dispo, on voit un rhino
				document.getElementById('photo').src = "http://pokeapi.co/media/img/" + changes[key].newValue[6] + ".png"; //On affiche le pokemon
			else
				document.getElementById('photo').src = "http://cipcnet.insa-lyon.fr/scol/tr_eleves/" + changes[key].newValue[3] + ".jpg";
			
			document.getElementById('nom').innerHTML = changes[key].newValue[4];

			//document.getElementById('admission').innerHTML = changes[key].newValue[5];
			document.getElementById('impressions').innerHTML = changes[key].newValue[5];

			$("#services").slideUp()
			$("#wait").slideUp()
			$("#informations").slideDown();
			$(".adds").slideDown();
			/*
			document.getElementById('gatsun-src').src = "http://dust.galadruin.fr:8000/Gatsun";*/
			
			chrome.storage.local.set({	state: "connecté"	});
		}
	}
});


// == Commande l'affichage des adds


createAdd('Gatsun','img-Gatsun','txt-Gatsun');
//createAdd('notes', 'img-notes', 'txt-notes');


// == Affiche le message du jour

$("#message_du_jour").load("http://paul-louis.me/InsaChrome/message_du_jour.php");

// == Affichage de l'écran de chargement

var circAnimI = 0;
var circAnimColors = new Array("#e91e63","#00bcd4", "#8bc34a","#ffc107","#009688","#ff9800");

circularAnimation();



/** ======== Fonctions nécessaires aux calculs =======**/

// == Echange le contenu d'une add avec son icône
function createAdd(addId,iconId,backId){
	document.getElementById(iconId).onclick = function(){	displayAnAdd(addId,iconId)	};
	document.getElementById(backId).onclick = function(){	hideAnAdd(addId,iconId)	};
}

function displayAnAdd(addId,iconId){
	document.getElementById(addId).style.display = 'block';
	document.getElementById(iconId).style.display = 'none';
}

function hideAnAdd(addId,iconId){
	document.getElementById(addId).style.display = 'none';
	document.getElementById(iconId).style.display = 'inline-block';
}

// == fonction de calcul de l'animation des cercles au chargement
function circularAnimation() { //adapté de http://jsfiddle.net/F9pLC/

	var width = $("#wait").width(),
		height = $("#wait").height(); //dimensions de la popup
	var diag = Math.ceil(Math.sqrt(width * width + height * height)); //On en déduit la diagonale/Le rayon max du cercle
	var pageX = width/2,
		pageY = height/2; //On en déduit le centre
	$('<div class="circle">').appendTo("#wait").css({ //On rajoute un cercle de rayon 2.5px au centre
			width: 5,
			height: 5,
			"border-radius": 5,
			top: pageY,
			left: pageX,
			"background-color": circAnimColors[circAnimI%6] //sa couleur ? La suivante dans le tableau
		}).animate({
			width: diag,
			height: diag //On l'anime de sa taille actuelle à la taille de la diagonale (quand le cercle a atteint la diagonale)
		}, {
			step: function (now, fx) {
				if (fx.prop === "height") return;
				$(this)
					.css("top", pageY - now/ 2)
					.css("left", pageX - now / 2) //à chaque étape on ajuste la position et le radius pour que ca reste un cercle
					.css("border-radius", now / 2);
			},
			easing: "swing",
			duration: 1400,
			done: function () {
				$("#wait").css("background-color", $(this).css("background-color")).css("z-index", ""); //quand c'est fait on enlève le cercle et met la vraie couleur de fond
				$(this).remove();
				circAnimI++;
				if(!$("#wait").is(":hidden")) //si le wait n'est pas caché on recommence
					circularAnimation();
			}
		});
}
