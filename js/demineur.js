/* ============== Code du démineur =============
** ============================================= */


var colonnes = 5, lignes = 5;
			var temps = 0;
			var timeFunc = updateTime();
			
			function updateTime(){
				temps++;
				console.log(temps);
				$('#time').text('Temps : ' + temps);
				timeFunc = setTimeout(function() {
					updateTime();
					},1000);
			}
			
			function changeDiff(){
				var diff = parseInt($('#difficulte').val());
				var r =  parseInt(((diff/4 + 75) * 255 / 100));
				var g = parseInt((((100 - diff)/4 + 75) * 255 / 100));
				$('#txt-diff').css({
						color:'rgb(' + r + ',' + g + ',120)',
						'font-weight':'bold'
						});
				if(diff <= 33){
					$('#txt-diff').text(' Easy ');
				}else if(diff == 100){
					$('#txt-diff').text('Impossibru');
				}else if(diff >= 66){
					$('#txt-diff').text(' Hard ');
				}else{
					$('#txt-diff').text("Norm");
				}
			}
			
			
			
			function setValueBorder(value, min, max){
				if(value > max)
					value = max;
				if (value < min)
					value = min;
				return value;
			}
			
			function createDem(){
				$('#form-dem').css('display','none');
				$('#center-dem').css('display','block');
				$('#game-bloc').html("");
				colonnes = $('#colonnes').val();
				colonnes = 	setValueBorder(colonnes,5,40);
				lignes = $('#lignes').val();
				var max = colonnes * lignes * 2 / 5;
				var min = colonnes * lignes / 10;
				var diff = parseInt($('#difficulte').val());
				var nbMines = diff/100 * (max - min) + min;
				
				for(var j = 0; j < lignes;j++){ //nombre de liges
					$('#game-bloc').append('<div class="ligne-dem" id="l' + j + '"></div>');
					for(var i = 0; i < colonnes;i++){ //nombre de colonnes
						$('#l' + j).append('<img class="tile" id="case_' + (parseInt(i) + parseInt(j) * colonnes) + '" src="" alt="" etat="hide" typecase="neutre" col="' + i + '" lig="' + j + '" onclick="flag(this)" ondblclick="turn(this)"/>');
					}
				}
				
				addMines(nbMines,colonnes, lignes);
				
				/*for(var i = 0; i < colonnes * lignes;i++){
					var ligne = "";
					ligne += count('#case_'+i) + '|';
					if(i%colonnes == 0){
						console.log(ligne);
						ligne = "";
					}
				}*/
				temps = 0;
				$('#time').text('Temps : ' + temps);
			}
			
			function flag(id){
				if($(id).attr('etat') == "hide"){
					$(id).attr('src', "../content/Demineur/flag.png");
					$(id).attr('etat', "flagged");
				}else if($(id).attr('etat') == "flagged"){
					$(id).attr('src', "");
					$(id).attr('etat', "hide");
				}
				$("#mines-rest").html('Mines restantes : ' + (countMines() - countFlag()));
				$("#cheat").html('Cheat : ' + countFlaggedMine());
				if(victory()){
					alert("Vous avec gagné en : " + temps + " secondes !");
				}
			}
			
			function turn(id){
				if($(id).attr('etat') == "flagged" || $(id).attr('etat') == "hide"){
					$(id).attr('etat', "displayed");
					$(id).attr('style', "background-color: rgb(230,230,230);");
					if($(id).attr('typecase') == "neutre"){
						var cels = count(id);
						switch (cels){
							case 1:	$(id).attr('src', "../content/Demineur/1.png");
								break;
							case 2:	$(id).attr('src', "../content/Demineur/2.png");
								break;
							case 3:	$(id).attr('src', "../content/Demineur/3.png");
								break;
							case 4:	$(id).attr('src', "../content/Demineur/4.png");
								break;
							case 5:	$(id).attr('src', "../content/Demineur/5.png");
								break;
							case 6: $(id).attr('src', "../content/Demineur/6.png");
								break;
							case 7: $(id).attr('src', "../content/Demineur/7.png");
								break;
							case 8: $(id).attr('src', "../content/Demineur/8.png");
								break;
							default: 
								$(id).attr('src', "");
								
								var x = parseInt($(id).attr('col')),
								y = parseInt($(id).attr('lig'));
								for(var i = - 1; i <= 1;i++){
									for(var j = -1; j <= 1;j++){
										if((x+i >= 0) && (x+i < colonnes) && (y+j >= 0) && (y+j < lignes)){
											turn($('#case_' + ((x + i) + ((y + j) * colonnes))));
										}
									}
								}
								break;
						}
					}else if($(id).attr('typecase') == "mine"){
						$(id).attr('src', "../content/Demineur/mine.png");
					}
					
				}
			}
			
			function addMines(nbMines, col, lig){
				var rand;
				while(countMines() < nbMines){
					rand = Math.floor(Math.random() * col * lig);
					if($('#case_' + rand).attr('typecase',"neutre")){
						$('#case_' + rand).attr('typecase','mine');
					}
				}
				$("#mines-rest").html('Mines restantes : ' + (countMines() - countFlag()));
				$("#mines-tot").html('Mines totales : ' + countMines());
			}
			
			function countMines(){
				var mines = 0;
				for(var i = 0; i < colonnes * lignes; i++){
					if($('#case_' + i).attr('typecase') == "mine"){
						mines++;
					}
				}
				return mines;
			}
			
			function countFlag(){
				var flag = 0;
				for(var i = 0; i < colonnes * lignes; i++){
					if($('#case_' + i).attr('etat') == 'flagged'){
						flag++;
					}
				}
				return flag;
			}
			
			function countFlaggedMine(){
				var fmine = 0;
				for(var i = 0; i < colonnes * lignes; i++){
					if($('#case_' + i).attr('etat') == 'flagged' && $('#case_' + i).attr('typecase') == "mine"){
						fmine++;
					}
				}
				return fmine;
			}
			function count(id){
				
				var cels = 0,
					x = parseInt($(id).attr('col')),
					y = parseInt($(id).attr('lig'));
				
				for(var i = - 1; i <= 1;i++){
					for(var j = -1; j <= 1;j++){
						if((x+i >= 0) && (x+i < colonnes) && (y+j >= 0) && (y+j < lignes)){
							if($('#case_' + ((x + i) + ((y + j) * colonnes)) ).attr('typecase') == "mine"){
								cels = cels + 1;
							}
						}
					}
				}
				return $(id).attr('typecase') == 'mine' ? -1 : cels;
			}
			
			function victory(){
				if(countFlaggedMine() == countMines() && countFlag() == countFlaggedMine()){
					timeFunc = clearTimeout();
					return true;
				}
				return false;
			}