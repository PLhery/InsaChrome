
if(!localStorage['nom']) //On initialise les options si rien n'est rentré
	localStorage['nom']="";
if(!localStorage['passe'])
	localStorage['passe']="";
if(!localStorage['insainviteauto'])
	localStorage['insainviteauto']="true";
if(!localStorage['reseauinsaauto'])
	localStorage['reseauinsaauto']="true";
if(!localStorage['formatemploi'])
	localStorage['formatemploi']="pdf";
if(!localStorage['ajoutsemaine'])
	localStorage['ajoutsemaine']="true";
if(!localStorage['notifnotes'])
	localStorage['notifnotes']='false';

document.getElementById('nom').value=localStorage['nom']; //On remplit les cases avec les valeurs
document.getElementById('passe').value=CryptoJS.AES.decrypt(localStorage['passe'], "1NS4"+localStorage['s']).toString(CryptoJS.enc.Utf8);
document.getElementById('insainviteauto').checked=(localStorage['insainviteauto']=="true");
document.getElementById('reseauinsaauto').checked=(localStorage['reseauinsaauto']=="true");
document.getElementById('formatemploi').value=localStorage['formatemploi'];
document.getElementById('ajoutsemaine').checked=(localStorage['ajoutsemaine']=="true");
document.getElementById('notifnotes').checked=(localStorage['notifnotes']=="true");


document.getElementById('nom').onkeyup=enregistrer; //Si on fait une action sur les formulaires, enregistrer les modifications
document.getElementById('passe').onkeyup=enregistrer;
document.getElementById('insainviteauto').onclick=enregistrer;
document.getElementById('reseauinsaauto').onclick=enregistrer;
document.getElementById('formatemploi').onchange=enregistrer;
document.getElementById('ajoutsemaine').onchange=enregistrer;
document.getElementById('notifnotes').onchange=enregistrer;	
		
function enregistrer()
	{
		localStorage['s']=Math.floor(Math.random() * 90000) + 10000 //On regénère la clé de cryptage
		localStorage['nom']=document.getElementById('nom').value;
		localStorage['passe']=  CryptoJS.AES.encrypt(document.getElementById('passe').value, "1NS4"+localStorage['s']); //On enregistre toutes les infos dans le localStorage
		localStorage['insainviteauto']=document.getElementById('insainviteauto').checked;
		localStorage['reseauinsaauto']=document.getElementById('reseauinsaauto').checked;
		localStorage['formatemploi']=document.getElementById('formatemploi').value;
		localStorage['ajoutsemaine']=document.getElementById('ajoutsemaine').checked;
		localStorage['notifnotes']=document.getElementById('notifnotes').checked;
	}
var infst = 0;

document.getElementById('plusinfos').onclick = function () { //Si on clique sur plus d'infos
	var infos = document.getElementsByClassName('infos'); //On affiche les élements cachés (de classe "infos")
	for (var i = 0; i < infos.length; i ++) {
		infos[i].style.display = (infst)?'none':'block';
	}
	infst=1-infst;
}


var k = [73,78,83,65]; //Les lettres I,N,S,A
n = 0;  
$(document).keydown(function (e) {  
    if (!$("input:focus").length && e.keyCode === k[n++]) {  
        if (n === k.length) {   //Si on les appuie successivement...
            var _0x4bf4=["\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x22\x74\x65\x78\x74\x2D\x61\x6C\x69\x67\x6E\x3A\x63\x65\x6E\x74\x65\x72\x3B\x22\x3E\x3C\x62\x72\x2F\x3E\x3C\x62\x72\x2F\x3E\x3C\x69\x66\x72\x61\x6D\x65\x20\x77\x69\x64\x74\x68\x3D\x22\x38\x35\x34\x22\x20\x68\x65\x69\x67\x68\x74\x3D\x22\x35\x31\x30\x22\x20\x73\x72\x63\x3D\x22\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x79\x6F\x75\x74\x75\x62\x65\x2E\x63\x6F\x6D\x2F\x65\x6D\x62\x65\x64\x2F\x42\x41\x6B\x75\x4B\x65\x58\x4B\x4C\x53\x41\x3F\x61\x75\x74\x6F\x70\x6C\x61\x79\x3D\x31\x22\x20\x66\x72\x61\x6D\x65\x62\x6F\x72\x64\x65\x72\x3D\x22\x30\x22\x3E\x3C\x2F\x69\x66\x72\x61\x6D\x65\x3E\x3C\x2F\x64\x69\x76\x3E","\x61\x70\x70\x65\x6E\x64","\x62\x6F\x64\x79"];$(_0x4bf4[2])[_0x4bf4[1]](_0x4bf4[0]);
			//...et beh ca fait kek'chose de top secret.
        }  
    } else n = 0  
});  