/* =====================================
** ======= Le script du player =========
** =====================================*/



function play(idPlayer, control) {
    var player = document.querySelector('#' + idPlayer);
	
    if (player.paused) {
        player.play();
        control.textContent = 'Pause';
    } else {
        player.pause();	
        control.textContent = 'Play';
    }
}

function resume(idPlayer) {
    var player = document.querySelector('#' + idPlayer);
	
    player.currentTime = 0;
    player.pause();
}

function volume(idPlayer, vol) {
    var player = document.querySelector('#' + idPlayer);
    
    player.volume = vol;    
}

function update(player) {
    var duration = player.duration;    // Durée totale
    var time     = player.currentTime; // Temps écoulé
    var fraction = time / duration;
    var percent  = Math.ceil(fraction * 100);

    var progress = document.querySelector('#progressBar');
	
    progress.style.width = percent + '%';
    progress.textContent = percent + '%';
}