jQuery Idle Timer Plugin
========================


Demo
--------
http://thorst.github.io/jquery-idletimer/

Download
--------
* [Production 2.54kb](https://raw.github.com/thorst/jquery-idletimer/master/dist/idle-timer.min.js)
* [Development 10.3kb](https://raw.github.com/thorst/jquery-idletimer/master/dist/idle-timer.js)

Purpose
-------

Fires a custom event when the user is "idle". Idle is defined by not...

* moving the mouse
* scrolling the mouse wheel
* using the keyboard


Usage
-----

When called statically, the assumed element is `document`. `$.idleTimer()` is the same as `$( document ).idleTimer()`.
The following examples all use the `document` instantiated version of the API to highlight the fact that you can attach an idleTimer to any element.

```javascript
// simplest usage
$( document ).idleTimer();

// idleTimer() takes an optional argument that defines the idle timeout
// timeout is in milliseconds; defaults to 30000
$( document ).idleTimer( 10000 );

$( document ).on( "idle.idleTimer", function(event, elem, obj){
 // function you want to fire when the user goes idle
});

$( document ).on( "active.idleTimer", function(event, elem, obj){
 // function you want to fire when the user becomes active again
});

// pass the string "destroy" to stop the timer
$( document ).idleTimer("destroy");

// you can also query if it's "idle" or "active"
$( document ).data("idleTimer");

// save remaining time, and stops the timer
$( document ).idleTimer("pause");

// starts timer with remaining time
$( document ).idleTimer("resume");

//restore idle and enabled arguments, as well as restart the timer
$( document ).idleTimer("reset");

// get time left until idle, if idle return 0
$( document ).idleTimer("getRemainingTime");

// get time elapsed (in ms) since the user went idle/active
// if idle, how have you been idle, if active, how long have you been active
$( document ).idleTimer("getElapsedTime");

// get time last active event fired
$( document ).idleTimer("getLastActiveTime");


// bind to specific elements, allows for multiple timer instances
$( elem ).idleTimer( timeout|"destroy"|"pause"|"resume"|"reset"|"getRemainingTime"|"getElapsedTime");
$( elem ).data("idleTimer");


// You can optionally provide a second argument to override certain options, one
// of which is the events that are considered to constitute activity.
// Here are the defaults, so you can omit any or all of them.
$( elem ).idleTimer( timeout, {
  startImmediately: true, // starts a timeout as soon as the timer is set up; otherwise it waits for the first event.
  idle:    true,          // indicates if the user is idle
  enabled: true,          // indicates if the idle timer is enabled
  events:  'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove' // activity is one of these events
});
```

Intended Browser Support
-------
####Desktop
* >=IE8
* Firefox n-1
* Chrome n-1
* Safari n

####Mobile
* iOS n-1
* Android (version?)
* Windows Phone IEMobile/10.0


Author History
-------
* Nicholas C. Zakas (yui Version) [Blog](http://www.nczonline.net/blog/2009/06/02/detecting-if-the-user-is-idle-with-javascript-and-yui-3/) [Github](https://github.com/nzakas/jstools/)
* Paul Irish (jQuery Version) [Blog](http://paulirish.com/2009/jquery-idletimer-plugin/) [Github](https://github.com/paulirish/jquery-idletimer/)
* Mike Sherov (Fork of Paul's) [Github](https://github.com/mikesherov/jquery-idletimer)
* Todd Horst (Current Fork of Mike's) [Github](https://github.com/thorst/jquery-idletimer)


Gotchas
-------
* If you're using the old $.idleTimer api, you should not do `$( document ).idleTimer(...)`.
* Element bound timers will only watch for events inside of them. You may just want page-level activity, in which case you may set up your timers on `document`, `document.documentElement`, and `document.body`.
