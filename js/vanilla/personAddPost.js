import events from '../lib/events.js';
import Utilities from '../lib/Utilities.js';

const personAddPost = {

  init: function() {
    this.cacheDom();
    this.bindEvents();
    this.initDate();
    this.setPersonType();
  },

  cacheDom: function() {
    this.$form        = jQuery('#form-person');
    this.$personType  = this.$form.find('input[name="person-type"]'); // radio
    this.$date        = this.$form.find('#post-date');
    this.$name        = this.$form.find('#person-name');
    this.$nameSelect  = this.$form.find('#person-name-existing'); // select
    this.$looks       = this.$form.find('#person-looks');   // select
    this.$personality = this.$form.find('#person-personality'); // select
    // this.$zone       = this.$form.find('#person-zone');
    this.$notes       = this.$form.find('#person-notes'); // textarea
    this.$nonce       = this.$form.find('#nonce');
    this.$submit      = this.$form.find('#submit-post');
  },

  bindEvents: function() {
    if (this.$personType.length) {
      this.$personType.on('change', (e) => { this.setPersonType(e) });
    }
    // this.$form.on('submit', null, {_this: _this}, this.addPost);
    this.$form.on('submit', null, null, (e) => { this.addPost(e) });
    this.$name.on('keyup', (e) => { this.resetNameSelect(e) });
    this.$nameSelect.on('change', (e) => { this.setName(e) });
    // this.$looks.on('change', () => { this.setZone() });
    // this.$personality.on('change', () => { this.setZone() });
    events.on('newPerson', this.updateExistingPeople, this);
  },

  // set default date value
  initDate: function() {
    const date = new Date();
    const y    = date.getFullYear();
    const _m   = (date.getMonth() + 1).toString(); // 0 = Jan
    const m    = (_m.length == 1) ? '0' + _m : _m;
    const _d   = date.getDate().toString();
    const d    = (_d.length == 1) ? '0' + _d : _d;
    const dateVal = y + '-' + m + '-' + d;

    this.$date.val(dateVal);
  },

  setPersonType: function(e) {
    // If existing person, disable New Name prop, Enable Name Select
    if (typeof e !== 'undefined' && e.target.value === 'existing') {
      this.$name.prop('disabled', true);
      this.$nameSelect.prop('disabled', false);
      this.$name.parent().css('display', 'none');
      this.$nameSelect.parent().css('display', 'block');
    }
    else {
      this.$name.prop('disabled', false);
      this.$nameSelect.prop('disabled', true);
      this.$name.parent().css('display', 'block');
      this.$nameSelect.parent().css('display', 'none');
    }
  },

  addPost: async function(e) {
    e.preventDefault();

    try {
      const res = await Utilities.postData(_s_person.ajax_url, {
        'action'             : '_s_person_add_event',
        'post_date'          : this.$date.val(),
        'person_name'        : this.$name.val(),
        'person_looks'       : this.$looks.val(),
        'person_personality' : this.$personality.val(),
        'person_notes'       : this.$notes.val(),
        'nonce'              : this.$nonce.val()
      });

      if (res.new_person === true) {
        events.trigger('newPerson', res);
      }

      this.resetFields();

      events.trigger('addPerson', res);
    } catch(err) {
      console.log('addPost fail', err);
    }
  },

  updateExistingPeople: function(data) {
    if (this.$nameSelect.length) {
      const option = document.createElement('option');
      option.value = data.name.toLowerCase();
      option.text = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      this.$nameSelect.append(option);
    }
    else {
      // Add "Refresh Link" message
      const p  = document.createElement('p'),
            t1 = document.createTextNode('You added your first person. '),
            a  = document.createElement('a'),
            t2 = document.createTextNode('Refresh for person list.'),
            t3 = document.createTextNode(' Good hunting...');

      p.className += 'notification notification--visible';
      p.appendChild(t1);
      a.setAttribute('href', window.location.href);
      a.appendChild(t2);
      p.appendChild(a);
      p.appendChild(t3);

      // Prepend it to...
      this.$form.prepend(p);
    }
  },

  setZone: function() {
    const zone = acZones.findZone([this.$looks.val(), this.$personality.val()]);
    this.$zone.attr('placeholder', zone);
    this.$zone.text(zone);
  },

  resetDate: function() {
    this.initDate();
  },

  setName: function() {
    this.$name.val(this.$nameSelect.val());
  },

  resetName: function() {
    this.$name.val('');
  },

  resetNameSelect: function() {
    this.$nameSelect.val('');
  },

  resetLooks: function() {
    this.$looks.val('5');
  },

  resetPersonality: function() {
    this.$personality.val('4');
  },

  resetZone: function() {
    this.setZone();
  },

  resetNotes: function() {
    this.$notes.val('');
  },

  resetFields: function() {
    this.resetDate();
    this.resetName();
    this.resetNameSelect();
    this.resetLooks();
    this.resetPersonality();
    // this.resetZone();
    this.resetNotes();
  }

}; // personAddPost

personAddPost.init();
