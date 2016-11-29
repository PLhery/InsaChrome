"use strict";

class Connect {
    static all() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('state', (result) => { //On récupère l'etat de la popup
                if (result.state === "connecté") //Si il est déja sensé être connecté
                    reject("Une erreur est survenue (#013) : <br/> Impossible de récupérer vos informations. Un site INSA a peut être un problème/cette extension n'est peut etre pas à jour !");

                else if (!localStorage['passe'] || !localStorage['nom']) //On vérifie si on a bien un username/pass
                    reject("Merci de rentrer votre identifiant/mot de passe dans les <a href='../options/options.html' style='color:white;font-weight:bold;' target='_blank'>options</a>. (#006)");

                else {//si y'a pas de soucis
                    chrome.storage.local.set({state: "connexion"});  //On passe la popup à l'etat de connexion

                    const connect = this.CAS().then(() => {
                        return Promise.all([this.moodle(), this.zimbra(), this.planete()]);
                    });
                    resolve(connect);
                }
            });
        }).catch((e) => { //En cas d'erreur
            chrome.storage.local.set({erreur: e}); //On le signale à la popup
        });
    };

    static CAS()  {
        //On se connecte à INSA CAS
        return new Promise((resolve, reject) => {
            chrome.cookies.remove({"url": "https://login.insa-lyon.fr/cas/", "name": "JSESSIONID"}); //on enlève le cookie JSESSIONID si déja présent

            $.get("https://login.insa-lyon.fr/cas/login").done(function (response) { //On génère un nouveau JSESSIONID et le lt associé
                //On vérifie si on est bien sur la bonne page
                chrome.cookies.get({"url": "https://login.insa-lyon.fr/cas/", "name": "JSESSIONID" }, function(cookie) { //on lit le cookie jsessionid

                    const $response = $(response);
                    $response.find("img").removeAttr("src");

                    $.post( "https://login.insa-lyon.fr/cas/login;"+cookie.value, { username: localStorage['nom'], password: CryptoJS.AES.decrypt(localStorage['passe'], "1NS4"+localStorage['s']).toString(CryptoJS.enc.Utf8), lt : $response.find("input[name='lt']").val(), execution: $response.find("input[name='execution']").val(), _eventId: "submit" }) //On envoie les infos de connection
                        .done(function( data ) { //On vérifie si on est bien connecté
                            const $data = $(data);
                            $data.find("img").removeAttr("src");
                            if($data.find("h2").first().text() === "Connexion réussie") { //Si on est bien connecté
                                chrome.storage.local.set({services: "CAS"}); //On tick le service CAS sur la popup
                                resolve();
                            }else if($data.find("#msg").text()) { //Sinon, s'il y a un message
                                if($data.find("#msg").text()==="Mauvais identifiant / mot de passe.")//Si c'est un problème de mot de passe
                                    reject("Une erreur est survenue (#003) :  <br/> Vos identifiants semblent incorrects. Verifiez-les dans les <a href='../options/options.html' style='color:white;font-weight:bold;' target='_blank'>options</a>.");
                                else
                                    reject("Une erreur CAS (#004) est survenue <br/><br/> Message : "+$data.find("#msg").text());
                            }else //Si il y a une erreur et pas de message
                                error("Une erreur inconnue (#005) est survenue lors de votre connexion à CAS.");
                        }).fail(function() {
                        reject("Un problème est survenu (#002), <br/> êtes-vous connecté à internet ?");
                    });
                });
            }).fail(function(jqXHR) {
                if(!jqXHR.status) {
                    reject("Un problème est survenu (#001),<br/> êtes-vous connecté à internet ?");
                } else
                    reject("Une erreur est survenue sur le site CAS (#016),<br/>"+jqXHR.status+" - "+jqXHR.statusText);
            })
        });
    }

    static moodle() {
        //On se connecte à Moodle
        return new Promise(function(resolve, reject) {
            $.get("http://moodle2.insa-lyon.fr/login/index.php?authCAS=CAS").done(function (response) { //On demande la page de connexion
                const $response = $(response);
                $response.find("img").removeAttr("src");
                if($response.find(".logininfo:eq(0) a:eq(1)").eq(0).text() === "Déconnexion") { //Si le bouton déconnexion est present sur le moodle (donc il est connecté)
                    chrome.storage.local.set({services: "Moodle"}); //On tick le service Moodle sur la popup
                    resolve();
                } else
                    reject("Une erreur inconnue (#010) est survenue lors de votre connexion au Moodle.");

            }).fail(function(jqXHR) {
                if(!jqXHR.status)
                    reject("Un problème est survenu (#009),<br/> êtes-vous connecté à internet ?");
                else
                    reject("Une erreur est survenue sur le site moodle (#018),<br/>"+jqXHR.status+" - "+jqXHR.statusText);
            });
        });
    }

    static zimbra() {
        //On se connecte à Zimbra
        return new Promise(function(resolve, reject) {

            $.get("https://login.insa-lyon.fr/zimbra/login?version=standard").done(function (response) { //On demande la page de connexion
                const $response = $(response);
                $response.find("img").removeAttr("src");
                if($response.find(".skin_link:eq(1)").text() === "Se déconnecter") { //Si le bouton déconnexion est present sur Zimbra (donc il est connecté)
                    chrome.storage.local.set({services: "Zimbra"}); //On tick le service Zimbra sur la popup
                    resolve();
                } else
                    reject("Une erreur inconnue (#012) est survenue lors de votre connexion à Zimbra.");

            }).fail(function(jqXHR) {
                if(!jqXHR.status)
                    reject("Un problème est survenu (#011),<br/> êtes-vous connecté à internet ?");
                else
                    reject("Une erreur est survenue sur le site Zimbra (#019),<br/>"+jqXHR.status+" - "+jqXHR.statusText);
            });
        });
    }

    static planete() {
        //On se connecte à Planète
        return new Promise(function(resolve, reject) {
            $.get("https://planete.insa-lyon.fr/uPortal/f/u23l1s5/normal/render.uP").done(function (response) { //On demande la page de connexion
                const $response = $(response);
                $response.find("img").removeAttr("src");
                if($response.find(".link-logout").first().text() === "Déconnexion") { //Si le bouton déconnexion est present sur Planète (donc il est connecté)
                    chrome.storage.local.set({services: "Planete"}); //On tick le service Zimbra sur la popup
                    resolve();
                } else
                    reject("Une erreur inconnue (#015) est survenue lors de votre connexion à Planète.");

            }).fail(function(jqXHR) {
                if(!jqXHR.status)
                    reject("Un problème est survenu (#014),<br/> êtes-vous connecté à internet ?");
                else if(jqXHR.status===503)
                    reject("Le site planète semble en maintenance... (#020)");
                else
                    reject("Une erreur est survenue sur le site planète (#020),<br/>"+jqXHR.status+" - "+jqXHR.statusText);

            });
        });
    }
}