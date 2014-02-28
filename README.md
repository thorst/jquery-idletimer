jQuery Idle Timer Plugin
========================


Demo
--------
http://thorst.github.io/jquery-idletimer/

Download
--------
* https://raw.github.com/mikesherov/jquery-idletimer/master/dist/idle-timer.min.js
* https://raw.github.com/mikesherov/jquery-idletimer/master/dist/idle-timer.js

Purpose
-------

Paul Irish's original blog post: http://paulirish.com/2009/jquery-idletimer-plugin/

Fires a custom event when the user is "idle". Idle is defined by not...

* moving the mouse
* scrolling the mouse wheel
* using the keyboard

Basic idea is presented here: http://www.nczonline.net/blog/2009/06/02/detecting-if-the-user-is-idle-with-javascript-and-yui-3/

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

$( document ).on( "idle.idleTimer", function(){
 // function you want to fire when the user goes idle
});

$( document ).on( "active.idleTimer", function(){
 // function you want to fire when the user becomes active again
});

// pass the string "destroy" to stop the timer
$( document ).idleTimer("destroy");

// you can also query if it's "idle" or "active"
$( document ).data("idleTimer");

// get time elapsed (in ms) since the user went idle/active
$( document ).idleTimer("getElapsedTime");

// bind to specific elements, allows for multiple timer instances
$( elem ).idleTimer( timeout|"destroy"|"getElapsedTime");
$( elem ).data("idleTimer");

// You can optionally provide a second argument to override certain options, one
// of which is the events that are considered to constitute activity.
// Here are the defaults, so you can omit any or all of them.
$( elem ).idleTimer( timeout, {
  startImmediately: true, // starts a timeout as soon as the timer is set up; otherwise it waits for the first event.
  idle:    false,         // indicates if the user is idle
  enabled: true,          // indicates if the idle timer is enabled
  events:  'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove' // activity is one of these events
});
```

Gotchas
-------

* If you're using the old $.idleTimer api, you should not do `$( document ).idleTimer(...)`.
* Element bound timers will only watch for events inside of them. You may just want page-level activity, in which case you may set up your timers on `document`, `document.documentElement`, and `document.body`.
