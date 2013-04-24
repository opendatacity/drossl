
$(document).ready(function(){

	/* share */
	$('.share-pop').click(function(evt){
		evt.preventDefault();
		window.open($(this).attr('href'), "share", "width=500,height=300,status=no,scrollbars=no,resizable=no,menubar=no,toolbar=no");
		return false;
	});

	/* prepare display */
	$('#drossl-display')
	.hide()
	.append('<p>Bei voller Nutzung wird Ihr Internetzugang bereits nach <strong><span id="display-hours"></span>&nbsp;Stunden&nbsp;<span id="display-minutes"></span>&nbsp;Minuten</strong> im Monat gedrosselt.</p>')
	.append('<p>Die tatsächliche durchschnittliche Geschwindigkeit Ihres Zugangs beträgt somit <strong>nur <span id="display-speed"></span> Mbit/s</strong>.</p>')
	.append('<p>Sie können pro Monat <strong>maximal <span id="display-volume"></span> GB</strong> übertragen (Ungedrosselt wären es <span id="display-flatvolume"></span> GB)</p>')
	.append('<p>Die Drosselung schränkt Ihren Internetzugang in seiner wichtigsten Funktionalität (Datenübertragung) ein von 100% runter auf <span id="display-bandwidthpercent"></span>% und macht ihn damit <a href="https://soundcloud.com/david1701/funktional-kaputt">funktional kaputt</a>.</p>')
	.append('<p><small>Hintergründe zur Drosselung finden Sie bei <a href="https://netzpolitik.org/tag/deutsche-telekom/">Netzpolitik.org</a>, mehr zum Thema Netzneutralität finden Sie bei der Kampagne <a href="http://echtesnetz.de/">Echtes Netz</a></small></p>')
	.append('<p><small>Wie sich das Internet mit 384 Kbit/s anfühlt <a href="https://vimeo.com/64641982">auf Vimeo ansehen</a>.</small></p>');

	/* preset dropdown */
	$('#drossl-presets a').click(function(evt){
		$('#bandwidth_mbits').val($(this).attr('data-preset'));
		updateDisplay();
	});
	
	$('#bandwidth_mbits').change(function(evt){
		updateDisplay();
	});
	
	$('#bandwidth_mbits').keyup(function(){
		setTimeout(function(){updateDisplay();}, 1);
	});
	
	$('#drossl-embed-close').click(function(){
		$('#drossl-embed-container').hide();
	});

	$('#drossl-embed-show').click(function(){
		$('#drossl-embed-container').show();
	});
	
	/Mobile/.test(navigator.userAgent) && !location.hash && setTimeout(function(){
		if (!pageYOffset) window.scrollTo(0, 1);
	},1000);
	
	if (window != window.top) {
		$('body').addClass('in-frame');
	} else {
		$('body').addClass('not-in-frame');
	}
	
});

function updateDisplay() {
	drossel($('#bandwidth_mbits').val(), function(data){
		display(data);
	});
}

/* display */
function display(data) {
	if (data === false) {
		$('#drossl-display').hide();
		$('#drossl-info').show();
	} else {
		$('#display-speed').text(data.bandwith_real_mbits.toFixed(3).replace('.',','));
		$('#display-minutes').text(data.time_inkl_m);
		$('#display-hours').text(data.time_inkl_h);
		$('#display-volume').text(data.volume_total_gb.toFixed(0).replace('.',','));
		$('#display-bandwidthpercent').text(data.bandwidth_percent.toFixed(1).replace('.',','));
		$('#display-volumepercent').text(data.volume_percent.toFixed(1).replace('.',','));
		$('#display-flatvolume').text(data.flatvolume_total_gb.toFixed(0).replace('.',','));
		$('#drossl-info').hide();
		$('#drossl-display').show();
	}
}
