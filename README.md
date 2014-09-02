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

==========

INFOS :

Je n'ai pas commenté le code comme il faudrait, en fait j'ai mis les fichiers tels quels..
Si j'ai le temps, je le ferai en refaisant le script.
Il peut être en effet optimisé (si vous voulez vous y mettre).

Deja, toutes les connexions se font en synchrone, l'une après l'autre. Ce qui n'est pas à chaque fois nécessaire.
Ensuite, sur la technique, je n'ai pas réussi à récupérer les cookies de ce domaine avec de l'ajax. Peut être trouverai-je un moyen car ce serait bien plus efficace.
En attendant, la connexion se fait dans une iframe qui se charge et décharge en arrière plan dans le background.html, et des "content-script" (log1, log2, log3.js) qui vont de page en page pour valider les connexions sur les differents sites INSA.