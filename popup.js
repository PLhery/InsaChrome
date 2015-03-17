		chrome.runtime.sendMessage({method: "popupStart"}); //On prévient le Background que la popup est lancée.
		
		chrome.storage.local.set({services: "aucun"}); //Aucun services n'est tické.
		chrome.storage.local.set({state: "wait"}); //Ecran de chargement affiché
		chrome.storage.local.set({erreur: ""}); //Pas d'erreur
		chrome.storage.local.set({infos: ""}); //Pas d'infos
		var timeout; //On déclare la variable timeout, contenant le dernier timeout lancé à annuler avec clearTimeout.
		chrome.storage.onChanged.addListener(function(changes, namespace) {
			for (key in changes) {
			
				if(key=="services" && changes["services"].newValue != "aucun") { //Si un service doit être tické
					document.getElementById('ch'+changes["services"].newValue).checked =true; //on le ticke
					
					if($('input:checked').length == $('input').length) { //si tous les services sont tickés
						
						chrome.storage.local.set({state: "connecté"}) //On passe l'état à connecté
						
						
						$("#services").slideUp()	//On lance l'animation
						$("#ok").slideDown().css("opacity",1).css("font-size","80px").css("width","150px");
						$("body").css("background","#92C060");
						setTimeout(function(){  chrome.runtime.sendMessage({method: "popupStart"});   }, 1000); //On relance la récupération d'informations après 1 seconde (le temps d'afficher le tick)

			
						
						
						
						 chrome.tabs.query({url : "*://*.insa-lyon.fr/*"}, function(tabs) { //On actualise les pages INSA
								tabs.forEach(function(tab) {
								   chrome.tabs.reload(tab.id);
								});
						  });
						  
					}
				}
				if(key=="state" && changes["state"].newValue == "connexion") { //Si on passe à l'état de connexion
					$("body").css("background","#FEFEFE").css("margin","5px");
					$("#wait").slideUp();
					$("#services").slideDown();
					timeout = setTimeout(function(){
							$("body").css("background","url(popup_background.png)");
						}, 500);
				}


				if(key=="erreur" && changes["erreur"].newValue) { //S'il y a bien une erreur
					$("body").css("margin","8px").css("background","#009688");
					clearTimeout(timeout); //On annule le dernier settimeout qui pourrait changer le background
					$("#ok").stop().slideUp();
					$("#services").stop().slideUp();
					$("#wait").stop().slideUp();
					$("#informations").stop().slideUp();
					$("#message").html(changes["erreur"].newValue)
					$("#erreur").slideDown();
				}

				if(key=="infos" && changes["infos"].newValue) { //Si on recoit les infos
				
					document.getElementById('mails').innerHTML=changes[key].newValue[0]; //On les inscrit dans les cases
					document.getElementById('solde').innerHTML=changes[key].newValue[1];
					document.getElementById('soldeforfait').innerHTML=changes[key].newValue[2];
					if(changes[key].newValue[6] && !isNaN(changes[key].newValue[6]) && $("#afficherPokemon").length>0) //Si on a le rang
						document.getElementById('photo').src= "http://pokeapi.co/media/img/"+changes[key].newValue[6]+".png"; //On affiche le pokemon
					else
						document.getElementById('photo').src= "http://cipcnet.insa-lyon.fr/scol/tr_eleves/"+changes[key].newValue[3]+".jpg";
					document.getElementById('nom').innerHTML=changes[key].newValue[4];
					//document.getElementById('admission').innerHTML=changes[key].newValue[5];
					document.getElementById('impressions').innerHTML=changes[key].newValue[5];
					
					$("body").css("margin","5px"); //On lance l'animation
					$("#ok").slideUp();
					$("#services").slideUp()
					$("#wait").slideUp()
					$("#informations").slideDown();
					$("body").css("background","#FEFEFE");
					timeout = setTimeout(function(){
						$("body").css("background","url(popup_background.png)");
					}, 700);
					chrome.storage.local.set({state: "connecté"});
				}
				
				

			}
      });
$("#message_du_jour").load( "http://paul-louis.eu/InsaChrome/message_du_jour.php");
var circAnimI=0;
var circAnimColors=new Array("#e91e63","#00bcd4", "#8bc34a","#ffc107","#009688","#ff9800");
function circularAnimation() { //adapté de http://jsfiddle.net/F9pLC/
							
						
		var width = $("#wait").width(),
			height = $("#wait").height(); //dimensions de la popup
		var diag = Math.ceil(Math.sqrt(width * width + height * height)); //On en déduit la diagonale/Le rayon max du cercle
		var pageX = width/2,
			pageY = height/2; //On en déduit le centre
		$('<div class="circle">').appendTo("#wait").css({ //On rajoute un cercle de 20*20/de rayon 10px au centre
			width: 20,
			height: 20,
			"border-radius": 20,
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
			duration: 700,
			done: function () {
				$("#wait").css("background-color", $(this).css("background-color")).css("z-index", ""); //quand c'est fait on enlève le cercle et met la vraie couleur de fond
				$(this).remove();
				circAnimI++;
				if(!$("#wait").is(":hidden")) //si le wait n'est pas caché on recommence
					circularAnimation();
			}
		});
}
circularAnimation();