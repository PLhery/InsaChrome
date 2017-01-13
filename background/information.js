"use strict";

class InfoInsa {
    static getAll() {
        return Promise.all([this.getSolde(), this.getMails(), this.getNom()]).then((infos) => {
            return [infos[1].infoMails,
                infos[0].solde1,
                infos[0].solde2,
                infos[2].photo,
                infos[2].nom];
        })
    }

    static getSolde() {
        return axios.get('https://planete.insa-lyon.fr/uPortal/f/fav/normal/render.uP').then((response) => { //On récupère les infos sur le solde
            const $response = $(response.data);
            $response.find("img").removeAttr("src");

            let solde1 = $response.find('.reco-balance:eq(0)').text();
            let solde2 = $response.find('.reco-balance:eq(1)').text(); //On les lit
            if(!solde2 && $response.find('.reco-background').text()) { //Si on a pas de solde (ex l'etudiant n'est pas au self), écrire n/a
                solde1 = solde2 = "n/a €";
            }
            if(!solde2) throw "utilisateur non connecté"; //s'il manque une info, on se connecte

            return {solde1: solde1, solde2: solde2};
        });
    }
    static getMails() {
        return axios.get('https://planete.insa-lyon.fr/insa-zimbra-portlet/api/getMessageSummaries').then((mails) => { //On récupère le nombre de mails restant
            if(!mails.data || !mails.data.messageSummary) throw "utilisateur non connecté"; //s'il manque une info, on se connecte

            return {infoMails : mails.data.messageSummary.unreadCount+" / "+mails.data.messageSummary.messageCount}; //On met les infos en forme
        });
    }
    static getNom() {
        return axios.get('https://planete.insa-lyon.fr/uPortal/f/for/normal/render.uP').then((response) => {
            const $response = $(response.data);
            $response.find("img").removeAttr("src");

            const infosHref = $response.find("li[tabindex='1'] a").attr("href"); // on récupere le lien vers les infos persos

            if(!infosHref) throw "utilisateur non connecté"; //s'il manque une info, on se connecte

            return axios.get("https://planete.insa-lyon.fr" + infosHref);
        }).then((response) => {
            const $response = $(response.data);

            const photo = $response.find("img.trombine").attr("src");
            $response.find("img").removeAttr("src");

            const $civilite = $response.find("table[summary=Civilité]");
            const prenom = $civilite.find("td:eq(2)").text();
            const nom = $civilite.find("td:eq(1)").text();

            if(!photo || !prenom || !nom) throw "utilisateur non connecté"; //s'il manque une info, on se connecte

            return {photo: photo, nom: prenom + " " + nom};
        });
    }
}