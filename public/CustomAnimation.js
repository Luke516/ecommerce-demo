// window.bringIntoView_started = 0;
// window.bringIntoView_ends = 0;
// window.bringIntoView_y = 0;
// window.bringIntoView_tick = function() {
//   var distanceLeft, dt, duration, t, travel;
//   t = Date.now();
//   if (t < window.bringIntoView_ends) {
//     dt = t - window.bringIntoView_started;
//     duration = window.bringIntoView_ends - window.bringIntoView_started;
//     distanceLeft = window.bringIntoView_y - document.body.scrollTop;
//       travel = distanceLeft * (dt / duration);
//       document.body.scrollTop += travel;
//       window.requestAnimationFrame(window.bringIntoView_tick);
//   } else {
//     document.body.scrollTop = window.bringIntoView_y;
//   }
// };
// window.bringIntoView = function(e, duration) {
//   window.bringIntoView_started = Date.now();
//   window.bringIntoView_ends = window.bringIntoView_started + duration;
//   window.bringIntoView_y = Math.min(document.body.scrollTop + e.getBoundingClientRect().top, document.body.scrollHeight - window.innerHeight);
//   window.requestAnimationFrame(window.bringIntoView_tick);
// };