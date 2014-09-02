
if(!localStorage['nom'] | localStorage['nom'] == 'undefined')
	localStorage['nom']="";
if(!localStorage['passe'] | localStorage['passe'] == 'undefined')
	localStorage['passe']="";
if(!localStorage['insainviteauto'] | localStorage['insainviteauto'] == 'undefined')
	localStorage['insainviteauto']=true;
if(!localStorage['reseauinsaauto'] | localStorage['reseauinsaauto'] == 'undefined')
	localStorage['reseauinsaauto']=true;
if(!localStorage['formatemploi'] | localStorage['formatemploi'] == 'undefined')
	localStorage['formatemploi']="pdf";
	

document.getElementById('nom').value=localStorage['nom'];
document.getElementById('passe').value=CryptoJS.AES.decrypt(localStorage['passe'], "1NS4"+localStorage['s']).toString(CryptoJS.enc.Utf8);
document.getElementById('insainviteauto').checked=(localStorage['insainviteauto']=="true");
document.getElementById('reseauinsaauto').checked=(localStorage['reseauinsaauto']=="true");
document.getElementById('formatemploi').value=localStorage['formatemploi'];

document.getElementById('nom').onkeyup=enregistrer;
document.getElementById('passe').onkeyup=enregistrer;
document.getElementById('insainviteauto').onclick=enregistrer;
document.getElementById('reseauinsaauto').onclick=enregistrer;
document.getElementById('formatemploi').onchange=enregistrer;
		
		
function enregistrer()
	{
		localStorage['s']=Math.floor(Math.random() * 90000) + 10000
		localStorage['nom']=document.getElementById('nom').value;
		localStorage['passe']=  CryptoJS.AES.encrypt(document.getElementById('passe').value, "1NS4"+localStorage['s']);
		localStorage['insainviteauto']=document.getElementById('insainviteauto').checked;
		localStorage['reseauinsaauto']=document.getElementById('reseauinsaauto').checked;
		localStorage['formatemploi']=document.getElementById('formatemploi').value;
	}
var infst = 0;

document.getElementById('plusinfos').onclick = function () {
	var infos = document.getElementsByClassName('infos');
	for (var i = 0; i < infos.length; i ++) {
		infos[i].style.display = (infst)?'none':'block';
	}
	infst=1-infst;
}