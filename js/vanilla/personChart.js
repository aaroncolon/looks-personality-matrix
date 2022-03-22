import events from '../lib/events.js';

"use strict";

const personChart = {

  scatterChart     : null,
  scatterChartData : null,
  pieChart         : null,
  pieChartData     : null,
  personName       : "",
  zones            : ['No Go', 'Danger', 'Fun', 'Date', 'Spouse', 'Unicorn'],
  dayCount         : 86400,
  dayInSeconds     : 86400,

  init: function() {
    this.cacheDom();
    this.bindEvents();
  },

  cacheDom: function() {
    this.$chartScatter  = jQuery('#person-chart-scatter');
    this.$chartPie      = jQuery('#person-chart-pie');
    this.$chartScatterG = jQuery('#person-chart-scatter--google');
    this.$chartPieG     = jQuery('#person-chart-pie--google');
    this.$chartLineG    = jQuery('#person-chart-line--google');
  },

  bindEvents: function() {
    events.on('getPerson', this.updateChart, this);
  },

  initScatterChartG: function(_data) {
    const _this = this;

    google.charts.load('current', {'packages':['scatter']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const data = new google.visualization.DataTable();
      data.addColumn('number', 'Looks');
      data.addColumn('number', 'Personality');

      console.log('drawChart', _data);

      // Array of Arrays
      data.addRows(_data);

      const options = {
        width: 500,
        height: 500,
        legend: {
          position: 'none'
        },
        chart: {
          title: 'Looks / Personality Summary'
        },
        hAxis: {
          gridlines: {
            count: 9
          },
          // logScale: true,
          title: 'Looks',
          minValue: 0,
          maxValue: 10,
          ticks: [0,1,2,3,4,5,6,7,8,9,10],
          viewWindow: {
            min: 0,
            max: 10
          }
        },
        vAxis: {
          gridlines: {
            count: 9
          },
          // logScale: true,
          title: 'Personality',
          minValue: 0,
          maxValue: 10,
          ticks: [0,1,2,3,4,5,6,7,8,9,10],
          viewWindow: {
            min: 0,
            max: 10
          }
        }
      };

      const chart = new google.charts.Scatter(_this.$chartScatterG[0]);

      chart.draw(data, google.charts.Scatter.convertOptions(options));
    };
  },

  initPieChartG: function(_data) {
    const _this = this;

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      // unshift labels for data 'Zone', Hits'
      // [['Zone', 'Hits'],
      // ['No Go',  11],
      // ['Danger',  2],
      // ['Fun',     2],
      // ['Date',    2],
      // ['Spouse',  7],
      // ['Unicorn', 0]
      _data.unshift(['Zone', 'Hits']);

      const data = google.visualization.arrayToDataTable(_data);

      const options = {
        chartArea: {
          height: '80%',
          width: '80%'
        },
        legend: {
          alignment: 'center',
          position: 'top'
        }
      };

      const chart = new google.visualization.PieChart(_this.$chartPieG[0]);

      chart.draw(data, options);
    }
  },

  initLineChartG: function(_data) {
    const _this = this;

    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const data = new google.visualization.DataTable();
      data.addColumn('string', 'Date');
      data.addColumn('number', 'Looks');
      data.addColumn('number', 'Personality');

      data.addRows(_data);

      const options = {
        chart: {
          'title': 'Looks / Personality Over Time'
        },
        chartArea: {
          height: '70%',
          width: '70%'
        },
        curveType: 'function',
        vAxis: {
          'viewWindow': {
            'max': 10,
            'min': 0,
            'viewWindowMode': 'pretty'
          }
        }
      };

      const chart = new google.charts.Line(_this.$chartLineG[0]);

      chart.draw(data, google.charts.Line.convertOptions(options));
    }
  },

  initScatterChart: function(_data) {
    this.scatterChart = new Chart(this.$chartScatter, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Looks Personality Matrix',
          backgroundColor: 'rgba(0,0,0,1)',
          data: _data
        }] // datasets
      }, // data
      options: {
        title: {
          display: true,
          text: this.personName
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Looks'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Personality'
            }
          }]
        }
      }
    });
  },

  initPieChart: function(_data) {
    this.pieChart = new Chart(this.$chartPie, {
      type: 'pie',
      data: {
        datasets: [{
          data: _data // array of numbers representing Zone hits
        }],
        labels: ['No Go', 'Danger', 'Fun', 'Date', 'Spouse', 'Unicorn']
      },
      options: {

      }
    });
  },

  // processDataPie: function(data) {
  //   // iterate through data, track zone hits
  //   var _data = [0,0,0,0,0,0];
  //   if (data && data.person_data.length) {
  //     for (var i = 0; i < data.person_data.length; i++) {
  //       // find the zone
  //       var zone = acZones.findZone([data.person_data[i].looks, data.person_data[i].personality]);

  //       // how to track the zone?
  //       // search Zones array for Zone
  //       // ['No Go', 'Danger', 'Fun', 'Date', 'Spouse', 'Unicorn']
  //       var index = this.zones.indexOf(zone);

  //       if (index !== -1) {
  //         _data[index]++;
  //       }
  //     }
  //   }
  //   console.log('_data', _data);
  //   return _data;
  // },

  updateChart: function(data) {
    const _data = this.processData(data);

    console.log('updateChart _data', _data);

    // this.initScatterChart(_data.scatter);
    // this.initPieChart(_data.pie);
    // this.initScatterChartG(_data.scatterG);
    this.initPieChartG(_data.pieG);
    this.initLineChartG(_data.lineG);
  },

  processData: function(data) {
    console.log('data', data);

    this.resetDayCount();
    this.personName = data.person_name;
    const _dataScatter  = [];
    const _dataPie      = [0,0,0,0,0,0];
    const _dataScatterG = [];
    const _dataLineG    = [];
    const _dataPieG     = [
      ['No Go',   0],
      ['Danger',  0],
      ['Fun',     0],
      ['Date',    0],
      ['Spouse',  0],
      ['Unicorn', 0]
    ];

    if (data && data.person_data.length) {
      for (let i = 0; i < data.person_data.length; i++) {
        const looks       = Number(data.person_data[i].looks);
        const personality = Number(data.person_data[i].personality);
        const currDate    = data.person_data[i].post_date_unix;
        const prevDate    = (typeof data.person_data[i - 1] != 'undefined') ? data.person_data[i - 1].post_date_unix : null;
        const spreadDate  = this.maybeSpreadDates(currDate, prevDate);

        // Scatter
        // create array of objects [{looks: 1, personality: 2}, {looks: 2, personality: 3}]
        // _dataScatter.push({x: data.person_data[i].looks, y: data.person_data[i].personality});

        // Scatter Google
        // create array of arrays [{looks: 1, personality: 2}, {looks: 2, personality: 3}]
        // _dataScatterG.push([Number(data.person_data[i].looks), Number(data.person_data[i].personality)]);

        // Pie
        // find the zone
        const zone = acZones.findZone([looks, personality]);

        // search Zones array for Zone
        const index = this.zones.indexOf(zone);

        if (index !== -1) {
          _dataPie[index]++;
          _dataPieG[index][1]++;
        }

        // Line Google
        // create array of arrays [[spreadDateVal, looksVal, personalityVal]]
        _dataLineG.push([new Date(spreadDate.dateUnixMs).toDateString(), looks, personality]);
      }
      // console.log('_dataPie', _dataPie, '_dataPieG', _dataPieG, '_dataLineG', _dataLineG);
    }

    return {
      'scatter'  : _dataScatter,
      'pie'      : _dataPie,
      'scatterG' : _dataScatterG,
      'pieG'     : _dataPieG,
      'lineG'    : _dataLineG
    }
  },

  /**
   * Add a day to current date if it equals previous date
   *
   * @param  {Number} currDate unix timestamp
   * @param  {Number} prevDate unix timestamp
   * @return {Object} unix timestamp of date
   */
  maybeSpreadDates: function(currDate, prevDate) {
    let date = null;

    // check if curr and prev dates are equal
    if (prevDate && currDate === prevDate) {
      // add n days to date
      date = currDate + this.dayCount;
      // increment dayCount
      this.dayCount = this.dayCount + this.dayInSeconds;
    } else {
      date = currDate;
      this.dayCount = this.dayInSeconds;
    }

    return {
      'dateUnix'  : date,
      'dateUnixMs': date * 1000
    }
  },

  /**
   * A function to give entries with the same date a unique date
   *
   * @param {Array} the person data
   */
  spreadDates: function(data) {
    // let dupes = []; // the duplicate entries' keys
    let person_data_spread = []; // the data with spread dates
    let day = 86400; // the number of days to increment by

    // read the date value
    for (let i = 0; i < data.person_data.length - 1; i++) {
      let curr       = data.person_data[i].post_date_unix; // current value
      let prev       = (typeof data.person_data[i - 1] != 'undefined') ? data.person_data[i - 1].post_date_unix : null;
      // let next       = data.person_data[i + 1].post_date_unix; // next value
      // let last_index = (dupes.length >= 1) ? dupes.length - 1 : null; // last saved duplicate's index
      // let last_value = (last_index) ? data.person_data[dupes[last_index]].post_date_unix : null;

      // detect duplicate indexes. compare curr to prev since we're modifying
      // curr and adding to separate array
      if (prev && curr === prev) {
        // save first time (must compare curr to next)
        // if (! last_index || (last_index && last_value && curr !== last_value)) {
        //   // save to dupes
        //   dupes.push(i);
        // }

        // for each duplicate index, add 1 day
        // save data to person_data_spread
        person_data_spread.push(curr + day);

        // increment day
        day = day + 86400;
      }
      else {
        // save data to person_data_spread
        person_data_spread.push(curr);
        // reset day
        day = 86400;
      }
    } // for

    return person_data_spread;
  }, // spreadDates

  resetDayCount: function() {
    this.dayCount = this.dayInSeconds;
  }

}; // personChart

personChart.init();
