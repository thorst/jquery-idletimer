/*
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

( function( $ ) {

$.idleTimer = function( firstParam, elem, opts ) {

	// defaults that are to be stored as instance props on the elem
	opts = $.extend( {
		startImmediately: true,   //starts a timeout as soon as the timer is set up
		idle: false,              //indicates if the user is idle
		enabled: true,            //indicates if the idle timer is enabled
		timeout: 30000,           //the amount of time (ms) before the user is considered idle
		events: "mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove" // activity is one of these events
	}, opts );


	elem = elem || document;

	var jqElem = $( elem ),
		obj = jqElem.data("idleTimerObj") || {},

		/* (intentionally not documented)
		 * Toggles the idle state and fires an appropriate event.
		 * @return {void}
		 */
		toggleIdleState = function( myelem ) {

			// curse you, mozilla setTimeout lateness bug!
			if ( typeof myelem === "number" ) {
				myelem = undefined;
			}

			var obj = $.data( myelem || elem, "idleTimerObj" );

			//toggle the state
			obj.idle = !obj.idle;

			// reset timeout
			var elapsed = ( +new Date() ) - obj.olddate;
			obj.olddate = +new Date();

			// handle Chrome always triggering idle after js alert or comfirm popup
			if ( obj.idle && ( elapsed < opts.timeout ) ) {
				obj.idle = false;
				clearTimeout( $.idleTimer.tId );
				if ( opts.enabled ) {
					$.idleTimer.tId = setTimeout( toggleIdleState, opts.timeout );
				}
				return;
			}

			// create a custom event, but first, store the new state on the element
			// and then append that string to a namespace
			var event = $.Event( $.data( elem, "idleTimer", obj.idle ? "idle" : "active" ) + ".idleTimer" );
			$( elem ).trigger( event );
		},

		/**
		 * Stops the idle timer. This removes appropriate event handlers
		 * and cancels any pending timeouts.
		 * @return {void}
		 * @method stop
		 * @static
		 */
		stop = function( jqElem ) {

			var obj = jqElem.data("idleTimerObj") || {};

			//set to disabled
			obj.enabled = false;

			//clear any pending timeouts
			clearTimeout( obj.tId );

			//detach the event handlers
			jqElem.off(".idleTimer");
		};

	obj.olddate = obj.olddate || +new Date();

	if ( typeof firstParam === "number" ) {
		opts.timeout = firstParam;
	} else if ( firstParam === "destroy" ) {
		stop( jqElem );
		return this;
	} else if ( firstParam === "getElapsedTime" ) {
		return ( +new Date() ) - obj.olddate;
	}


	/* (intentionally not documented)
	 * Handles a user event indicating that the user isn't idle.
	 * @param {Event} event A DOM2-normalized event object.
	 * @return {void}
	 */
	jqElem.on( $.trim( ( opts.events + " " ).split(" ").join(".idleTimer ") ), function() {
		var obj = $.data( this, "idleTimerObj" );

		//clear any existing timeout
		clearTimeout( obj.tId );

		//if the idle timer is enabled
		if ( obj.enabled ){
			//if it's idle, that means the user is no longer idle
			if ( obj.idle ){
				toggleIdleState( this );
			}

			//set a new timeout
			obj.tId = setTimeout( toggleIdleState, obj.timeout );
		}
	});

	obj.idle = opts.idle;
	obj.enabled = opts.enabled;
	obj.timeout = opts.timeout;

	//set a timeout to toggle state. May wish to omit this in some situations
	if ( opts.startImmediately ) {
		obj.tId = setTimeout( toggleIdleState, obj.timeout );
	}

	// assume the user is active for the first x seconds.
	jqElem.data( "idleTimer", "active" );

	// store our instance on the object
	jqElem.data( "idleTimerObj", obj );
};

$.fn.idleTimer = function( firstParam, opts ) {
	// Allow omission of opts for backward compatibility
	if ( !opts ) {
		opts = {};
	}

	if ( this[0] ){
		return $.idleTimer( firstParam, this[0], opts );
	}

	return this;
};

})( jQuery );
