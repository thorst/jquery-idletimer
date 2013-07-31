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

	$.each( ["mousemove", "keydown", "DOMMouseScroll", "mousewheel", "mousedown", "touchstart", "touchmove"], function( i, event ) {
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

			$( "#qunit-fixture" ).idleTimer( 200 );
		});
	});

}(jQuery));
