import React from 'react';

class FormAddPersonFields extends React.Component {
  constructor(props) {
    super(props);

    // state
    this.state = {
      personName: '',
      personType: 'new'
    };

    // bind events
    this.handlePersonType = this.handlePersonType.bind(this);
    this.handleName = this.handleName.bind(this);
  }

  initDate() {
    const date = new Date();
    const y    = date.getFullYear();
    const _m   = (date.getMonth() + 1).toString(); // 0 = Jan
    const m    = (_m.length == 1) ? '0' + _m : _m;
    const _d   = date.getDate().toString();
    const d    = (_d.length == 1) ? '0' + _d : _d;
    const dateVal = y + '-' + m + '-' + d;
    return dateVal;
  }

  // event handlers
  handlePersonType(e) {
    this.setState({
      personType: e.target.value
    });
  }

  handleName(e) {
    this.setState({
      personName: e.target.value
    });
  }

  newOrExisting() {
    if (_s_page_data.user_people_names) {
      return (
        <div className="form-group">
          <fieldset name="person-types">
            <legend>New or Existing Person?</legend>
            <div className="radio">
              <label>
                <input onChange={this.handlePersonType} type="radio" name="person-type" id="person-type-new" value="new" defaultChecked /> New Person
              </label>
            </div>
            <div className="radio">
              <label>
                <input onChange={this.handlePersonType} type="radio" name="person-type" id="person-type-existing" value="existing" /> Existing Person
              </label>
            </div>
          </fieldset>
        </div>
      );
    }
  }

  personName() {
    const display = (this.state.personType === 'new') ? 'block' : 'none';
    const disable = (this.state.personType === 'new') ? false : true;

    return (
      <div className="form-group form-group--person-name" style={{display: display}}>
        <label htmlFor="person-name">New Name</label>
        <input
          value={this.state.personName}
          onChange={this.handleName}
          className="form-control"
          type="text"
          id="person-name"
          name="person-name"
          required disabled={disable} />
      </div>
    );
  }

  personNameExisting() {
    const display = (this.state.personType === 'existing') ? 'block' : 'none';
    const disable = (this.state.personType === 'existing') ? false : true;

    if (_s_page_data.user_people_names) {
      const names = _s_page_data.user_people_names.map((name, i) => {
        return <option key={i + name} value={name}>{name}</option>;
      });
      return (
        <div className="form-group form-group--person-name-existing" style={{display: display}}>
          <label htmlFor="person-name-existing">Existing Names</label>
          <select onChange={this.handleName} className="form-control" id="person-name-existing" name="person-name-existing" required disabled={disable}>
            <option value="">Select Existing Person...</option>
            {names}
          </select>
        </div>
      );
    }
  }

  generateOptions(keyName, values) {
    const optVals = values || [0,1,2,3,4,5,6,7,8,9,10];
    const opts = optVals.map((el, i) => {
      return (<option key={keyName + '-' + i} value={el}>{el}</option>);
    });
    return opts;
  }

  looks() {
    const opts = this.generateOptions('looks');
    return (
      <div className="form-group">
        <label htmlFor="person-looks">Looks</label>
        <select className="form-control" id="person-looks" name="person-looks" required defaultValue="5">
          {opts}
        </select>
      </div>
    );
  }

  personality() {
    const opts = this.generateOptions('personality');
    return (
      <div className="form-group">
        <label htmlFor="person-personality">Personality</label>
        <select className="form-control" id="person-personality" name="person-personality" required defaultValue="4">
          {opts}
        </select>
      </div>
    );
  }

  notes() {
    return (
      <div className="form-group">
        <label htmlFor="person-notes">Notes</label>
        <textarea ref={this.props.textarea} className="form-control" id="person-notes" rows="3" maxLength="500" />
      </div>
    );
  }

  date() {
    return (
      <div className="form-group">
        <label htmlFor="post-date">Date</label>
        <input defaultValue={this.initDate()} className="form-control" type="date" id="post-date" name="post-date" required pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" />
      </div>
    );
  }

  gender() {
    return (
      <div className="form-group">
        <input id="person-gender" type="hidden" name="person-gender" value={this.props.matrixType} />
      </div>
    );
  }

  button() {
    return (
      <div className="form-group">
        <input id="nonce" type="hidden" name="nonce" value={_s_page_data.nonce_create_post} />
        <input id="submit-post" type="submit" value="Add" />
      </div>
    );
  }

  render() {
    return (
      <>
        {this.newOrExisting()}
        {this.personName()}
        {this.personNameExisting()}
        {this.looks()}
        {this.personality()}
        {this.notes()}
        {this.date()}
        {this.gender()}
        {this.button()}
      </>
    );
  }
}

export default FormAddPersonFields;
