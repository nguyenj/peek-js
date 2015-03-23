/*
 * peek
 * https://github.com/jnguyen/jquery-peek
 *
 * Copyright (c) 2015 John Nguyen
 * Licensed under the MIT license.
 */

;(function($, window, undefined) {

  // add peek plugin to the jQuery.fn object
  $.fn.peek = function(options) {
    if (typeof options === 'undefined') {
      options = {};
    }

    if (typeof options === 'object' || typeof options === 'number') {

      if (typeof options === 'number') {
        options = {animateTo: options};
      }

      return this.each(function() {
        if (undefined === $(this).data('peek')) {
          var plugin = new $.peek(this, options);
          $(this).data('peek', plugin);
        }
      });
    }


  };

  $.peek = function(el, options) {
    var defaults, plugin, $el, $inner, $planImage, $renderedImage, $images, $handle, methods;
    
    // defaults
    defaults = {
      'renderedImage': '.rendered',
      'planImage': '.wireframe',
      'animateTo': 0
    };

    // setting `plugin` to be `this` instance
    plugin = this;

    // settings provided the plugin's default and user's customization
    plugin.settings = {};

    // public methods
    plugin.nopeeking = function() {
      methods.unbuild();
      return this;
    };
    plugin.peeking = function() {
      methods.init();
      return this;
    };

    // private methods
    methods = {
      init: function() {
        // merge `plugin`'s instance settings
        plugin.settings = $.extend({}, defaults, options);

        // define selectors
        $el = $(el);
        $inner = $('<div />', {'class': 'peek__inner'});
        $planImage = $el.find(plugin.settings.planImage);
        $renderedImage = $el.find(plugin.settings.renderedImage);
        $images = $('<div />', {'class': 'peek__images'});
        $handle = $('<div />', {'class': 'peek__handle'});

        this.build();
        this.events();
      },
      build: function () {
        // Make sure container has class of `.peek`
        if (!$el.hasClass('peek')) {
          $el.addClass('peek');
        }

        // Add character to the handle
        $handle.append($('<div />', {'class': 'handle-line'}), $('<div />', {'class': 'handle-tab'}));

        // Wrap images into `.peek__images`
        $images.append($planImage, $renderedImage);

        // Wrap `.peek__images` and append `.peek__handle` into `.peek__inner`
        $inner.append($images, $handle);

        // Update plan and rendered classes
        $renderedImage = $renderedImage.removeClass(plugin.settings.renderedImage.slice(1)).addClass('peek__rendered peek__image');
        $planImage = $planImage.removeClass(plugin.settings.planImage.slice(1)).addClass('peek__wireframe peek__image');

        // Append `.peek__inner` into `.peek`
        $el.append($inner);
      },
      unbuild: function() {
        // built classes for the image wrappers
        var classes = "peek__wireframe peek__rendered peek__image";

        // remove the built classes and apply the original class names
        // remove the style attribute
        $planImage = $planImage.removeClass(classes).addClass(plugin.settings.planImage.slice(1));
        $renderedImage = $renderedImage.removeClass(classes).addClass(plugin.settings.renderedImage.slice(1)).removeAttr('style');

        // remove the `.peek__inner`
        $inner.remove();
        // append the original markup
        $el.append($planImage, $renderedImage);
      },
      events: function() {
        // Use jQuery UI draggable widget for the handle
        $handle.draggable({
          containment: $el,
          create: function() {
            $handle.animate({
              'top': plugin.settings.animateTo
            }, plugin.settings.animateSpeed);
            $renderedImage.animate({
              'height': methods.calculate_peeking_height(plugin.settings.animateTo)
            }, plugin.settings.animateSpeed);
          },
          drag: function(e, el) {
            $renderedImage.css('height', methods.calculate_peeking_height(el));
          }
        });
      },
      calculate_peeking_height: function(handle) {
        // Check if parameter is an object
        // ----------
        // Object must have a position attribute with top and left properties
        if (typeof handle === "object") {
          return handle.position.top - parseInt($el.children().css('padding-top'), 10) + ($handle.outerHeight(true) / 2);
        }

        // Check if parameter is a number
        if (typeof handle === "number") {
          return parseInt(handle) - parseInt($el.children().css('padding-top'), 10) + ($handle.outerHeight(true) / 2);
        }

        // If parameter is not an object or a number, return 0.
        return 0;
      }
    };

    // initialize the `peek` plugin
    methods.init();

  };

})(jQuery, this);