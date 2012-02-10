jQuery Idle Timer Plugin

Detail: http://paulirish.com/2009/jquery-idletimer-plugin/

Fires a custom event when the user is idle. 

Idle is defined by not...
* moving the mouse
* scrolling the mouse wheel
* using the keyboard

Basic idea is presented here:
  http://www.nczonline.net/blog/2009/06/02/detecting-if-the-user-is-idle-with-javascript-and-yui-3/

  
To use:

// idleTimer() takes an optional argument that defines the idle timeout
// timeout is in milliseconds; defaults to 30000
$.idleTimer(10000);
        
        
$(document).bind("idle.idleTimer", function(){
 // function you want to fire when the user goes idle
});


$(document).bind("active.idleTimer", function(){
 // function you want to fire when the user becomes active again
});

// pass the string 'destroy' to stop the timer
$.idleTimer('destroy');



// you can also query if it's idle or not
$.data(document,'idleTimer');  // 'idle'  or 'active'


// get time elapsed since user when idle/active
$.idleTimer('getElapsedTime'); // time since state change in ms





// API available in >= v0.9


// bind to specific elements, allows for multiple timer instances
$(elem).idleTimer(timeout|'destroy'|'getElapsedTime');
$.data(elem,'idleTimer');  // 'idle'  or 'active'



// if you're using the old $.idleTimer api, you should not do $(document).idleTimer(...)

// element bound timers will only watch for events inside of them.
// you may just want page-level activity, in which case you may set up
//   your timers on document, document.documentElement, and document.body

// You can optionally provide a second argument to override certain options, one
// of which is the events that are considered to constitute activity.
// Here are the defaults, so you can omit any or all of them.
$(elem).idleTimer(timeout, {
  startImmediately: true, //starts a timeout as soon as the timer is set up; otherwise it waits for the first event.
  idle:    false,         //indicates if the user is idle
  enabled: true,          //indicates if the idle timer is enabled
  events:  'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove' // activity is one of these events
});
