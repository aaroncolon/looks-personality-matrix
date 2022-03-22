import events from '../lib/events.js';
import Utilities from '../lib/Utilities.js';

"use strict";

const personTable = {
  personName: null,

  average: {
    looks   : null,
    personality : null,
    zone  : null
  },

  classNames: {
    looks   : 'looks--',
    personality : 'personality--',
    zone  : 'zone--'
  },

  init: function() {
    this.cacheDom();
    this.bindEvents();
  },

  cacheDom: function() {
    this.$personSummaryWrap = jQuery('.section-person-summary');

    this.$formSummary          = this.$personSummaryWrap.find('#form-summary');
    this.$personOptions        = this.$formSummary.find('#person-options');
    this.$timeframe            = this.$formSummary.find('#timeframe');
    this.$nonce                = this.$formSummary.find('#nonce');
    this.$submit               = this.$formSummary.find('#submit');

    this.$personSummary        = this.$personSummaryWrap.find('.person-summary');
    this.$personName           = this.$personSummary.find('.person-summary__name');
    this.$personLooksAvg       = this.$personSummary.find('.person-summary__looks');
    this.$personPersonalityAvg = this.$personSummary.find('.person-summary__personality');
    this.$personZoneAvg        = this.$personSummary.find('.person-summary__zone');
    this.$personTable          = this.$personSummaryWrap.find('#person-table tbody');
  },

  bindEvents: function() {
    // this.$formSummary.on('submit', this.getPerson.bind(this));
    this.$formSummary.on('submit', (e) => { this.getPersonAwait3(e) });
    events.on('getPerson', this.processData, this);
    // events.on('getPerson', this.render, this);
  },

  getPerson: function(e, data, timeframe, page) {
    e.preventDefault();

    let _data = data || [];
    let _page = page || 1;
    let _timeframe = timeframe || this.calcTimeframe();

    jQuery.ajax({
      type:     'POST',
      dataType: 'json',
      url:      _s_person.ajax_url,
      context:  this,
      data:     {
        'action'      : '_s_person_get_event',
        'person_name' : this.$personOptions.val(),
        'timeframe'   : _timeframe,
        'paged'       : _page,
        'nonce'       : this.$nonce.val()
      },
    })
    .done((res, textStatus, jqXHR) => {
      if (res.paged < res.max_num_pages) {
        // save data
        _data = _data.concat(res.person_data);

        // increment
        _page++;

        // recurse
        this.getPerson(e, _data, _timeframe, _page);
      } else {
        // save data
        _data = _data.concat(res.person_data);

        // add concatenated data to ajax result
        res.person_data = _data;

        // trigger getPerson event passing data to listeners
        events.trigger('getPerson', res);
      }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.log('getPerson error: ', arguments);
    });
  },

  getPersonPromises: function(e, data = [], timeframe, page = 1) {
    e.preventDefault();

    let _this = this;
    let _data = data;
    let _page = page;
    let _timeframe = timeframe || this.calcTimeframe();

    // request
    const response = Utilities.postData(_s_person.ajax_url, {
      'action'      : '_s_person_get_event',
      'person_name' : _this.$personOptions.val(),
      'timeframe'   : _timeframe,
      'paged'       : _page,
      'nonce'       : _this.$nonce.val()
    });
    const json = response.then((res) => {
      if (res.paged < res.max_num_pages) {
        // save data
        _data = _data.concat(res.person_data);
        // increment
        _page++;
        // recurse
        _this.getPersonPromises(e, _data, _timeframe, _page);
      } else {
        // save data
        _data = _data.concat(res.person_data);
        // add concatenated data to ajax result
        res.person_data = _data;
        // trigger getPerson event passing data to listeners
        events.trigger('getPerson', res);
      }
    }).catch((err) => {
      console.log(err);
    });
  },

  getPersonAwait: function(e, data = [], timeframe, page = 1) {
    e.preventDefault();

    let _data = data;
    let _page = page;
    let _timeframe = timeframe || this.calcTimeframe();

    (async () => {
      try {
        console.log('this', this);
        // request
        const res = await Utilities.postData(_s_person.ajax_url, {
          'action'      : '_s_person_get_event',
          'person_name' : this.$personOptions.val(),
          'timeframe'   : _timeframe,
          'paged'       : _page,
          'nonce'       : this.$nonce.val()
        });

        // @NOTE might have to use microqueue for if/else
        if (res.paged < res.max_num_pages) {
          // save data
          _data = _data.concat(res.person_data);
          // increment
          _page++;
          // recurse
          this.getPersonAwait(e, _data, _timeframe, _page);
        } else {
          // save data
          _data = _data.concat(res.person_data);
          // add concatenated data to ajax result
          res.person_data = _data;
          // trigger getPerson event passing data to listeners
          events.trigger('getPerson', res);
        }
      } catch(err) {
        console.log(err);
      }
    })();
  },

  getPersonAwait2: function(e) {
    e.preventDefault();

    let _this = this;
    let _data = [];
    let _page = 1;
    let _timeframe = this.calcTimeframe();

    async function req() {
      try {
        const res = await Utilities.postData(_s_person.ajax_url, {
          'action'      : '_s_person_get_event',
          'person_name' : _this.$personOptions.val(),
          'timeframe'   : _timeframe,
          'paged'       : _page,
          'nonce'       : _this.$nonce.val()
        });

        if (res.paged < res.max_num_pages) {
          // save data
          _data = _data.concat(res.person_data);
          // increment
          _page++;
          // recurse
          req();
        } else {
          // save data
          _data = _data.concat(res.person_data);
          // add concatenated data to ajax result
          res.person_data = _data;
          // trigger getPerson event passing data to listeners
          events.trigger('getPerson', res);
        }
      } catch(err) {
        console.log(err);
      }
    }
    req();
  },

  getPersonAwait3: async function(e, data = [], timeframe, page = 1) {
    e.preventDefault();

    let _data = data;
    let _page = page;
    let _timeframe = timeframe || this.calcTimeframe();

    try {
      const res = await Utilities.postData(_s_person.ajax_url, {
        'action'      : '_s_person_get_event',
        'person_name' : this.$personOptions.val(),
        'timeframe'   : _timeframe,
        'paged'       : _page,
        'nonce'       : this.$nonce.val()
      });

      if (res.paged < res.max_num_pages) {
        // save data
        _data = _data.concat(res.person_data);
        // increment
        _page++;
        // recurse / do another request
        this.getPersonAwait3(e, _data, _timeframe, _page);
      } else {
        // save data
        _data = _data.concat(res.person_data);
        // add concatenated data to ajax result
        res.person_data = _data;
        // trigger getPerson event passing data to listeners
        events.trigger('getPerson', res);
      }
    } catch(err) {
      console.log(err);
    }
  },

  calcTimeframe: function() {
    if (jQuery.isNumeric(this.$timeframe.val()) === false) {
      return null;
    }

    const timeframe = Number(this.$timeframe.val());
    const d = new Date();
    const m = d.getMonth();
    d.setMonth(d.getMonth() - timeframe);

    // if still in same month, set to last day of previous month
    if (d.getMonth() === m) {
      // if 0 is provided for dayValue, the date will be set to the last day of the previous month.
      d.setDate(0);
    }
    d.setHours(0,0,0,0);

    return (parseInt(d / 1000));
  },

  validateData: function(data) {
    if (! data.person_data.length) {
      return false;
    }
    return true;
  },

  processData: function(data) {
    // validate data
    if (! this.validateData(data)) {
      // set name
      this.personName = data.person_name;

      // reset averages
      this.resetAverages();

      // trigger event
      events.trigger('personDataEmpty', data);
    }
    else {
      const _data = [];

      // save and calculate data for averages
      for (let i = 0; i < data.person_data.length; i++) {
        _data.push([Number(data.person_data[i].looks), Number(data.person_data[i].personality)]);
      }

      this.personName    = data.person_name;
      this.average.looks   = acZones.roundHalf(acZones.averageLooks(_data));
      this.average.personality = acZones.roundHalf(acZones.averagePersonality(_data));
      this.average.zone  = acZones.averageZone(_data);

      console.log('average: ', this.average);
    }

    // Render the results
    this.render(data);
  },

  render: function(data) {
    // if data is invalid, reset person summary and person table
    if (! this.validateData(data)) {
      // reset person summary
      this.resetPersonSummary();

      // reset person table
      this.resetPersonTable();

      return;
    }

    // Person Summary
    this.renderPersonSummary(this.$personName, this.personName, this.classNames.zone, this.average.zone);
    this.renderPersonSummary(this.$personLooksAvg, this.average.looks, this.classNames.looks, this.average.looks);
    this.renderPersonSummary(this.$personPersonalityAvg, this.average.personality, this.classNames.personality, this.average.personality);
    this.renderPersonSummary(this.$personZoneAvg, this.average.zone, this.classNames.zone, this.average.zone);

    // Person Table
    // empty child nodes
    this.resetPersonTable();

    // Create Tabular Data
    for (let i = 0; i < data.person_data.length; i++) {
      // prepend the data to the table
      let tr          = document.createElement('tr'),
          td1         = document.createElement('td'),
          td2         = document.createElement('td'),
          td3         = document.createElement('td'),
          td4         = document.createElement('td'),
          td5         = document.createElement('td'),
          date        = document.createTextNode(data.person_data[i].post_date),
          looks       = document.createTextNode(data.person_data[i].looks),
          personality = document.createTextNode(data.person_data[i].personality),
          _zone       = acZones.findZone([data.person_data[i].looks, data.person_data[i].personality]),
          zone        = document.createTextNode(_zone),
          notes       = document.createTextNode((data.person_data[i].notes) ? data.person_data[i].notes : 'n/a');

      td1.appendChild(date);
      td2.appendChild(looks);
      td3.appendChild(personality);
      td4.appendChild(zone);
      td5.appendChild(notes);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);

      this.$personTable.prepend(tr);
    }
  }, // render

  renderPersonSummary: function($el, text, classPrefix, className2) {
    $el
      .text(text)
      .removeClass(this.removeClass)
      .addClass(classPrefix + className2.toLowerCase());
  },

  resetPersonSummary: function() {
    this.$personName.text('').removeClass(this.removeClass);
    this.$personLooksAvg.text('').removeClass(this.removeClass);
    this.$personPersonalityAvg.text('').removeClass(this.removeClass);
    this.$personZoneAvg.text('').removeClass(this.removeClass);
  },

  resetAverages: function() {
    this.average.looks = null;
    this.average.personality = null;
    this.average.zone = null;
  },

  resetPersonTable: function() {
    this.$personTable.empty();
  },

  removeClass: function(i, className) {
    if (className.indexOf('zone--') == -1
       && className.indexOf('looks--') == -1
       && className.indexOf('personality--') == -1) {
      return;
    }
    else {
      const classes = className.split(' ');
      for (let i = 0; i < classes.length; i++) {
        if (classes[i].indexOf('zone--') != -1
           || classes[i].indexOf('looks--') != -1
           || classes[i].indexOf('personality--') != -1) {
          return classes[i];
        }
      }
      return;
    }
  }

}; // personTable

personTable.init();
