import React from "react";
import { connect } from "react-redux";

class PersonTable extends React.Component {
  constructor(props) {
    super(props);
  }

  dataPoints() {
    let arr = [];

    if (this.props.personData) {
      arr = this.props.personData.map((point, i) => {
        const key         = point.timestamp;
        const date        = point.post_date;
        const looks       = point.looks;
        const personality = point.personality;
        const zone        = acZones.findZone([looks, personality]);
        const notes       = (point.notes) ? point.notes : 'n/a';

        return (
          <tr key={key}>
            <td>{date}</td>
            <td>{looks}</td>
            <td>{personality}</td>
            <td>{zone}</td>
            <td>{notes}</td>
          </tr>
        );
      });
    }

    return arr;
  }

  doHeadings() {
    return (
      <tr>
        <th>Date</th>
        <th>Looks</th>
        <th>Personality</th>
        <th>Zone</th>
        <th>Notes</th>
      </tr>
    );
  }

  render() {
    const dataPoints = this.dataPoints();
    if (!dataPoints.length) {
      return null;
    }

    const headings = this.doHeadings();

    return (
      <div className="person-table-wrap">
        <h2 className="section-title">Person Details</h2>
        <table id="person-table">
          <thead>
            {headings}
          </thead>
          <tbody>
            {dataPoints}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // return only the piece of state we need for this component
  return {
    personData : state.getPersonData.personData
  };
}

export default connect(mapStateToProps)(PersonTable);
