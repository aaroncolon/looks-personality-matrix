import React from "react";
import { connect } from "react-redux";

class PersonSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  calcAverages(data) {
    let _data = [];
    for (let i = 0; i < data.length; i++) {
      let data1 = data[i].looks;
      let data2 = data[i].personality;
      _data.push([Number(data1), Number(data2)]);
    }

    return {
      looks       : acZones.roundHalf(acZones.averageLooks(_data)),
      personality : acZones.roundHalf(acZones.averagePersonality(_data)),
      zone        : acZones.averageZone(_data)
    };
  }

  validateData(data) {
    if (! data || ! data.length) {
      return false;
    }
    return true;
  }

  processData() {
    return {
      avgs : this.calcAverages(this.props.personData),
      name : this.props.personName
    };
  }

  doSummaryType(looks, personality) {
    return (
      <>
        <dl className="person-summary__list">
          <dt>Looks Average</dt>
          <dd className="person-summary__looks">{looks}</dd>
        </dl>
        <dl className="person-summary__list">
          <dt>Personality Average</dt>
          <dd className="person-summary__personality">{personality}</dd>
        </dl>
      </>
    );
  }

  render() {
    if (! this.validateData(this.props.personData)) { return null; }

    const data        = this.processData();
    const name        = data.name;
    const looks       = data.avgs.looks;
    const personality = data.avgs.personality;
    const zone        = data.avgs.zone;

    const summaryType = this.doSummaryType(looks, personality);

    return (
      <div className="person-summary">
        <h2 className="person-summary__name">{name}</h2>
        <div className="clearfix">
          {summaryType}
          <dl className="person-summary__list">
            <dt>Zone Average</dt>
            <dd className="person-summary__zone">{zone}</dd>
          </dl>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    personName: state.getPersonData.personName,
    personData: state.getPersonData.personData
  };
}

export default connect(mapStateToProps)(PersonSummary);
