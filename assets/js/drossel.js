/*
	drossel.js – calculate deutsche telekom bandwith throttling
	created by sebastian vollnhals
	
*/

var drossel = function(bandwidth_mbits, callback) {
	
	/* 
		to me it's unclear if decimal or binary prefixes are used. i spent
		one hour researching that topic on the telekom website, reading throuh
		loads of faqs, service descriptions and footnotes with no result whatsoever.
		i'm guessing binary prefixes. if you know better, let me know
	*/
	
	/*
		one limitation: this calculation does not care about upstream bandwith. 
	*/
	
	/* no callback, no fun */
	if (typeof callback !== "function") return;

	/* parse input */
	var data = {
		bandwidth_mbits: parseFloat(bandwidth_mbits.toString().replace(/,/,'.').replace(/[^0-9\.]/,''))
	}
	
	/* validate input */
	if (isNaN(data.bandwidth_mbits) || data.bandwidth_mbits === 0 || data.bandwidth_mbits > 200) {

		callback(false);

	} else {
		
		/* convert cable bandwith from mebibit/s to kibibit/s */
		data.bandwidth_kbits = (data.bandwidth_mbits*1024);

		/* determine included transfer volume by cable bandwith */
		if (data.bandwidth_kbits > 102400) { // 100 mebibit/s
			data.volume_inkl_kbit = 3355443200; // 400 gibibyte
		} else if (data.bandwidth_kbits > 51200) { // 50 mebibit/s
			data.volume_inkl_kbit = 2516582400; // 300 gibibyte
		} else if (data.bandwidth_kbits > 16384) { // 16 mebibit/s
			data.volume_inkl_kbit = 1677721600; // 200 gibibyte
		} else {
			data.volume_inkl_kbit = 629145600; // 75 gibibyte
		}
	
		/*
			1 Avergage Month = ((365*4+1)/(4*12)) = 30.4375 d = 730.5 h = 43830 m = 2629800 s
		*/
	
		/* how fast you will run out of included transfer volume in seconds */
		data.time_inkl_s = (data.volume_inkl_kbit/data.bandwidth_kbits);

		/* how fast you will run out of included transfer volume in hours minutes */
		data.time_inkl_m = Math.round(data.time_inkl_s/60);
		data.time_inkl_h = (data.time_inkl_m-(data.time_inkl_m%60))/60;
		data.time_inkl_m = (data.time_inkl_m%60);
		
		/* the time you have to use throttled bandwith in seconds */
		data.time_throttled_s = (2629800-data.time_inkl_s);
		
		/* the transfer volume you get through the throttled connection in kibibit */
		data.volume_throttled_kbit = (384*data.time_throttled_s);
		
		/* the maximum volume you can get through the connection in kibibit */
		data.volume_total_kbit = (data.volume_inkl_kbit+data.volume_throttled_kbit);
		
		/* the maximum volume you can get through the connection in mebibyte */
		data.volume_total_mb = ((data.volume_total_kbit/8)/1024);
		
		/* the maximum volume you can get through the connection in gibibyte */
		data.volume_total_gb = (data.volume_total_mb/1024);

		/* the maximum volume you can get through the connection in gibibyte */
		data.flatvolume_total_gb = (((data.bandwidth_kbits*2629800)/8)/(1024*1024));
		
		/* the maximum average bandwith in kibibit/s */
		data.bandwith_real_kbits = (data.volume_total_kbit/2629800);
		
		/* the maximum average bandwith in mebibit/s */
		data.bandwith_real_mbits = (data.bandwith_real_kbits/1024);
	
		callback(data);
	
	}
	
}
