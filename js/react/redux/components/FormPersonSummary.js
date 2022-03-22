import React from "react";
import { connect } from "react-redux";
import { getPost } from '../actions/addPersonActions';

class FormPersonSummary extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    // get form data
    const formData  = new FormData(e.target);
    const name = formData.get('person-options');
    // const page = 1;
    const timeframe = this.calcTimeframe(formData.get('timeframe'));
    const nonce = _s_page_data.nonce_get_post;

    // dispatch redux action
    this.props.getPost({
      'action'      : '_s_person_get_event', // WP action name
      'person_name' : name,
      'timeframe'   : timeframe,
      // 'paged'       : page,
      'nonce'       : nonce
    });
  }

  render() {
    const names = this.formatPeopleNames();

    if (!names) {
      return null;
    }

    const months = this.doTimeframeOptions();

    return (
      <form id="form-summary" onSubmit={this.handleSubmit} method="POST">
        <div className="form-group">
          <label htmlFor="person-options">Select Person</label>
          <select className="form-control" id="person-options" name="person-options" required>
            <option value="">Select Person...</option>
            {names}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="timeframe">Timeframe</label>
          <select className="form-control" id="timeframe" name="timeframe" defaultValue="12" required>
            {months}
          </select>
        </div>

        <div className="form-group">
          <input id="nonce-get-person" type="hidden" value={_s_page_data.nonce_get_people} />
          <input id="submit-get-person" type="submit" value="Search" />
        </div>
      </form>
    );
  }

  formatPeopleNames() {
    let names = _s_page_data.user_people_names;

    return (names) ? names.map((name, i) => {
      return <option key={name + '-' + i} value={name.toLowerCase()}>{name}</option>
    }) : null;
  }

  doTimeframeOptions() {
    let opts = [];
    for (let j = 1; j <= 24; j++) {
      let months = (j === 1) ? 'Month' : 'Months';
      opts.push((<option key={'month-'+ j} value={j}>{j + ' ' + months}</option>));
    }
    return opts;
  }

  calcTimeframe(timeframe) {
    // form validation
    if (jQuery.isNumeric(timeframe) === false) {
      return null;
    }

    const _timeframe = Number(timeframe);
    const d = new Date();
    const m = d.getMonth();
    d.setMonth(d.getMonth() - _timeframe);

    // if still in same month, set to last day of previous month
    if (d.getMonth() === m) {
      // if 0 is provided for dayValue, the date will be set to the last day of the previous month.
      d.setDate(0);
    }
    d.setHours(0,0,0,0);

    return (parseInt(d / 1000));
  }
}

// action creators
const mapDispatchToProps = {
  getPost : getPost
};

export default connect(null, mapDispatchToProps)(FormPersonSummary);
