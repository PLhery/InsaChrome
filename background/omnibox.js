let lastsugg; //ce sera la meilleure suggestion (par défaut, affichée en bleu)

chrome.omnibox.onInputChanged.addListener( //Si on tape une requête commencant par "i" dans l'omnibox (la barre d'adresse)
    function(text, suggest) { //On envoie les suggestions (les propositions sous l'adresse)

        let sugg = []; //Le tableau de suggestions qu'ont va envoyer

        if("moodle".indexOf(text.toLowerCase())!=-1)
            sugg.push({content: "Moodle", description: "Moodle <dim>Vous redirige vers le moodle</dim>"}); //même principe

        if("zimbra mail".indexOf(text.toLowerCase())!=-1)
            sugg.push({content: "Zimbra", description: "Zimbra <dim>Vos mails insa</dim>"});

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
    }
);



function navigate(url) { //Ouvre un nouvel onglet et va à l'url demandée
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: url});
    });
}

chrome.omnibox.onInputEntered.addListener(function(text) { //Si  l'utilisateur valide son choix
    let tour2=false;
    do {
        tour2=false;
        switch (text) //On cherche à trouver ce que l'utilisateur à choisi, et faire en consequence (est bien marqué que s'il clique sur une suggestion)
        {
            case "Moodle":
                navigate("http://moodle2.insa-lyon.fr/");
                break;
            case "Zimbra":
                navigate("https://zmail.insa-lyon.fr/");
                break;
            case "Planete":
                navigate("https://planete.insa-lyon.fr/");
                break;
            default: //S'il a rien trouvé
                if(text.indexOf("cours ")===0) //Si le texte entré commence par "cours" en fait c'est qu'il fait une recherche (ex : cours chimie)
                    navigate("http://cipcnet.insa-lyon.fr/moodle.195/course/search.php?search="+text.substr(6));
                else if(text.indexOf("prenom ")===0) //la même
                    navigate("http://cipcnet.insa-lyon.fr/scol/recherches/ldap_search?pcontient=1&id_prenom="+text.substr(7));
                else if(text.indexOf("nom ")===0)
                    navigate("http://cipcnet.insa-lyon.fr/scol/recherches/ldap_search?ncontient=1&id_nom="+text.substr(4));
                else { //Sinon c'est qu'il a fait entré en voulant aller à la solution proposée en bleu
                    text = lastsugg; //On va prendre la proposition en bleu
                    tour2=true; //On refait le tour
                }
                break;
        }
    }
    while(tour2); //On refait le tour si tour2 a été mis à true.

});