exports.animateSvgPath = function(path, args) {
  /*
   * args = {
   *   infiniteLoop: true/false(default = false),
   *   loopCount: number of animation loop(default = 1),
   *   duration: seconds in integer(default = 2),
   *   transition: transition effect(default = linear),
   *   strokeColor: the color of the remainded stroke
   * }
   *
   * Author: Revaz Zakalashvili
   * Inspiration: https://jakearchibald.com/2013/animated-line-drawing-svg/
   *
   */
  var length = path.getTotalLength();
  var count = 0;

  const infiniteLoop = args.infiniteLoop ? args.infiniteLoop : false;
  const duration = args.duration ? args.duration : 2;
  const transition = args.transition ? args.transition : 'linear';
  const loopCount = args.loopCount ? args.loopCount : 1;
  const infinite = args.infinite ? args.infinite : false;
  const strokeColor = args.strokeColor ? args.strokeColor : 'rgba(0,0,0,0.3)';

  (function(){
    function recursiveAnimator(){
      length = path.getTotalLength();
      // Clear any previous transition
      path.style.transition = path.style.WebkitTransition =
        'none';
      // Set up the starting positions
      path.style.strokeDasharray = length + ' ' + length;
      path.style.strokeDashoffset = length;
      // Trigger a layout so styles are calculated & the browser
      // picks up the starting position before animating
      path.getBoundingClientRect();
      // Define our transition
      path.style.transition = path.style.WebkitTransition =
        'stroke-dashoffset '+ duration +'s '+transition;
       //Go!
      path.style.strokeDashoffset = -1*length;
      //console.log(this);
      if(!infiniteLoop) {
        count++;
        if (count == loopCount) {
          path.style.stroke = strokeColor;
          path.style.strokeDashoffset = 0;
          return 0;
        }
      }
      setTimeout(recursiveAnimator, duration*1000);
    }

    return recursiveAnimator();
  })();
}

module.exports;
