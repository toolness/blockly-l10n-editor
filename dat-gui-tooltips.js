// http://stackoverflow.com/a/29563786/2422398
(function() {
  /* dat.GUI copies the prototype of superclass Controller to all other controllers, so it is not enough to add it only to 
  the super class as the reference is not maintained */
  var eachController = function(fnc) {
    for (var controllerName in dat.controllers) {
      if (dat.controllers.hasOwnProperty(controllerName)) {
        fnc(dat.controllers[controllerName]);
      }
    }
  }

  var setTitle = function(v) {
    // __li is the root dom element of each controller
    if (v) {
      this.__li.setAttribute('title', v);
    } else {
      this.__li.removeAttribute('title')
    }
    return this;
  };

  eachController(function(controller) {
    if (!controller.prototype.hasOwnProperty('title')) {
      controller.prototype.tooltip = setTitle;
    }
  });
})();
