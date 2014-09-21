
if(!localStorage['nom'] | localStorage['nom'] == 'undefined') //On initialise les options si rien n'est rentré
	localStorage['nom']="";
if(!localStorage['passe'] | localStorage['passe'] == 'undefined')
	localStorage['passe']="";
if(!localStorage['insainviteauto'] | localStorage['insainviteauto'] == 'undefined')
	localStorage['insainviteauto']=true;
if(!localStorage['reseauinsaauto'] | localStorage['reseauinsaauto'] == 'undefined')
	localStorage['reseauinsaauto']=true;
if(!localStorage['formatemploi'] | localStorage['formatemploi'] == 'undefined')
	localStorage['formatemploi']="pdf";
	

document.getElementById('nom').value=localStorage['nom']; //On remplit les cases avec les valeurs
document.getElementById('passe').value=CryptoJS.AES.decrypt(localStorage['passe'], "1NS4"+localStorage['s']).toString(CryptoJS.enc.Utf8);
document.getElementById('insainviteauto').checked=(localStorage['insainviteauto']=="true");
document.getElementById('reseauinsaauto').checked=(localStorage['reseauinsaauto']=="true");
document.getElementById('formatemploi').value=localStorage['formatemploi'];

document.getElementById('nom').onkeyup=enregistrer; //Si on fait une action sur les formulaires, enregistrer les modifications
document.getElementById('passe').onkeyup=enregistrer;
document.getElementById('insainviteauto').onclick=enregistrer;
document.getElementById('reseauinsaauto').onclick=enregistrer;
document.getElementById('formatemploi').onchange=enregistrer;
		
		
function enregistrer()
	{
		localStorage['s']=Math.floor(Math.random() * 90000) + 10000 //On regénère la clé de cryptage
		localStorage['nom']=document.getElementById('nom').value;
		localStorage['passe']=  CryptoJS.AES.encrypt(document.getElementById('passe').value, "1NS4"+localStorage['s']); //On enregistre toutes les infos dans le localStorage
		localStorage['insainviteauto']=document.getElementById('insainviteauto').checked;
		localStorage['reseauinsaauto']=document.getElementById('reseauinsaauto').checked;
		localStorage['formatemploi']=document.getElementById('formatemploi').value;
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
    if (e.keyCode === k[n++]) {  
        if (n === k.length) {   //Si on les appuie successivement...
            circularAnimation();//...et beh ca fait kek'chose.
        }  
    } else n = 0  
});  


var circAnimI=0;
var circAnimColors=new Array("#e91e63","#00bcd4", "#8bc34a","#ffc107","#009688","#ff9800"); //Un gros tas de couleurs
function circularAnimation() { //adapté de http://jsfiddle.net/F9pLC/
							
						
		var width = $(window ).width(),
			height = $(window ).height(); //dimensions de la popup
		var diag = Math.ceil(Math.sqrt(width * width + height * height)); //On en déduit la diagonale/Le rayon max du cercle
		var pageX = width/2,
			pageY = height/2; //On en déduit le centre
		$('<div class="circle">').appendTo("body").css({ //On rajoute un cercle de 20*20/de rayon 10px au centre
			width: 20,
			height: 20,
			"border-radius": 20,
			top: pageY,
			left: pageX,
			"background-color": circAnimColors[circAnimI%6] //sa couleur ? La suivante dans le tableau
		}).animate({
			width: diag,
			height: diag //On l'anime de sa taille actuelle à la taille de la diagonale (quand le cercle a atteint la diagonale)
		}, {
			step: function (now, fx) {
				if (fx.prop === "height") return;
				$(this)
					.css("top", pageY - now/ 2)
					.css("left", pageX - now / 2) //à chaque étape on ajuste la position et le radius pour que ca reste un cercle
					.css("border-radius", now / 2);
			},
			easing: "swing",
			duration: 700,
			done: function () {
				$("body").css("background-color", $(this).css("background-color")).css("z-index", ""); //quand c'est fait on enlève le cercle et met la vraie couleur de fond
				$(this).remove();
				circAnimI++;
				circularAnimation();
			}
		});
}