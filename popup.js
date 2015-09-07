/*===========================================
**==== Code lié à la page "popup.html" ======
**===========================================*/

chrome.runtime.sendMessage({method: "popupStart"}); //On prévient le Background que la popup est lancée.

chrome.storage.local.set({	services: "aucun",	//créer l'attribut services en précisant qu'aucun n'est checké
							state: "wait",		// -- state sur le chargement
							erreur: "",			// -- erreur vide
							infos: ""});		// -- infos vide


// == Commande l'affichage des adds

createAdd('Gatsun','img-Gatsun','txt-Gatsun');
//createAdd('notes', 'img-notes', 'txt-notes');


// == Affiche le message du jour

$("#message_du_jour").load("http://paul-louis.me/InsaChrome/message_du_jour.php");

/** ====== Code à effectuer sur un évènement ===== **/

chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		/* Check des services INSA */
		console.log(key);
		if(key == "services" && changes["services"].newValue != "aucun") {
			document.getElementById('ch' + changes["services"].newValue).checked = true; //on le checké
			$("#ch" + changes["services"].newValue).css("checked", "true");
			if($('input:checked').length == $('input').length) { //si tous les services sont checkés
				console.log($('input:checked').length + " : " + $('input').length);
				chrome.storage.local.set({state: "connecté"}); //On passe l'état à connecté
				$("#services").slideUp();	//On lance l'animation
				setTimeout(function(){  chrome.runtime.sendMessage({method: "popupStart"});   }, 1000); //On relance la récupération d'informations après 1 seconde (le temps d'afficher le check)
				chrome.tabs.query({url : "*://*.insa-lyon.fr/*"}, function(tabs) { //On actualise les pages INSA
					tabs.forEach(function(tab) {
									chrome.tabs.reload(tab.id);
								});
				});
			}
		}

		/* Etat connecté */
		
		if(key == "state" && changes["state"].newValue == "connexion"){}
		
		/* Erreur */
		
		if(key == "erreur" && changes["erreur"].newValue) {
			$("#services").stop().slideUp();
			$("#wait").stop().slideUp();
			$("#informations").stop().slideUp();
			$("#message").html(changes["erreur"].newValue);
			$("#erreur").slideDown();
			$("footer").slideDown();
		}
		
		/* Reception d'infos */
		
		if(key == "infos" && changes["infos"].newValue) {
			document.getElementById('mails').innerHTML = changes[key].newValue[0]; //On les inscrit dans les cases
			document.getElementById('solde').innerHTML = changes[key].newValue[1];
			document.getElementById('soldeforfait').innerHTML = changes[key].newValue[2];
			checkTheBox(0);
			if(changes[key].newValue[6] && !isNaN(changes[key].newValue[6]) && $("#afficherPokemon2").length > 0) //Si on a le rang, affiche le pokemon, sinon affiche la tête du logué. Si aucun des deux n'est dispo, on voit un rhino
				document.getElementById('photo').src = "http://pokeapi.co/media/img/" + changes[key].newValue[6] + ".png"; //On affiche le pokemon
			else
				document.getElementById('photo').src = "http://cipcnet.insa-lyon.fr/scol/tr_eleves/" + changes[key].newValue[3] + ".jpg";
			
			document.getElementById('nom').innerHTML = changes[key].newValue[4];

			//document.getElementById('admission').innerHTML = changes[key].newValue[5];
			document.getElementById('impressions').innerHTML = changes[key].newValue[5];
			setTimeout(function(){
				$("#wait").slideUp();
				$(".connecting").slideUp();
				$("#services").stop().slideUp();
				$("#informations").slideDown();
				$(".adds").slideDown();
				}, 350);
			
			
			chrome.storage.local.set({	state: "connecté"	});
		}
	}
});


// == Affichage de l'écran de chargement

var circAnimI = 0;
var circAnimColors = new Array("#e91e63","#00bcd4", "#8bc34a","#ffc107","#009688","#ff9800");

dotAnimation();



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

function checkTheBox(numService){
	var servList = ["chCAS","chCIPC","chMoodle","chZimbra","chPlanete"];
	document.getElementById(servList[numService]).checked = true;
	if(numService < servList.length - 1){
		setTimeout(function(){
			checkTheBox(++numService)
			},70 - 2 * numService * numService);
	}
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

// == nouveau chargement
function dotAnimation() {
	var pageY = $("#wait").height()/2;
	var pageX = $("#wait").width()/2;
	$('<div class="circle">').appendTo("#wait").css({ //On rajoute un cercle de rayon 2.5px au centre
			width: 10,
			height: 10,
			top: pageY + 10,
			left: -20,
			"border-radius": "20px",
			"background-color": "rgb(230,240,250)"
		}).animate({
			left: 110
		}, {
			step: function (now, fx) {
				if (fx.prop === "height") return;
				$(this)
					.css("opacity",1 -  Math.abs(45 - now) * 2 /110)
					.css("left", pageX - now / 2)
			},
			easing: "linear",
			duration: 2000,
			done: function () {
				$(this).remove();
				if(!$("#wait").is(":hidden")) //si le wait n'est pas caché on recommence
					dotAnimation();
			}
		});
}

/*
** Easter egg quand on presse les touches I,N,S,A
*/

var k = [73,78,83,65]; //Les lettres I,N,S,A
n = 0;  
$(document).keydown(function (e) {  
    if (!$("input:focus").length && e.keyCode === k[n++]) {  
        if (n === k.length) {   //Si on les appuie successivement...
			$("body").prepend("<a href='pages/demineur.html' target='_blank' class='dem'>Play now !</a>");
        }  
    } else n = 0  
});