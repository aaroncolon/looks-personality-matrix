import React from "react";
import { connect } from "react-redux";

// Components
import ChartPieG from "./ChartPieG";
import ChartLineG from './ChartLineG';

class PersonCharts extends React.Component {
  constructor(props) {
    super(props);

    this.dayCount     = 86400;
    this.dayInSeconds = 86400;
    this.personName   = "";
    this.zones        = ['No Go', 'Danger', 'Fun', 'Date', 'Spouse', 'Unicorn'];
  }

  render() {
    const data = this.processData(this.props.personData, this.props.personName);

    if (!data) {
      return null
    };

    return (
      <>
        <div className="section-chart">
          <h2 className="section-title">Zone Distribution</h2>
          <ChartPieG chartData={data.pieG} />
        </div>
        <div className="section-chart">
          <h2 className="section-title">Looks / Personality Over Time</h2>
          <ChartLineG chartData={data.lineG} />
        </div>
      </>
    );
  }

  // process data
  processData(personData, personName) {
    if (!personData || !personData.length) {
      return null;
    }

    this.resetDayCount();
    this.personName = personName;
    const _dataScatter  = [];
    const _dataPie      = [0,0,0,0,0,0];
    const _dataScatterG = [];
    const _dataLineG    = [];
    let _dataPieG       = [];

    _dataPieG = [
      ['No Go',   0],
      ['Danger',  0],
      ['Fun',     0],
      ['Date',    0],
      ['Spouse',  0],
      ['Unicorn', 0]
    ];

    for (let i = 0; i < personData.length; i++) {
      let looks, personality, zone;

      looks       = Number(personData[i].looks);
      personality = Number(personData[i].personality);

      const currDate   = personData[i].post_date_unix;
      const prevDate   = (typeof personData[i - 1] != 'undefined') ? personData[i - 1].post_date_unix : null;
      const spreadDate = this.maybeSpreadDates(currDate, prevDate);

      // Pie Google
      // find the zone
      zone = acZones.findZone([looks, personality]);

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

    return {
      'scatter'  : _dataScatter,
      'pie'      : _dataPie,
      'scatterG' : _dataScatterG,
      'pieG'     : _dataPieG,
      'lineG'    : _dataLineG
    }
  }

  /**
   * Add a day to current date if it equals previous date
   *
   * @param  {Number} currDate unix timestamp
   * @param  {Number} prevDate unix timestamp
   * @return {Object} unix timestamp of date
   */
  maybeSpreadDates(currDate, prevDate) {
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
  }

  resetDayCount() {
    this.dayCount = this.dayInSeconds;
  }
}

function mapStateToProps(state) {
  // return the data this component needs (selector)
  return {
    personData: state.getPersonData.personData,
    personName: state.getPersonData.personName
  };
};

export default connect(mapStateToProps)(PersonCharts);
