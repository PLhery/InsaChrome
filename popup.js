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
						
						
						chrome.runtime.sendMessage({method: "popupStart"}); //On relance la récupération d'informations
						
						$("#services").slideUp()	//On lance l'animation
						$("#ok").slideDown().css("opacity",1).css("font-size","80px").css("width","150px");;
						$("body").css("background","#92C060");
						setTimeout(function(){  chrome.storage.local.set({state: "connecté"})  },1000); //On passe l'état à connecté après 1 seconde

			
						
						
						
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
					$("#ok").slideUp();
					$("#services").slideUp();
					$("#wait").slideUp();
					$("#informations").slideUp();
					$("#message").html(changes["erreur"].newValue)
					$("#erreur").slideDown();
				}

				if(key=="infos" && changes["infos"].newValue) { //Si on recoit les infos
				
					document.getElementById('mails').innerHTML=changes[key].newValue[0]; //On les inscrit dans les cases
					document.getElementById('solde').innerHTML=changes[key].newValue[1];
					document.getElementById('soldeforfait').innerHTML=changes[key].newValue[2];
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
				}
				
				

			}
      });

var circAnimI=0;
var circAnimColors=new Array("#e91e63","#00bcd4", "#8bc34a","#ffc107","#009688","#ff9800");
function circularAnimation() { //adapté de http://jsfiddle.net/F9pLC/
							
						
		var START_RADIUS = 10;
		var width = $("#wait").width(),
			height = $("#wait").height();
		var diag = Math.ceil(Math.sqrt(width * width + height * height));
		var pageX = width/2,
			pageY = height/2;
		$('<div class="circle">').appendTo("#wait").css({
			width: START_RADIUS * 2,
			height: START_RADIUS * 2,
			"border-radius": START_RADIUS,
			top: pageY,
			left: pageX,
			"background-color": circAnimColors[circAnimI%6]
		}).animate({
			width: diag,
			height: diag
		}, {
			step: function (now, fx) {
				if (fx.prop === "height") return;
				$(this)
					.css("top", pageY - now/ 2)
					.css("left", pageX - now / 2)
					.css("border-radius", now / 2);
			},
			easing: "swing",
			duration: 700,
			done: function () {
				$("#wait").css("background-color", $(this).css("background-color")).css("z-index", "");
				$(this).remove();
				circAnimI++;
				circularAnimation();
			}
		});
		$("#wait").css("z-index", -3);
}
circularAnimation();