import React from 'react';
import ReactDOM from 'react-dom';

import DynamicReactEl from './DynamicReactEl.js';

class Dynamic extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      els: {}
    };

    this.incrementer = 0;

    this.options = {
      classes: {
        visible: 'notification--visible',
        removing: 'notification--removing'
      },
      delayFadeIn: 2000,
      delayFadeOut: 1000
    };
    this.timers = [];
    this.timerIndex = null;
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }

  componentDidUpdate() {
    console.log('parentComponentDidUpdate');

    // only set remove timer when a new notification is rendered...
    // move timeout logic to child notifications? each child has it's own timer
    // dispatches event when timer expires...which then updates parent state to re-render?
    // 
    // this.setRemoveTimer(this.removeNotification);
  }

  setTimerIndex() {
    this.timerIndex = (this.timerIndex === null) ? 0 : this.timerIndex += 1;
    return this.timerIndex;
  }

  // @NOTE instead of el, need an id...or ref...
  // setRemoveTimer(el, callback) {
  setRemoveTimer(callback) {
    console.log('setRemoveTimer');

    // set the timer index
    const _index = this.setTimerIndex();

    // add the timer index to this.timers array (not sparse bc incremental)
    this.timers[_index] = window.setTimeout(() => { 
      // after the element has faded-in, call the remove timer callback
      setRemoveTimerCb(this) 
    }, this.options.delayFadeIn);

    // the remove timer callback
    function setRemoveTimerCb(_this) {
      console.log('setRemoveTimerCb');

      // fade the element
      // el.classList.remove(_this.options.classes.visible);
      // el.classList.add(_this.options.classes.removing);

      // remove the element (this.removeNotification)
      if (typeof callback != 'undefined' && callback) {
        // call() with context of _this
        // callback.call(_this, el);
        callback.call(_this);
      }
    }
  }

  removeNotification(el) {
    console.log('removeNotification');

    const _index = this.setTimerIndex();

    this.timers[_index] = window.setTimeout(() => { 
      // when the element has faded out, update the state to remove it via re-render
      removeNotificationCb(this) 
    }, this.options.delayFadeOut);

    function removeNotificationCb(_this) {
      console.log('removeNotificationCb');
      // remove the element
      // the displayed notifications should be handled by State and removed by updating the State

      console.log('update state here to remove notification');
      // just remove the oldest notification from state...
      _this.setState({
        els: _this.state.els.slice(1)
      });

      console.log('this.timers', _this.timers);

      // remove the timer
      window.clearTimeout(_this.timers[_index]);

      console.log('this.timers after clear', _this.timers);
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get('text');
    const _id  = this.incrementer++;

    this.setState({
      els: {
        ...this.state.els,
        [_id]: {
          id: _id,
          text: text
        }
      }
    });
  }

  // @NOTE can't delete when using async bc state/prev is changing dynamically and new item can be added at any time
  methDelete(id) {
    console.log('methDelete id', id);

    // use function to account for async state updates
    // this.setState({
    //   els: {
    //     ...newState.els
    //   }
    // });

    // can't DELETE for ASYNC bc state/prev is changing as items are added and reduplicated 

    this.setState((prevState, props) => {
      console.log('prevState', prevState);

      // delete the key
      // deep clone state
      const newState = JSON.parse(JSON.stringify(prevState));

      // delete the id from new state
      // @NOTE can just set to null or undefined
      delete newState.els[id];

      return {
        els: {
          ...newState.els
        }  
      };
    });
  }

  methNullify(id) {
    // just set the element to null by id
    this.setState((prevState, props) => {
      return {
        els: {
          ...prevState.els,
          [id]: null
        }
      };
    });
  }

  formatData() {
    const arr = [];
    for (let el in this.state.els) {
      arr.push(this.state.els[el]);
    }
    return arr;
  }

  render() {
    const arr = this.formatData();
    const els = arr.map((el, i) => {
      if (!el) {
        return null;
      }
      return (
        <DynamicReactEl 
          key={i + '-el-key'} 
          id={el.id} 
          text={el.text}
          meth={this.methNullify.bind(this)} />
      );
    });

    return (
      <>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" id="text" name="text" required />
          <button type="submit">Add!</button>
        </form>
        <div>
          {(els) ? els : null}
        </div>
      </>
    );
  }
}

ReactDOM.render(
  <Dynamic />,
  document.getElementById('react-dynamic')
);
