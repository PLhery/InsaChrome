"use strict";

// Quand l'extension est installée ou mise à jour
chrome.runtime.onInstalled.addListener(function() {
        if(!localStorage['insainviteauto']) //Si les options ne sont pas définies, on les met à leur valeur par défaut.
            localStorage['insainviteauto']="true";
        if(!localStorage['reseauinsaauto'])
            localStorage['reseauinsaauto']="true";
        if(!localStorage['formatemploi'])
            localStorage['formatemploi']="pdf";
        if(!localStorage['ajoutsemaine'])
            localStorage['ajoutsemaine']="true";
        if(!localStorage['notifnotes'])
            localStorage['notifnotes']='false';
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { //Si une page (popup ou content script) nous demande des infos
    if (request.method === "getInfos") //S'il veut les identifiants
      sendResponse({passe: CryptoJS.AES.decrypt(localStorage['passe'], "1NS4"+localStorage['s']).toString(CryptoJS.enc.Utf8), nom: localStorage['nom'], insainviteauto: localStorage['insainviteauto'], autoconnect: localStorage['reseauinsaauto']}); //les voila

    else if(request.method === "connect") { //S'il veut qu'on se connecte
        Connect.all();
    }
    else if(request.method === "timetable") { //S'il veut qu'on charge l'emploi du temps ("i emploi du temps")
        LoadTimetable();
    }
    else if(request.method === "reload") { //S'il veut qu'on actualise les pages INSA
              chrome.tabs.query({url : "*://*.insa-lyon.fr/*"}, function(tabs) {
                    tabs.forEach(function(tab) {
                       chrome.tabs.reload(tab.id);
                    });
              });
    }
    else if(request.method === "popupStart") { //Si la popup vient de se démarrer
        InfoInsa.getAll() //On récupère lance la récupération d'informations (qui peut aboutir à une demande de connexion)
            .then((infos) => chrome.storage.local.set({infos: infos}))
            .catch(() => Connect.all());
    }
    else  //Sinon on renvoie rien.
      sendResponse({});
});