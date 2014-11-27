
var currentPopup = "";
jQuery(function($) {
	$("a.topopup").click(function() {
			var id = $(this).attr('id');
			loading(); // loading
			setTimeout(function(){ // then show popup, deley in .5 second
				loadPopup(id); // function show popup
			}, 500); // .5 second
	return false;
	});

	/* event for close the popup */
	$("div.close").hover(
					function() {
						$('span.ecs_tooltip').show();
					},
					function () {
    					$('span.ecs_tooltip').hide();
  					}
				);

	$("div.close").click(function() {
		disablePopup();  // function close pop up
	});

	$(this).keyup(function(event) {
		if (event.which == 27) { // 27 is 'Ecs' in the keyboard
			disablePopup();  // function close pop up
		}
	});

        $("div#backgroundPopup").click(function() {
		disablePopup();  // function close pop up
	});

	$('a.livebox').click(function() {
		var id = $(this).attr('id');
		$("a").attr('target','_blank');
		/*
		if (id == "Popup1"){
			//$(location).attr('href','http://www.sodeoka.com/');
			$(location).attr('href','http://www.sodeoka.com/');
			$("a").attr('target','_blank');
		}
		else if (id == "Popup2"){
			$(location).attr('href','http://sabrinaratte.com/') ;
		}
		else if (id == "Popup3"){
			$(location).attr('href','http://www.adamferriss.com/') ;
		}*/
	//return false;
	});

	 /************** start: functions. **************/
	function loading() {
		$("div.loader").show();
	}
	function closeloading() {
		$("div.loader").fadeOut('normal');
	}

	var popupStatus = 0; // set value

	function loadPopup(popupId) {
		if(popupStatus == 0) { // if value is 0, show popup
			closeloading(); // fadeout loading
			$("#to"+popupId).fadeIn(0500); // fadein popup div
			$("#background"+popupId).css("opacity", "0.7"); // css opacity, supports IE7, IE8
			$("#background"+popupId).fadeIn(0001);
			popupStatus = 1; // and set value to 1
			currentPopup = popupId;
		}
	}

	function disablePopup() {
		if(popupStatus == 1) { // if value is 1, close popup
			$("#to"+currentPopup).fadeOut("normal");
			$("#background"+currentPopup).fadeOut("normal");
			popupStatus = 0;  // and set value to 0
		}
	}
	/************** end: functions. **************/
}); // jQuery End
