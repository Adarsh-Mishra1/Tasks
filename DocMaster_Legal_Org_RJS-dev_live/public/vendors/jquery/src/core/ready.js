define(["../core", "../var/document", "../core/init", "../deferred"], function (
  jQuery,
  document,
) {
  // The deferred used on DOM ready
  var readyList;

  jQuery.fn.ready = function (fn) {
    // Add the callback
    jQuery.ready.promise().done(fn);

    return this;
  };

  jQuery.extend({
    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,

    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,

    // Hold (or release) the ready event
    holdReady: function (hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },

    // Handle when the DOM is ready
    ready: function (wait) {
      // Abort if there are pending holds or we're already ready
      if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
        return;
      }

      // Remember that the DOM is ready
      jQuery.isReady = true;

      // If a normal DOM Ready event fired, decrement, and wait if need be
      if (wait !== true && --jQuery.readyWait > 0) {
        return;
      }

      // If there are functions bound, to execute
      readyList.resolveWith(document, [jQuery]);

      // Trigger any bound ready events
      if (jQuery.fn.triggerHandler) {
        jQuery(document).triggerHandler("ready");
        jQuery(document).off("ready");
      }
    },
  });

  /**
   * The ready event handler and self cleanup method
   */
  function completed() {
    document.removeEventListener("DOMContentLoaded", completed);
    window.removeEventListener("load", completed);
    jQuery.ready();
  }

  jQuery.ready.promise = function (obj) {
    if (!readyList) {
      readyList = jQuery.Deferred();

      // Catch cases where $(document).ready() is called
      // after the browser event has already occurred.
      // Support: IE9-10 only
      // Older IE sometimes signals "interactive" too soon
      if (
        document.readyState === "complete" ||
        (document.readyState !== "loading" &&
          !document.documentElement.doScroll)
      ) {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        window.setTimeout(jQuery.ready);
      } else {
        // Use the handy event callback
        document.addEventListener("DOMContentLoaded", completed);

        // A fallback to window.onload, that will always work
        window.addEventListener("load", completed);
      }
    }
    return readyList.promise(obj);
  };

  // Kick off the DOM ready check even if the user does not
  jQuery.ready.promise();
});
