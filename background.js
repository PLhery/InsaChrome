	if(!localStorage['s']) { //S'il n'y a pas de clé de cryptage - c'est à dire qu'on est encore à une version ou le mot de passe n'etait pas crypté
		localStorage['s']=Math.floor(Math.random() * 90000) + 10000 //On en génère une
		localStorage['passe'] = CryptoJS.AES.encrypt(localStorage['passe'], "1NS4"+localStorage['s']); //et on crypte le mot de passe
	}
	

	if(!localStorage['insainviteauto'] | localStorage['insainviteauto'] == 'undefined') //Si les options ne sont pas définies, on les met à leur valeur par défaut.
		localStorage['insainviteauto']=true;
	if(!localStorage['reseauinsaauto'] | localStorage['reseauinsaauto'] == 'undefined')
		localStorage['reseauinsaauto']=true;
	if(!localStorage['formatemploi'] | localStorage['formatemploi'] == 'undefined')
		localStorage['formatemploi']="pdf";	
	if(!localStorage['ajoutsemaine'] | localStorage['ajoutsemaine'] == 'undefined')
		localStorage['ajoutsemaine']=true;
		
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { //Si une page (popup ou content script) nous demande des infos
		if (request.method == "getInfos") //S'il veut les identifiants
		  sendResponse({passe: CryptoJS.AES.decrypt(localStorage['passe'], "1NS4"+localStorage['s']).toString(CryptoJS.enc.Utf8), nom: localStorage['nom'], insainviteauto: localStorage['insainviteauto'], autoconnect: localStorage['reseauinsaauto']}); //les voila
		  
		else if(request.method == "connect") { //S'il veut qu'on se connecte
			connect(); //VoiliVoilou
		}
		else if(request.method == "timetable") { //S'il veut qu'on charge l'emploi du temps ("i emploi du temps")
			LoadTimetable();				  
		}
		else if(request.method == "reload") { //S'il veut qu'on actualise les pages INSA
				  chrome.tabs.query({url : "*://*.insa-lyon.fr/*"}, function(tabs) {
						tabs.forEach(function(tab) {
						   chrome.tabs.reload(tab.id);
						});
				  });					  
		}
		else if(request.method == "popupStart") { //Si la popup vient de se démarrer
		getInformations(); //On récupère lance la récupération d'informations (qui peut aboutir à une demande de connexion)
		}
		else  //Sinon on renvoie rien.
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
					
					if(solde1 && solde2 && infonom && infoto && infomails && impressions) //Si on a toutes les infos (si c'etait le dernier qu'on attendait), on les envoie
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
					
					if(solde1 && solde2 && infonom && infoto && infomails && impressions) //Si on a toutes les infos (si c'etait le dernier qu'on attendait), on les envoie
						envoiinfos(infomails, solde1, solde2, infonom, infoto, impressions);
						
				}).fail(function() { //Si on a un problème, on lance la connexion
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
					if(solde1 && solde2 && infonom && infoto && infomails && impressions) //Si on a toutes les infos (si c'etait le dernier qu'on attendait), on les envoie
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
					if(solde1 && solde2 && infonom && infoto && infomails && impressions) //Si on a toutes les infos (si c'etait le dernier qu'on attendait), on les envoie
						envoiinfos(infomails, solde1, solde2, infonom, infoto, impressions);
						
				}).fail(function() { //Si on a un problème, on lance la connexion
							if(!connection) {
								connection = true;
								connect();
							}
						  });

	}
	
	function envoiinfos(infomails, solde1, solde2, infonom, infoto, impressions) { //Envoi les infos sur la personne à la popup
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
								error("Une erreur est survenue (#003) :  <br/> Vos identifiants semblent incorrects. Verifiez-les dans les <a href='options.html' style='color:white;font-weight:bold;' target='_blank'>options</a>.")
							else
								error("Une erreur CAS (#004) est survenue <br/><br/> Message : "+$('<div>' + data + '</div>').find("#msg").text());
						}else //Si il y a une erreur et pas de message
							error("Une erreur inconnue (#005) est survenue lors de votre connexion à CAS.");
						
					}).fail(function() {
						error("Un problème est survenu (#002), <br/> êtes-vous connecté à internet ?");
					});
				});				
		}).fail(function(jqXHR) {
			if(!jqXHR.status)
				error("Un problème est survenu (#001),<br/> êtes-vous connecté à internet ?");
			else
				error("Une erreur est survenue sur le site CAS (#016),<br/>"+jqXHR.status+" - "+jqXHR.statusText);
		})

	}

	function connectCIPC() {

		//On se connecte à CIPCNET
		$.get("https://login.insa-lyon.fr/cas/login?service=http%3A%2F%2Fcipcnet.insa-lyon.fr%2Flogin_form").done(function (response) { //On demande la page de connexion
			alert("oui");
			if($('<div>' + response + '</div>').find("#user-name").length) //Si le nom d'utilisateur est bien affiché sur CIPC (donc il est connecté)
				chrome.storage.local.set({services: "CIPC"}); //On tick le service CIPC sur la popup
			else
				error("Une erreur inconnue (#008) est survenue lors de votre connexion à CIPCNet.");
			
		}).fail(function(jqXHR) {
			if(!jqXHR.status)
				error("Un problème est survenu (#007),<br/> êtes-vous connecté à internet ?");
			else
				error("Une erreur est survenue sur le site CIPC (#017),<br/>"+jqXHR.status+" - "+jqXHR.statusText);
		});

	}

	function connectMoodle() {

		//On se connecte à Moodle
		$.get("http://cipcnet.insa-lyon.fr/moodle.195/login/index.php").done(function (response) { //On demande la page de connexion
			
			if($('<div>' + response + '</div>').find("#portal-personaltools li a:eq(1)").text() == "Déconnexion") //Si le bouton déconnexion est present sur le moodle (donc il est connecté)
				chrome.storage.local.set({services: "Moodle"}); //On tick le service Moodle sur la popup
			else
				error("Une erreur inconnue (#010) est survenue lors de votre connexion au Moodle.");
			
		}).fail(function(jqXHR) {
			if(!jqXHR.status)
				error("Un problème est survenu (#009),<br/> êtes-vous connecté à internet ?");
			else
				error("Une erreur est survenue sur le site moodle (#018),<br/>"+jqXHR.status+" - "+jqXHR.statusText);
		});

	}

	function connectZimbra() {

		//On se connecte à Zimbra
		$.get("https://login.insa-lyon.fr/zimbra/login?version=standard").done(function (response) { //On demande la page de connexion
			if($('<div>' + response + '</div>').find(".skin_link:eq(1)").text() == "Se déconnecter") //Si le bouton déconnexion est present sur Zimbra (donc il est connecté)
				chrome.storage.local.set({services: "Zimbra"}); //On tick le service Zimbra sur la popup
			else
				error("Une erreur inconnue (#012) est survenue lors de votre connexion à Zimbra.");
			
		}).fail(function(jqXHR) {
			if(!jqXHR.status)
				error("Un problème est survenu (#011),<br/> êtes-vous connecté à internet ?");
			else
				error("Une erreur est survenue sur le site Zimbra (#019),<br/>"+jqXHR.status+" - "+jqXHR.statusText);
		});

	}

	function connectPlanete() {

		//On se connecte à Planète
		$.get("https://planete.insa-lyon.fr/uPortal/f/u23l1s5/normal/render.uP").done(function (response) { //On demande la page de connexion
			if($('<div>' + response + '</div>').find(".link-logout").first().text() == "Déconnexion") //Si le bouton déconnexion est present sur Planète (donc il est connecté)
				chrome.storage.local.set({services: "Planete"}); //On tick le service Zimbra sur la popup
			else
				error("Une erreur inconnue (#015) est survenue lors de votre connexion à Planète.");
			
		}).fail(function(jqXHR) {
			if(!jqXHR.status)
				error("Un problème est survenu (#014),<br/> êtes-vous connecté à internet ?");
			else if(jqXHR.status==503)
				error("Le site planète semble en maintenance... (#020)");
			else
				error("Une erreur est survenue sur le site planète (#020),<br/>"+jqXHR.status+" - "+jqXHR.statusText);
			
		});

	}


	function error(error) { //En cas d'erreur
		chrome.storage.local.set({erreur: error}); //On le signale à la popup
	}

	function MajNom(nom){ //Fonction pour mettre en majuscule la premiere lettre des noms composés
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


	  
	  

	var lastsugg; //ce sera la meilleure suggestion (par défaut, affichée en bleu)

	chrome.omnibox.onInputChanged.addListener( //Si on tape une requête commencant par "i" dans l'omnibox (la barre d'adresse)
		function(text, suggest) { //On envoie les suggestions (les propositions sous l'adresse)
		  
			  var sugg = []; //Le tableau de suggestions qu'ont va envoyer


			if("emploi du temps".indexOf(text.toLowerCase())!=-1) //si ce qu'a tapé l'utilisateur est contenu dans "emploi du temps"
				sugg.push({content: "Emploi du temps", description: "Emploi du temps <dim>Affiche votre emploi du temps de la semaine</dim>"}); //On envoie la suggestion

			if("moodle".indexOf(text.toLowerCase())!=-1)
				sugg.push({content: "Moodle", description: "Moodle <dim>Vous redirige vers le moodle</dim>"}); //même principe
				
			if("zimbra mail".indexOf(text.toLowerCase())!=-1)
				sugg.push({content: "Zimbra", description: "Zimbra <dim>Vos mails insa</dim>"});

			if("cipcnet premier cycle accueil".indexOf(text.toLowerCase())!=-1)
				sugg.push({content: "CIPC", description: "Accueil CIPCnet <dim>Your BatCaaaave</dim>"});
				
			if("notes bulletin scolarité scolarite".indexOf(text.toLowerCase())!=-1)
				sugg.push({content: "Notes", description: "Notes <dim>Votre bulletin de notes chéri</dim>"});

			if("planète planete cantine".indexOf(text.toLowerCase())!=-1)
				sugg.push({content: "Planete", description: "Planète <dim>Combien vous reste-t-il pour la cantiiiine ?</dim>"});
				
			sugg.push({content: "cours "+text, description: "Recherche Moodle : <match>"+text+"</match> <dim>Recherche les cours Moodle de "+text+"</dim>"}); //Dans tous les cas, on envoie les suggestions de recherche (dans moodle ou dans le trombinoscope)
			sugg.push({content: "prenom "+text, description: "Recherche par prénom : <match>"+text+"</match> <dim>Recherche les étudiants INSA dont le prénom contient "+text+"</dim>"});
			sugg.push({content: "nom "+text, description: "Recherche par nom : <match>"+text+"</match> <dim>Recherche les étudiants INSA dont le nom de famille contient "+text+"</dim>"});
			
			lastsugg = sugg[0].content; //On sauvegarde la meilleure suggestion..
			delete sugg[0].content; //On enlève son content
			chrome.omnibox.setDefaultSuggestion(sugg[0]); //... on va l'afficher en bleu par défaut (qui ne demande pas de content)
			sugg.shift(); //On enlève ce premier element sugg[0] de sugg, en décalant tous les élements, pour pas faire doublon
			suggest(sugg); //On envoie le tableau de suggestions

			
		});



	function navigate(url) { //Ouvre un nouvel onglet et va à l'url demandée
	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.update(tabs[0].id, {url: url});
	  });
	}

	chrome.omnibox.onInputEntered.addListener(function(text) { //Si  l'utilisateur valide son choix
			
		var tour2=false;
			do {
					tour2=false;
					switch (text) //On cherche à trouver ce que l'utilisateur à choisi, et faire en consequence (est bien marqué que s'il clique sur une suggestion)
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
						default: //S'il a rien trouvé
							if(text.indexOf("cours ")==0) //Si le texte entré commence par "cours" en fait c'est qu'il fait une recherche (ex : cours chimie)
								navigate("http://cipcnet.insa-lyon.fr/moodle.195/course/search.php?search="+text.substr(6));
							else if(text.indexOf("prenom ")==0) //la même
								navigate("http://cipcnet.insa-lyon.fr/scol/recherches/ldap_search?pcontient=1&id_prenom="+text.substr(7));
							else if(text.indexOf("nom ")==0)
								navigate("http://cipcnet.insa-lyon.fr/scol/recherches/ldap_search?ncontient=1&id_nom="+text.substr(4));
							else { //Sinon c'est qu'il a fait entré en voulant aller à la solution proposée en bleu
							text = lastsugg; //On va prendre la proposition en bleu
							tour2=true; //On refait le tour
							}
						break; 
					 }
			}
			while(tour2) //On refait le tour si tour2 a été mis à true.

	});
  
    function LoadTimetable() { //Fonction pour charger l'emploi du temps dans un nouvel onglet
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { //On ouvre un nouvel onglet
				chrome.tabs.update(tabs[0].id, {url: "patientez/patientez.html"}); //Pour l'instant on lui met le message "patientez"

				$.get('http://cipcnet.insa-lyon.fr/scol/edt_form', function (response) { //On charge la page d'emploi du temps pour regarder le groupe/la semaine
					var source = $('<div>' + response + '</div>');
					
					var edt=(localStorage['formatemploi'] == "html")?"edt_form":"php/edt_pdf";//L'utilisateur le veut-il en pdf ou html (réglé dans les options) ?
					
					if(!source.find("#user-name").length) //Si le nom d'utilisateur est pas affiché (donc il est déconnecté)
						chrome.tabs.update(tabs[0].id, {url: "patientez/connexion.html"}); //on lui affiche le message de connexion ///!!!!!!\\\ LA CONNEXION NE SE FAIT PAS ENCORE VRAIMENT
					else if(!source.find("#id_groupe").val() || !source.find("#id_semaine_pc").val()) //Si le groupe ou la semaine n'est pas selectionnée
						chrome.tabs.update(tabs[0].id, {url: "patientez/pasDeSemaine.html"}); //On lui propose de choisir
					else  {//Si tout est bon, on charge l'emploi du temps
						var jour = new Date().getDay(); //On récupère le jour de la semaine
						var nextWeek = (localStorage['ajoutsemaine']=="true" && (jour==6||jour==0)) //Si on est le week end  et qu'on a coché la case correspondante dans les options, on rajoute une semaine
						chrome.tabs.update(tabs[0].id, {url: "http://cipcnet.insa-lyon.fr/scol/"+edt+"?id_groupe="+source.find("#id_groupe").val()+"&id_semaine_pc="+(parseInt(source.find("#id_semaine_pc").val())+nextWeek)+"&form.button.Ok=Ok&form.submitted=1"});
						}
				}).fail(function() { //Si on a un problème, on met le message d'erreur
					chrome.tabs.update(tabs[0].id, {url: "patientez/erreurInternet.html"});
				}); 

		});
	}
  
