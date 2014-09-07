if(!localStorage['passe'] | localStorage['passe'] == 'undefined' | localStorage['nom'] == 'undefined'| !localStorage['nom']) {
	document.getElementById('connect').style.display="block";
	document.getElementById('informations').style.display="none";
	document.getElementById('connect').innerHTML="Merci de rentrer votre identifiant/mot de passe dans les <a href='options.html' style='color:#4CA6FF;' target='_blank'>options</a>.";
}else {
		chrome.storage.local.set({connect: "fini"});
		/*frame = document.createElement('iframe');
		frame.style.display = 'none';
		frame.setAttribute('src','https://login.insa-lyon.fr/cas/login?service=http%3A//cipcnet.insa-lyon.fr/scol/php/ok/');
		document.body.appendChild(frame);*/
		
		
		//chrome.runtime.sendMessage({method: "connect"});
		chrome.runtime.sendMessage({method: "popup"});
		
		chrome.storage.local.set({services: "aucun"}); //Aucun services n'est tické.
		chrome.storage.onChanged.addListener(function(changes, namespace) {
			for (key in changes) {
				if(key=="services" && changes["services"].newValue != "aucun") { //Si un service doit être tické
					document.getElementById('ch'+changes["services"].newValue).checked =true; //on le ticke
					
					if($('input:checked').length == $('input').length) { //si tous les services sont tickés
					
						$("#services").slideUp()	//On lance l'animation
						$("#ok").slideDown().css("opacity",1).css("font-size","80px").css("width","150px");;
						$("body").css("background","#92C060");
						
						setTimeout(function(){
							$("#ok").slideUp();
							$("#informations").slideDown();
							$("body").css("background","#FEFEFE");
						}, 1500);
						setTimeout(function(){
							$("body").css("background","url(popup_background.png)");
						}, 2200);
						
					}
				}
				
				
				
				
				if(key=="connect" && changes["connect"].newValue != "fini") {
					chrome.storage.local.set({connect: "fini"});
					
					if(changes[key].newValue=="ok"){
						document.getElementById('connect').innerHTML="Connecté";
						
						
						  chrome.tabs.query({url : "*://*.insa-lyon.fr/*"}, function(tabs) {
								tabs.forEach(function(tab) {
								   chrome.tabs.reload(tab.id);
								});
						  });
						    //setTimeout(function () { window.close(); }, 800);
								document.getElementById('connect').style.display="none";
								document.getElementById('informations').style.display="block";
								chrome.runtime.sendMessage({method: "popup"});
					}
					else if(changes[key].newValue=="nope") {
							document.getElementById('connect').style.display="block";
							document.getElementById('informations').style.display="none";
						document.getElementById('connect').innerHTML="Une erreur est survenue : vos identifiants sont-ils corrects ?";
					}
					else if(changes[key].newValue=="debut") {
							document.getElementById('connect').style.display="block";
							document.getElementById('informations').style.display="none";
					}else {
					document.getElementById('service').innerHTML=changes[key].newValue;
					}
				}
				if(key=="infos" & changes["infos"].newValue != "recu") {
					chrome.storage.local.set({infos: "recu"});

					document.getElementById('mails').innerHTML=changes[key].newValue[0];
					document.getElementById('solde').innerHTML=changes[key].newValue[1];
					document.getElementById('soldeforfait').innerHTML=changes[key].newValue[2];
					//document.getElementById('photo').innerHTML=changes[key].newValue[3];
					//document.getElementById('photo').children[0].style.width = "45px";
					document.getElementById('photo').src= "http://cipcnet.insa-lyon.fr/scol/tr_eleves/"+changes[key].newValue[3]+".jpg";
					document.getElementById('nom').innerHTML=changes[key].newValue[4];
					//document.getElementById('admission').innerHTML=changes[key].newValue[5];
				}
			}
      });


}