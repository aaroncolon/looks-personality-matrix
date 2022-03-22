import React from 'react';

// components
import Notifications from './redux/components/Notifications';
import FormAddPerson from './redux/components/FormAddPerson';
import FormPersonSummary from './redux/components/FormPersonSummary';
import PersonSummary from './redux/components/PersonSummary';
import PersonTable from './redux/components/PersonTable';
import PersonCharts from './redux/components/PersonCharts';

class App extends React.Component {
  doContent() {
    const view = new URLSearchParams(window.location.search).get('view')
    let content = null

    const add = (
      <div className="col col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
        <div id="react-root-add-person">
          <h1 className="heading heading--section">Add Data</h1>
          {<FormAddPerson />}
        </div>
      </div>
    )

    const summary = (
      <div className="col col-xs-12 col-sm-6 col-sm-offset-3">
        <div id="react-root-person-summary">
          <h1 className="heading heading--section">Summary</h1>
          {<FormPersonSummary />}
          {<PersonSummary />}
          {<PersonCharts />}
          {<PersonTable />}
        </div>
      </div>
    )

    if (view === 'react-add') {
      content = add
    } else if (view === 'react-summary') {
      content = summary
    } else {
      content = add
    }

    return content
  }

  render() {
    const content = this.doContent()

    return (
      <>
        <div className="section-notifications">
          <div id="notification-wrap" className="notification-wrap">
            {<Notifications />}
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            {content}
          </div>
        </div>
      </>
    );
  }
}

export default App;
