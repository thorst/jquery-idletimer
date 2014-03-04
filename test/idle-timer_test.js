(function($) {
/*
		======== A Handy Little QUnit Reference ========
		http://docs.jquery.com/QUnit

		Test methods:
			expect(numAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			raises(block, [expected], [message])
*/

	module("jQuery#idle-timer");

	
	asyncTest( "default behavior", function() {
		expect( 1 );

		$( document ).on( "idle.idleTimer", function(){
			ok( true, "idleTimer fires at document by default" );
			$.idleTimer( "destroy" );
			start();
		});
		$.idleTimer( 100 );
	});

	//Function to help us determine which events to test
	//http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	/*var isEventSupported = (function(){
		var TAGNAMES = {
			"select":"input","change":"input",
			"submit":"form","reset":"form",
			"error":"img","load":"img","abort":"img"
		};
		function isEventSupported(eventName) {
			var el = document.createElement(TAGNAMES[eventName] || "div");
			eventName = "on" + eventName;
			var isSupported = (eventName in el);
			if (!isSupported) {
				el.setAttribute(eventName, "return;");
				isSupported = typeof el[eventName] === "function";
			}
			el = null;
			return isSupported;
		}
		return isEventSupported;
	})();
	*/
	
	/*
	mousewheel (deprecated) -> IE6.0, Chrome, Opera, Safari
	DOMMouseScroll (deprecated) -> Firefox 1.0
	wheel (standard) -> Chrome 31, Firefox 17, IE9, Firefox Mobile 17.0
	
	//No need to use, use DOMMouseScroll
	MozMousePixelScroll -> Firefox 3.5, Firefox Mobile 1.0
	
	//Events
	WheelEvent -> see wheel
	MouseWheelEvent -> see mousewheel
	MouseScrollEvent -> Firefox 3.5, Firefox Mobile 1.0
	*/
	/*$.each( ["keydown", "mousemove", "mousewheel", "DOMMouseScroll", "wheel", "mousedown", "touchstart", "touchmove"], function( i, event ) {
		if (isEventSupported(event)) {
		asyncTest( "Should clear timeout on " + event, function() {
			expect( 3 );

			var triggerEvent = function() {
				$( "#qunit-fixture" ).trigger( event );
				equal( $( "#qunit-fixture" ).data( "idleTimer" ), "active", "State should be active" );
			};

			// trigger event every now and then to prevent going inactive
			setTimeout( triggerEvent, 100 );
			setTimeout( triggerEvent, 200 );
			setTimeout( triggerEvent, 300 );

			setTimeout( function() {
				$.idleTimer( "destroy" );
				start();
			}, 350);

			$( "#qunit-fixture" ).idleTimer( 500 );
		});
		}
	});
	*/
	
	/*
	Why is shorthand failing?
	Need to actually test pause/resume/reset, not just thier return type
	*/
	test( "Pause is a jQuery instance", function() {
		expect( 1 );

		//equal(typeof $.idleTimer( "pause" ).jquery  , "string", "Elapsed time should be a number" );
		equal(typeof $(document).idleTimer( "pause" ).jquery  , "string", "Elapsed time should be a number" );
	});
	test( "Resume is a jQuery instance", function() {
		expect( 1 );

		//equal(typeof $.idleTimer( "resume" ).jquery  , "string", "Elapsed time should be a number" );
		equal(typeof $(document).idleTimer( "resume" ).jquery  , "string", "Elapsed time should be a number" );
	});
	test( "Reset is a jQuery instance", function() {
		expect( 1 );

		//equal(typeof $.idleTimer( "reset" ).jquery  , "string", "Elapsed time should be a number" );
		equal(typeof $(document).idleTimer( "reset" ).jquery  , "string", "Elapsed time should be a number" );
	});
	
	
	test( "Elapsed time is a number", function() {
		expect( 2 );

		equal( typeof $.idleTimer( "getElapsedTime" ), "number", "Elapsed time should be a number" );
		equal( typeof $(document).idleTimer( "getElapsedTime" ), "number", "Elapsed time should be a number" );
	});
	test( "Remaining time is a number", function() {
		expect( 2 );

		equal( typeof $.idleTimer( "getRemainingTime" ), "number", "Remaining time should be a number" );
		equal( typeof $(document).idleTimer( "getRemainingTime" ), "number", "Remaining time should be a number" );
	});
	test( "Last Active time is a number", function() {
		expect( 2 );

		equal( typeof $.idleTimer( "getLastActiveTime" ), "number", "Last Active time should be a number" );
		equal( typeof $(document).idleTimer( "getLastActiveTime" ), "number", "Elapsed time should be a number" );
	});

}(jQuery));
