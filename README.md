InsaChrome
==========
https://chrome.google.com/webstore/detail/insachrome/lpdlefamgmjigoiioihnhikabnmmelgk

LICENSE : Apache V2.

==========
INSTALLATION : 
- via le chrome webstore (pour avoir les mises à jour automatiques) https://chrome.google.com/webstore/detail/insachrome/lpdlefamgmjigoiioihnhikabnmmelgk
- via le .crx à télecharger sur http://paul-louis.eu/InsaChrome/ puis à glisser dans chrome://extensions/
- télechargez les fichiers de github, allez dans chrome://extensions/, cliquez sur "mode développeur", "charger l'extension non empaquetée..", et selectionnez le dossier dans lequel vous avez les fichiers github

==========

DESCRIPTION : 

Connectez-vous automatiquement au réseau wifi insa-invité, à cipcnet et au réseau insa, en un clic.

Cette extension vous connecte automatiquement (si vous allez sur un site insa, ou tombez sur une page de login) à insa-invité, cipcnet, moodle, zimbra, planete, et au réseau insa. Un bouton d'action (masquable) vous permet de vous connecter automatiquement si ce n'est pas fait, ainsi que de consulter le solde de sa carte, le nombre de mails non lu, et la confirmation de connexion.

En tapant dans la barre d'adresse "i" puis espace, puis un première lettre, vous aurez accès à plein de raccourcis : votre emploi du temps, vos mails, rechercher quelqu'un parmis les etudiants, parmis les cours moodle...

Pour le paramétrer : clic droit sur le bouton d'action, options.

N’hésitez-pas à me faire parvenir vos bugs. (paul-louis.hery@insa-lyon.fr)

En ce qui concerne l'apparence et fonctionnalités bonus n'hésitez pas à prévenir Johnny qui est en train de donner de la souplesse à l'usage de l'extension(quentin.guye@insa-lyon.fr)

==========

JE NE CONNAIS PAS TROP LES EXTENSIONS CHROME, QUE LIRE DANS LE CODE ?

Le fichier manifest.json dit à chaque fichier quoi faire.

Ainsi, "background" est une page qui tourne en tâche de fond. Enfin, ce n'est plus un background mais une "event page", un amélioration (récente) du background, qui ne tourne plus à 100% en tache de fond. C'est le gros du code.
On charge pour ce background les librairies jquery (qui permet de faire pas mal de choses en js) et une librairie de cryptage AES (pour le mot de passe, bien que peu utile), puis le background.js, le gros du code.

En fait, ce background.js va recevoir pleins de requetes des differents endroits (la popup en haut à droite qui va lui demander de se connecter, ce qu'il va faire en envoyant l'avancée de celle-ci, ou quand on fait "i emploi du temps", les suggestions/le traitement sont faites par le background). Tout est commenté.

Ensuite, "browser_action" est le petit bouton en haut à droite, d'icone "icon48.png". Appuyer dessus ouvre popup.html qui lui même ouvre popup.js. Popup.js est le script qui va echanger avec le background pour afficher ou il en est/les infos/inclure les petites animations.

Un content script ajoute un script dans la page. Ainsi il va ajouter insainvite.js à la page de connexion insa-invité, qui va remplir les formulaires et simuler un clic sur le "ok". Il va aussi ajouter autoconnect.js à toutes les pages INSA, qui connectera automatiquement l'utilisateur quand il ira sur une page (du moins gerera la partie graphique)

La page d'options (clic droit->options) c'est options.html. Options.js s'occupe d'enregistrer en temps réel les changements d'identifiants.

Enfin les permissions : l'extension à le droit d'accès à arubanetworks, la page de connexion d'insa invité des batiments A/B; aux sites INSA, aux cookies, nécessaires lors de la connexion, au stockage (des options) et aux onglets (pour les actualiser quand la connexion est faite, ou en ouvrir un nouveau pour afficher l'emploi du temps)


-> Lire le manifest.json en détails

Le JSON est un langage relativement simple, mais a le défaut de ne pas proposer de commentaires. En voici donc quelques uns.

• Le fichier en lui-même est le fichier de lancement de l'extension, c'est le premier lu et il servira de chef d'orchestre au reste de l'extension

• De "manifest_version" jusqu'à "description" : c'est de l'information pour l'utilisateur

• "icons" : les 3 dimensions d'icônes nécessaire à l'affichage de Chrome

• "background" : c'est une page qui tourne en arrière plan. Un peu bizarre en ce sens qu'il n'y a pas de page html assosciée créée dans les dossiers mais le principe est le même. On lui donne les les librairies jquery (qui permet de faire pas mal de choses en js) et une librairie de cryptage AES (pour le mot de passe, bien que peu utile), puis le background.js, le gros du code.

• "browser_action" : affiche la petite icône en haut à droite de Chrome et lance la popup au click

• "content-scripts" : Ajoute du script à la page en toile de fond. J'ai pas encore bien lu le code...

• "omnibox" : permet le raccourci "i"

• "options_page" : donne la page d'options

• "permissions" : donne les permissions de modification sur les sites INSA, de stocker sur votre ordi les identifiants et de se connecter au site de login.

