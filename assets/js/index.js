
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
	.append('<p>Ihr Internetzugang wird nach <strong><span id="display-hours"></span> Stunden <span id="display-minutes"></span> Minuten</strong> vollständiger Nutzung im Monat gedrosselt.</p>')
	.append('<p>Die tatsächliche durchschnittliche Geschwindigkeit ihres Zugangs beträgt <strong>maximal <span id="display-speed"></span> Mbit/s</strong>.</p>')
	.append('<p>Sie können pro Monat <strong>maximal <span id="display-volume"></span> GB</strong> übertragen (Ungedrosselt: <span id="display-flatvolume"></span> GB).</p>')
	.append('<p>Ihr Internetzugang ist somit <a href="https://soundcloud.com/david1701/funktional-kaputt">funktional kaputt</a>.</p>')
	.append('<p><small>Hintergründe zur Drosselung finden Sie bei <a href="https://netzpolitik.org/tag/deutsche-telekom/">Netzpolitik.org</a>, mehr zum Thema Netzneutralität finden Sie bei der Kampagne <a href="http://echtesnetz.de/">Echtes Netz</a></small></p>')
	.append('<p><small>Wie sich das Internet mit 384 Kbit/s anfühlt <a href="https://vimeo.com/64641982">auf Vimeo ansehen</a>.</small></p>');

	/* preset dropdown */
	$('#drossl-presets a').click(function(evt){
		$('#bandwidth_mbits').val($(this).attr('data-preset'));
		drossel($(this).attr('data-preset'), function(data){
			display(data);
		});
	});
	
	$('#bandwidth_mbits').change(function(evt){
		drossel($(this).val(), function(data){
			display(data);
		});
	});
	
	$('#drossl-submit').click(function(){
		drossel($('#bandwidth_mbits').val(), function(data){
			display(data);
		});
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
		$('#display-flatvolume').text(data.flatvolume_total_gb.toFixed(0).replace('.',','));
		$('#drossl-info').hide();
		$('#drossl-display').show();
	}
}
