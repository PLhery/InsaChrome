document.write("<script type='text/javascript' src='aes.js'></script>" );
function cryptoloaded() {
	if(!localStorage['s']) {
		localStorage['s']=Math.floor(Math.random() * 90000) + 10000
		localStorage['passe'] = CryptoJS.AES.encrypt(localStorage['passe'], "1NS4"+localStorage['s']);
	}
}
		if(!localStorage['insainviteauto'] | localStorage['insainviteauto'] == 'undefined')
			localStorage['insainviteauto']=true;
		if(!localStorage['reseauinsaauto'] | localStorage['reseauinsaauto'] == 'undefined')
			localStorage['reseauinsaauto']=true;
		if(!localStorage['formatemploi'] | localStorage['formatemploi'] == 'undefined')
			localStorage['formatemploi']="pdf";
			
chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
        var headers = info.responseHeaders;
        for (var i=headers.length-1; i>=0; --i) {
            var header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                headers.splice(i, 1);
            }
        }
        return {responseHeaders: headers};
    },
    {
        urls: [ 'https://planete.insa-lyon.fr/*' ],
        types: [ 'sub_frame' ]
    },
    ['blocking', 'responseHeaders']
);			

			
			chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getInfos")
      sendResponse({passe: CryptoJS.AES.decrypt(localStorage['passe'], "1NS4"+localStorage['s']).toString(CryptoJS.enc.Utf8), nom: localStorage['nom'], insainviteauto: localStorage['insainviteauto']});
	  
	else if(request.method == "connect") {
		connect();
	}
	else if(request.method == "timetable") {
		LoadTimetable();				  
	}
	else if(request.method == "reload") {
			  chrome.tabs.query({url : "*://*.insa-lyon.fr/*"}, function(tabs) {
					tabs.forEach(function(tab) {
					   chrome.tabs.reload(tab.id);
					});
			  });					  
	}
	else if(request.method == "autoconnect" & localStorage['reseauinsaauto']=="true" & (!localStorage['lastConnect'] | localStorage['lastConnect']< (new Date().getTime())-1000*60*60*2) & !(!localStorage['passe'] | localStorage['passe'] == 'undefined' | localStorage['nom'] == 'undefined'| !localStorage['nom'])) {
			//chrome.windows.create({url:"popup.html", width:141, height:104, focused:false, type:"panel"});
	} else if(request.method == "popupStart") {
	
	getInformations();
	
	}
	else
      sendResponse({});
});

function getInformations() { //Le but est de récupérer toutes les informations, et que si une ne va pas, on lance la connexion

				var solde1=false;//On n'a aucune info
				var solde2=false;
				var infomails=false;
				var infonom = false;
				var infoto = false;
				var connection = false;
				var impressions = false;
				
				$.get('https://planete.insa-lyon.fr/uPortal/f/u23l1s5/normal/render.uP', function (response) { //On récupère les infos sur le solde
					var source = $('<div>' + response + '</div>');
					
					solde1 = source.find('.reco-balance:eq(0)').text();
					solde2 = source.find('.reco-balance:eq(1)').text(); //On les lit

					if(!solde2 && source.find('.reco-background').text()) { //Si on a pas de solde (ex l'etudiant n'est pas au self), écrire n/a
						solde1 = solde2 = "n/a €";
					}
					
					if(!solde2 && !connection) { //s'il manque une info et qu'on se connecte pas déja, on se connecte
						connection = true;
						connect();
					}
					
					if(solde1 && solde2 && infonom && infoto && infomails && impressions) //Si on a toutes les infos (si c'etait le dernier qu'on attendait), on les envoi
						envoiinfos(infomails, solde1, solde2, infonom, infoto, impressions);
						
				}).fail(function() { //Si on a un problème, on lance la connexion
							if(!connection) {
								connection = true;
								connect();
							}
						  });	
				



				/* Récupérait les infos sur l'admission. Plus à afficher
				$.get('http://cipcnet.insa-lyon.fr/scol/bulletin_eleve', function (response) {
					var source = $('<div>' + response + '</div>');
					
					admission = source.find('tbody:eq(2) tr:last').text();
					
					if(!admission && !connection) {
						connection = true;
						connect();
					}
					
					if(solde1 && solde2 && infonom && infoto && infomails && admission)
						envoiinfos(infomails, solde1, solde2, infonom, infoto, admission);
						
				}).fail(function() {
							if(!connection) {
								connection = true;
								connect();
							}
						  });	*/
						  
				$.get('http://cipcnet.insa-lyon.fr/cipc/mon_quota_prn', function (response) { //On récupère les quota des impressions
					var source = $('<div>' + response + '</div>');
					
					impressions = source.find('td td').first().text()+" / "+source.find('td td:eq(2)').text(); //nombre d'impressions / limite haute
					
					if((!source.find('td td').first().text() || !source.find('td td:eq(2)').text() ) && !connection) { //s'il manque une info et qu'on se connecte pas déja, on se connecte
						connection = true;
						connect();
					}
					
					if(solde1 && solde2 && infonom && infoto && infomails && impressions)
						envoiinfos(infomails, solde1, solde2, infonom, infoto, impressions);
						
				}).fail(function() {
							if(!connection) {
								connection = true;
								connect();
							}
						  });
						  
				
				$.get('https://planete.insa-lyon.fr/insa-zimbra-portlet/api/getMessageSummaries', function (mails) { //On récupère le nombre de mails restant
					infomails = mails.messageSummary.unreadCount+" / "+mails.messageSummary.messageCount; //On met les infos en forme
					if((!mails.messageSummary.unreadCount || !mails.messageSummary.messageCount)  && !connection) { //s'il manque une info et qu'on se connecte pas déja, on se connecte
						connection = true;
						connect();
					}
					if(solde1 && solde2 && infonom && infoto && infomails && impressions) //Si on a toutes les infos (si c'etait le dernier qu'on attendait), on les envoi
						envoiinfos(infomails, solde1, solde2, infonom, infoto, impressions);
						
				}).fail(function() { //Si on a un problème, on lance la connexion
							if(!connection) {
								connection = true;
								connect();
							}
						  });
						  
				$.get('http://cipcnet.insa-lyon.fr/scol/cnil_getinfos', function (response) { //On récupère le nom et la photo
					var source2 = $('<div>' + response + '</div>');
					infonom = MajNom(source2.find('td:eq(11)').html())+" "+source2.find('td:eq(9)').html(); //On met le nom et le prénom en forme (et met les premières lettres des noms, meme composés, en maj)
					infoto = source2.find('td:eq(5)').html();
					
					if((!source2.find('td:eq(11)').html() || !source2.find('td:eq(9)').html()) && !connection) { //s'il manque une info et qu'on se connecte pas déja, on se connecte
						connection = true;
						connect();
					}
					if(solde1 && solde2 && infonom && infoto && infomails && impressions) //Si on a toutes les infos (si c'etait le dernier qu'on attendait), on les envoi
						envoiinfos(infomails, solde1, solde2, infonom, infoto, impressions);
						
				}).fail(function() { //Si on a un problème, on lance la connexion
							if(!connection) {
								connection = true;
								connect();
							}
						  });

	}
	
	function envoiinfos(infomails, solde1, solde2, infonom, infoto, impressions) {
		chrome.storage.local.set({infos: new Array(
		infomails,
		solde1,
		solde2,
		infoto,
		infonom,
		impressions
		)});
	}
				
function connect() {
	chrome.storage.local.get('state', function (result) { //On récupère l'etat de la popup
        if(result.state=="connecté") //Si il est déja sensé être connecté
			error("Une erreur est survenue (#013) : <br/> Impossible de récupérer vos informations. Un site INSA a peut être un problème/cette extension n'est peut etre pas à jour !");
			
		else if(!localStorage['passe'] | localStorage['passe'] == 'undefined' | localStorage['nom'] == 'undefined'| !localStorage['nom']) //On vérifie si on a bien un username/pass
				error("Merci de rentrer votre identifiant/mot de passe dans les <a href='options.html' style='color:white;font-weight:bold;' target='_blank'>options</a>. (#006)"); 
				
		else {//si y'a pas de soucis
			chrome.storage.local.set({state: "connexion"});  //On passe la popup à l'etat de connexion
				connectCAS(); //Et on lance la connexion
	}
    });

}
function connectCAS()  {

	//On se connecte à INSA CAS
	chrome.cookies.remove({"url": "https://login.insa-lyon.fr/cas/", "name": "JSESSIONID"}); //on enlève le cookie JSESSIONID si déja présent

	$.get("https://login.insa-lyon.fr/cas/login").done(function (response) { //On génère un nouveau JSESSIONID et le lt associé
			//On vérifie si on est bien sur la bonne page
			 chrome.cookies.get({"url": "https://login.insa-lyon.fr/cas/", "name": "JSESSIONID" }, function(cookie) { //on lit le cookie jsessionid
			
				$.post( "https://login.insa-lyon.fr/cas/login;"+cookie.value, { username: localStorage['nom'], password: CryptoJS.AES.decrypt(localStorage['passe'], "1NS4"+localStorage['s']).toString(CryptoJS.enc.Utf8), lt : $('<div>' + response + '</div>').find("input[name='lt']").val(), execution: "e1s1", _eventId: "submit" }) //On envoie les infos de connection
				.done(function( data ) { //On vérifie si on est bien connecté
				
					if($('<div>' + data + '</div>').find("p").first().text() == "Vous vous êtes authentifié(e) auprès du Service Central d'Authentification.") { //Si on est bien connecté
					
									chrome.storage.local.set({services: "CAS"}); //On tick le service CAS sur la popup
									connectMoodle();//On se connecte à Moodle
									connectCIPC();//On se connecte à CIPCnet
									connectZimbra();//On se connecte à Zimbra
									connectPlanete(); //On se connecte à Planète
									
					}else if($('<div>' + data + '</div>').find("#msg").text()) { //Sinon, s'il y a un message
					
						if($('<div>' + data + '</div>').find("#msg").text()=="Mauvais identifiant / mot de passe.")//Si c'est un problème de mot de passe
							error("Une erreur est survenue (#003) :  <br/> Vos identifiants semblent incorrects. Verrifiez-les dans les <a href='options.html' style='color:white;font-weight:bold;' target='_blank'>options</a>.")
						else
							error("Une erreur CAS (#004) est survenue <br/><br/> Message : "+$('<div>' + data + '</div>').find("#msg").text());
					}else //Si il y a une erreur et pas de message
						error("Une erreur inconnue (#005) est survenue lors de votre connexion à CAS.");
					
				}).fail(function() {
					error("Un problème est survenu (#002), <br/> êtes-vous connecté à internet ?");
				});
			});				
	}).fail(function() {
		error("Un problème est survenu (#001),<br/> êtes-vous connecté à internet ?");
	})

}

function connectCIPC() {

	//On se connecte à CIPCNET
	$.get("https://login.insa-lyon.fr/cas/login?service=http%3A%2F%2Fcipcnet.insa-lyon.fr%2Flogin_form").done(function (response) { //On demande la page de connexion
	
		if($('<div>' + response + '</div>').find("#user-name").length) //Si le nom d'utilisateur est bien affiché sur moodle (donc il est connecté)
			chrome.storage.local.set({services: "CIPC"}); //On tick le service CIPC sur la popup
		else
			error("Une erreur inconnue (#008) est survenue lors de votre connexion à CIPCNet.");
		
	}).fail(function() {
		error("Un problème est survenu (#007),<br/> êtes-vous connecté à internet ?");
	});

}

function connectMoodle() {

	//On se connecte à Moodle
	$.get("http://cipcnet.insa-lyon.fr/moodle.195/login/index.php").done(function (response) { //On demande la page de connexion
		
		if($('<div>' + response + '</div>').find("#portal-personaltools a:eq(1)").text() == "Déconnexion") //Si le bouton déconnexion est present sur le moodle (donc il est connecté)
			chrome.storage.local.set({services: "Moodle"}); //On tick le service Moodle sur la popup
		else
			error("Une erreur inconnue (#010) est survenue lors de votre connexion au Moodle.");
		
	}).fail(function() {
		error("Un problème est survenu (#009),<br/> êtes-vous connecté à internet ?");
	});

}

function connectZimbra() {

	//On se connecte à Zimbra
	$.get("https://login.insa-lyon.fr/zimbra/login?version=standard").done(function (response) { //On demande la page de connexion
		if($('<div>' + response + '</div>').find(".skin_link:eq(1)").text() == "Se déconnecter") //Si le bouton déconnexion est present sur Zimbra (donc il est connecté)
			chrome.storage.local.set({services: "Zimbra"}); //On tick le service Zimbra sur la popup
		else
			error("Une erreur inconnue (#012) est survenue lors de votre connexion à Zimbra.");
		
	}).fail(function() {
		error("Un problème est survenu (#011),<br/> êtes-vous connecté à internet ?");
	});

}

function connectPlanete() {

	//On se connecte à Planète
	$.get("https://planete.insa-lyon.fr/uPortal/f/u23l1s5/normal/render.uP").done(function (response) { //On demande la page de connexion
		if($('<div>' + response + '</div>').find(".link-logout").first().text() == "Déconnexion") //Si le bouton déconnexion est present sur Planète (donc il est connecté)
			chrome.storage.local.set({services: "Planete"}); //On tick le service Zimbra sur la popup
		else
			error("Une erreur inconnue (#015) est survenue lors de votre connexion à Planète.");
		
	}).fail(function() {
		error("Un problème est survenu (#014),<br/> êtes-vous connecté à internet ?");
	});

}


function error(error) {
	chrome.storage.local.set({erreur: error});
}

function MajNom(nom){
nom = nom.toLowerCase();
var tabnom=nom.split('-')
var i=-1;
var Maj="";
while(tabnom[++i]){
 tabnom[i]=tabnom[i].replace(/(\w)(\w+)/,function(T,M,C){return M.toUpperCase()+C})
 }
tabnom=tabnom.join('-')
return tabnom
}


	  
	  

var lastsugg;
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
  
  var sugg = [];


if("emploi du temps".indexOf(text.toLowerCase())!=-1)
	sugg.push({content: "Emploi du temps", description: "Emploi du temps <dim>Affiche votre emploi du temps de la semaine</dim>"});

if("moodle".indexOf(text.toLowerCase())!=-1)
	sugg.push({content: "Moodle", description: "Moodle <dim>Vous redirige vers le moodle</dim>"});
	
if("zimbra mail".indexOf(text.toLowerCase())!=-1)
	sugg.push({content: "Zimbra", description: "Zimbra <dim>Vos mails insa</dim>"});

if("cipcnet premier cycle accueil".indexOf(text.toLowerCase())!=-1)
	sugg.push({content: "CIPC", description: "Accueil CIPCnet <dim>Your BatCaaaave</dim>"});
	
if("notes bulletin scolarité scolarite".indexOf(text.toLowerCase())!=-1)
	sugg.push({content: "Notes", description: "Notes <dim>Votre bulletin de notes chéri</dim>"});

if("planète planete cantine".indexOf(text.toLowerCase())!=-1)
	sugg.push({content: "Planete", description: "Planète <dim>Combien vous reste-t-il pour la cantiiiine ?</dim>"});
	
sugg.push({content: "cours "+text, description: "Recherche Moodle : <match>"+text+"</match> <dim>Recherche les cours Moodle de "+text+"</dim>"});
sugg.push({content: "prenom "+text, description: "Recherche par prénom : <match>"+text+"</match> <dim>Recherche les étudiants INSA dont le prénom contient "+text+"</dim>"});
sugg.push({content: "nom "+text, description: "Recherche par nom : <match>"+text+"</match> <dim>Recherche les étudiants INSA dont le nom de famille contient "+text+"</dim>"});
lastsugg = sugg[0].content;
		delete sugg[0].content;
		chrome.omnibox.setDefaultSuggestion(sugg[0]);
		sugg.shift();
		suggest(sugg);

		
  });

  function LoadTimetable() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.update(tabs[0].id, {url: "patientez.html"});

	  
				xmlhttp=new XMLHttpRequest();
				xmlhttp.onload = function() {
					var lines = xmlhttp.responseText.replace(/\/\*[^)]*\*\//g, "").split('\n');
					lines.splice(415,5);
					var resptxt = lines.join('\n');
					var xml = new DOMParser().parseFromString(resptxt.replace(/\/\*[^)]*\*\//g, "").replace(/<!--.*-->/g, ""),'text/xml');
					if(!xml.getElementById("id_groupe")) {
						chrome.tabs.update(tabs[0].id, {url: "connexion.html"});
					}
					else {
						var edt=(localStorage['formatemploi'] == "html")?"edt_form":"php/edt_pdf";
						chrome.tabs.update(tabs[0].id, {url: "http://cipcnet.insa-lyon.fr/scol/"+edt+"?id_groupe="+xml.getElementById("id_groupe").value+"&id_semaine_pc="+xml.getElementById("id_semaine_pc").value+"&form.button.Ok=Ok&form.submitted=1"});
					}
				}
				xmlhttp.open("GET","http://cipcnet.insa-lyon.fr/scol/edt_form",true);
				xmlhttp.send();
	 });
  }

  function navigate(url) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: url});
  });
}

  chrome.omnibox.onInputEntered.addListener(
  function(text) {
		
var i=0
		while(i<1) {
		i++
				switch (text) 
				{ 
					case "Emploi du temps": 
						LoadTimetable();
					break; 
					case "Moodle": 
						navigate("http://cipcnet.insa-lyon.fr/moodle/");
					break; 
					case "Zimbra": 
						navigate("https://zmail.insa-lyon.fr/");
					break; 
					case "CIPC": 
						navigate("http://cipcnet.insa-lyon.fr/");
					break; 
					case "Notes": 
						navigate("http://cipcnet.insa-lyon.fr/scol/bulletin_eleve");
					break; 
					case "Planete": 
						navigate("https://planete.insa-lyon.fr/");
					break; 
					default: 
						if(text.indexOf("cours ")==0)
							navigate("http://cipcnet.insa-lyon.fr/moodle.195/course/search.php?search="+text.substr(6));
						else if(text.indexOf("prenom ")==0)
							navigate("http://cipcnet.insa-lyon.fr/scol/recherches/ldap_search?pcontient=1&id_prenom="+text.substr(7));
						else if(text.indexOf("nom ")==0)
							navigate("http://cipcnet.insa-lyon.fr/scol/recherches/ldap_search?ncontient=1&id_nom="+text.substr(4));
						else if(i>0) {
						text = lastsugg;
						i=0;
						}
					break; 
				 }
		}

  });
  
