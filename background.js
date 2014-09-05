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
	} else if(request.method == "popup") {
	
				var solde1=false;
				var solde2=false;
				var infomails=false;
				var infonom = false;
				var infoto = false;
				var connection = false;
				var admission = false;
				$.get('https://planete.insa-lyon.fr/uPortal/f/u23l1s5/normal/render.uP', function (response) {
					var source = $('<div>' + response + '</div>');
					
					solde1 = source.find('.reco-balance:eq(0)').text();
					solde2 = source.find('.reco-balance:eq(1)').text();

					if(!solde2 && source.find('.reco-background').text()) {
						solde1 = solde2 = "n/a €";
					}
					
					if(!solde2 && !connection) {
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
						  });	
				




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
						  });	
						  
						  
				
				$.get('https://planete.insa-lyon.fr/insa-zimbra-portlet/api/getMessageSummaries', function (mails) {
					infomails = mails.messageSummary.unreadCount+" / "+mails.messageSummary.messageCount;
					if(!infomails  && !connection) {
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
						  });
						  
				$.get('http://cipcnet.insa-lyon.fr/scol/cnil_getinfos', function (response) {
					var source2 = $('<div>' + response + '</div>');
					infonom = MajNom(source2.find('td:eq(11)').html())+" "+source2.find('td:eq(9)').html();
					infoto = source2.find('td:eq(5)').html();
					
					if(!infonom  && !connection) {
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
						  });
				
				
				function envoiinfos(infomails, solde1, solde2, infonom, infoto, admission) {
					chrome.storage.local.set({infos: new Array()});
					chrome.storage.local.set({infos: new Array(
					infomails,
					solde1,
					solde2,
					infoto,
					infonom,
					admission
					)});
				}

	}
	else
      sendResponse({});
});

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

function connect() {
			chrome.storage.local.set({connect: ""});
			chrome.storage.local.set({connect: "debut"});
			
			
		if(!(!localStorage['passe'] | localStorage['passe'] == 'undefined' | localStorage['nom'] == 'undefined'| !localStorage['nom'])){
			chrome.storage.local.set({connect: "insa-invité"});
		
			$.post( "https://a6000.insa-lyon.fr/cgi-bin/login", { user: localStorage['nom'], fqdn: "insa-lyon.fr", password:CryptoJS.AES.decrypt(localStorage['passe'], "1NS4"+localStorage['s']).toString(CryptoJS.enc.Utf8), submit:"envoyer" }, function() {}).error(function(xhr) {	 if(xhr.status==0) chrome.tabs.create({url: 'http://www.google.com'});			});

			chrome.storage.local.set({connect: "insa CAS"});
			var frame = document.createElement('iframe');
			frame.setAttribute('src','https://login.insa-lyon.fr/cas/login?service=http%3A//cipcnet.insa-lyon.fr/scol/php/ok/');
			document.body.appendChild(frame);
				
		}
		else {
			chrome.storage.local.set({connect: "nope"});
			deleteFrames();
		}
			
}


function deleteFrames() {
	var iframes = document.getElementsByTagName('iframe');
	for (var i = 0; i < iframes.length; i++) {
		iframes[0].parentNode.removeChild(iframes[0]);
	}
}

		chrome.storage.onChanged.addListener(function(changes, namespace) {
			for (key in changes) {
				if(key=="connect" & changes["connect"].newValue =="ok") {
					deleteFrames();
				}
				if(key=="connect" & changes["connect"].newValue =="zimbra") {
					//deleteFrames();
					 $.get('https://login.insa-lyon.fr/cas/login?service=https%3A%2F%2Flogin.insa-lyon.fr%2Fzimbra%2Flogin%3Fversion%3Dpreferred', function (response) {
									//on test si c'est bien zimbra
					}).fail(function() {
						chrome.storage.local.set({connect: "nope"});
					});
				}
			}
      });
	  
	  

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
  
