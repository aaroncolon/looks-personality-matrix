import React from 'react';
import { connect } from 'react-redux';

// components
import Notification from './Notification';

// actions
import { removeNotificationAction } from '../actions/addPersonActions';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.removeNotification = this.removeNotification.bind(this);
  }
  
  removeNotification(_id) {
    // dispatch redux action
    this.props.removeNotificationAction(_id);
  }

  doCopy(item) {
    let copy = '';
    if (item.new_person) {
      copy = `${item.name} data added.`;
    } else {
      copy = `${item.name} data updated.`;
    }
    return copy;
  }

  formatData() {
    // create array of notifItems
    let arr = [];
    for (let item in this.props.notifItems) {
      arr.push(this.props.notifItems[item]);
    }
    return arr;
  }

  render() {
    // every time the state updates, we render a notification...
    if (! this.props.notifItems) {
      return null;
    }

    // map our elements
    const arr = this.formatData();
    const notifs = arr.map((item, i) => {
      if (!item) {
        return null;
      }

      const id   = item.rId;
      const copy = this.doCopy(item);
      return (
        <Notification 
          key={id} 
          copy={copy} 
          id={id} 
          removeNotification={this.removeNotification} />
      );
    });

    return (
      <>
        {(notifs) ? notifs : null}
      </>
    );
  }
}

const mapStateToProps = function(state) {
  // return only the piece of state we need for this component
  return {
    notifItems : state.notifications
  };
};

const mapDispatchToProps = { 
  removeNotificationAction: removeNotificationAction 
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
