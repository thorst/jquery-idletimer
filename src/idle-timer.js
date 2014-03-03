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

(function ($) {

    $.idleTimer = function (firstParam, elem, opts) {

        elem = elem || document;

        // defaults that are to be stored as instance props on the elem
        opts = $.extend({
            startImmediately: true, //starts a timeout as soon as the timer is set up
            idle: false,             //indicates if the user is idle
            enabled: true,          //indicates if the idle timer is enabled
            timeout: 30000,         //the amount of time (ms) before the user is considered idle
            events: "mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove" // activity is one of these events
        }, opts);

        /*
        Internal Object Properties
            remaining: null,            //the remaining time left when paused
            olddate: null,              //the last time timer was active/idle
            lastActive: null,           //the last time timer was active
            tId: null,                  //the idle timer setTimeout
            idleBackup: opts.idle,      //backup of idle parameter since it gets modified
            enabledBackup: opts.enabled //backup of enabled parameter since it gets modified
        */


        var jqElem = $(elem),
            obj = jqElem.data("idleTimerObj") || {},

            /* (intentionally not documented)
             * Toggles the idle state and fires an appropriate event.
             * @return {void}
             */
            toggleIdleState = function (myelem) {

                // curse you, mozilla setTimeout lateness bug!
                if (typeof myelem === "number") {
                    myelem = undefined;
                }

                var obj = $.data(myelem || elem, "idleTimerObj");

                //toggle the state
                obj.idle = !obj.idle;
                //if (obj.idle) obj.lastActive = obj.olddate;

                // reset timeout
                var elapsed = (+new Date()) - obj.olddate;
                obj.olddate = +new Date();

                // handle Chrome always triggering idle after js alert or comfirm popup,
                // not happening in Version 33.0.1750.117 m desktop win7               
                if (obj.idle && (elapsed < obj.timeout)) {
                    obj.idle = false;
                    clearTimeout($.idleTimer.tId);
                    if (obj.enabled) {
                        $.idleTimer.tId = setTimeout(toggleIdleState, obj.timeout);
                    }
                    return;
                }

                // Chrome 33.0.1750.14 on ios7 7.0.4 ipad triggers mousemove after programmatically updating 
                // text area. ranges between 115 - 150 milliseconds after idle triggered. 
                // When using normally your timing would have to be really good to respond
                // in under 200 ms, and you would have to stop, as continues activity will bypass this
                if (!obj.idle && elapsed < 200) {
                    obj.idle = true;
                    return;
                }

                // create a custom event, but first, store the new state on the element
                // and then append that string to a namespace
                var event = $.Event($.data(elem, "idleTimer", obj.idle ? "idle" : "active") + ".idleTimer");
                $(elem).trigger(event);
            },
            /**
             * Handle event triggers
             * @return {void}
             * @method event
             * @static
             */
            event = function (jqElem) {

                var obj = jqElem.data("idleTimerObj") || {};

                //store last active
                obj.lastActive = +new Date();

                //clear any existing timeout
                clearTimeout(obj.tId);

                //if the idle timer is enabled
                if (obj.enabled) {
                    if (obj.idle) {
                        toggleIdleState(elem);
                    }
                    
                    //set a new timeout
                    obj.tId = setTimeout(function () { toggleIdleState(elem); }, obj.timeout);
                }
            },
            /**
             * Restore initial settings and restart timer
             * @return {void}
             * @method reset
             * @static
             */
            reset = function (jqElem) {

                var obj = jqElem.data("idleTimerObj") || {};

                //Reset settings
                obj.idle = obj.idleBackup;
                obj.enabled = obj.enabledBackup;

                obj.olddate =  +new Date();

                //Reset Timers
                clearTimeout(obj.tId);
                obj.tId = setTimeout(function () { $(elem).data("idleTimerObj").idle = false; toggleIdleState(elem); }, obj.timeout);

            },
            /**
             * Store remaining time, stop timer
             * @return {void}
             * @method pause
             * @static
             */
            pause = function (jqElem) {

                var obj = jqElem.data("idleTimerObj") || {};
                if (obj.remaining!=null) return;

                obj.remaining = obj.timeout - ((+new Date()) - obj.olddate);
                if (obj.idle || obj.remaining <= 0) {
                    obj.remaining = null;
                    return
                }

                //clear any existing timeout
                clearTimeout(obj.tId);

            },
            /**
             * Start timer with remaining value
             * @return {void}
             * @method resume
             * @static
             */
            resume = function (jqElem) {

                var obj = jqElem.data("idleTimerObj") || {};
                if (obj.remaining==null) return;

                //start timer
                obj.tId = setTimeout(toggleIdleState, obj.remaining);

                obj.remaining = null;
            },
            /**
             * Stops the idle timer. This removes appropriate event handlers
             * and cancels any pending timeouts.
             * @return {void}
             * @method stop
             * @static
             */
            stop = function (jqElem) {

                var obj = jqElem.data("idleTimerObj") || {};

                //set to disabled
                obj.enabled = false;

                //clear any pending timeouts
                clearTimeout(obj.tId);

                //detach the event handlers
                jqElem.off(".idleTimer");
            };

        obj.olddate = obj.olddate || +new Date();
        obj.lastActive = obj.olddate;

        if (typeof firstParam === "number") {
            opts.timeout = firstParam;
        } else if (firstParam === "destroy") {
            stop(jqElem);
            return;
        } else if (firstParam === "pause") {
            pause(jqElem);
            return;
        } else if (firstParam === "resume") {
            resume(jqElem);
            return;
        } else if (firstParam === "reset") {
            reset(jqElem);
            return;
        } else if (firstParam === "getRemainingTime") {
            //If idle there is no time remaining
            if (obj.idle) return 0;

            //Determing remaining, if negative idle didnt finish flipping, just return 0
            var remaining =obj.timeout - ((+new Date()) - obj.olddate);
            if (remaining < 0) remaining = 0;

            //If this is paused return that number, else return current remaining
            return obj.remaining || remaining;
        } else if (firstParam === "getElapsedTime") {
            return (+new Date()) - obj.olddate;
        }


        /* (intentionally not documented)
         * Handles a user event indicating that the user isn't idle.
         * @param {Event} event A DOM2-normalized event object.
         * @return {void}
         */
        jqElem.on($.trim((opts.events + " ").split(" ").join(".idleTimer ")), function (e) {
            //console.log(e.type);//get the event that was triggered
            event($(this));
        });

        //Assign options to obj to be stored
        obj.idle = opts.idle;
        obj.idleBackup = opts.idle;
        obj.enabled = opts.enabled;
        obj.enabledBackup = opts.enabled;
        obj.timeout = opts.timeout;

        //set a timeout to toggle state. May wish to omit this in some situations
        if (opts.startImmediately) {
            obj.tId = setTimeout(function () { $(elem).data("idleTimerObj").idle = false; toggleIdleState(elem); }, obj.timeout);
        }

        // assume the user is active for the first x seconds.
        jqElem.data("idleTimer", obj.idle ? "idle" : "active");

        // store our instance on the object
        jqElem.data("idleTimerObj", obj);
    };

    $.fn.idleTimer = function (firstParam, opts) {
        // Allow omission of opts for backward compatibility
        if (!opts) {
            opts = {};
        }

        if (this[0]) {
            var result =$.idleTimer(firstParam, this[0], opts);
            if (typeof result==="number") 
                return result;
            else
                return this;
        }

        return this;
    };

})(jQuery);
