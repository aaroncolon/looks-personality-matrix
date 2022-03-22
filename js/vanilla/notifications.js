import events from '../lib/events.js';
import Notification from './Notification.js';

const notifications = {
  options: {
    classes: {
      visible:  'notification--visible',
      removing: 'notification--removing'
    },
    delayFadeIn: 2000,
    delayFadeOut: 1000
  },
  timers: [],
  timerIndex: null,

  init: function() {
    this.cacheDom();
    this.bindEvents();
  },

  cacheDom: function() {
    this.$notificationWrap = jQuery('#notification-wrap');
  },

  bindEvents: function() {
    events.on('newPerson', this.handleNewPerson, this);
    events.on('addPerson', this.handleAddPerson, this);
    events.on('personDataEmpty', this.handlePersonDataEmpty, this);
  },

  handleNewPerson: function(data) {
    let copy = 'New person, '+ data.name +', added.';
    this.render(copy);
  },

  handleAddPerson: function(data) {
    let copy = '';
    if (data.new_person === true) {
      copy = data.name +' data added.';
    }
    else {
      copy = data.name +' data updated.';
    }

    this.render(copy);
  },

  handlePersonDataEmpty: function(data) {
    let copy = 'No data for specified timerange.'
    this.render(copy);
  },

  render: function(copy) {
    const $n = new Notification(copy).create();

    // append the element
    this.$notificationWrap.append($n);

    // @NOTE requestAnimationFrame to allow initial paint
    window.requestAnimationFrame(() => {
      $n.addClass(this.options.classes.visible);

      // Set the remove timer
      this.setRemoveTimer($n, this.removeNotification);
    });
  },

  setTimerIndex: function() {
    this.timerIndex = (this.timerIndex === null) ? 0 : this.timerIndex += 1;
    return this.timerIndex;
  },

  setRemoveTimer: function($el, callback) {
    const _index = this.setTimerIndex();

    this.timers[_index] = window.setTimeout(() => { setRemoveTimerCb(this) }, this.options.delayFadeIn);

    function setRemoveTimerCb(_this) {
      // fade the element
      $el
        .removeClass(_this.options.classes.visible)
        .addClass(_this.options.classes.removing);

      // remove the element
      if (typeof callback != 'undefined' && callback) {
        // call() with context of _this
        callback.call(_this, $el);
      }

      // remove the timer
      window.clearTimeout(_this.timers[_index]);
    }
  },

  removeNotification: function($el) {
    const _index = this.setTimerIndex();

    this.timers[_index] = window.setTimeout(() => { removeNotificationCb(this) }, this.options.delayFadeOut);

    function removeNotificationCb(_this) {
      // remove the element
      $el.remove();

      // remove the timer
      window.clearTimeout(_this.timers[_index]);
    }
  }

};

notifications.init();
