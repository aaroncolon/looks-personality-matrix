import React from 'react';

class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.options = {
      classes: {
        visible: 'notification--visible',
        removing: 'notification--removing'
      },
      delayFadeIn: 2000,
      delayFadeOut: 1000
    };

    this.timerIdFadeIn = null;
    this.timerIdFadeOut = null;

    // create a Ref for class manipulation after creation
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.postRender(); // uses requestAnimationFrame()
  }

  componentWillUnmount() {
    window.clearTimeout(this.timerIdFadeIn);
    window.clearTimeout(this.timerIdFadeOut);
  }

  postRender() {
    window.requestAnimationFrame(() => {
      // add the visible class
      this.ref.current.classList.add(this.options.classes.visible);

      // set the remove timer
      this.setRemoveTimer(this.ref.current, this.removeNotification);
    });
  }

  setRemoveTimer(el, callback) {
    this.timerIdFadeIn = window.setTimeout(() => { 
      setRemoveTimerCb(this) 
    }, this.options.delayFadeIn);

    function setRemoveTimerCb(_this) {
      // fade the element
      el.classList.remove(_this.options.classes.visible);
      el.classList.add(_this.options.classes.removing);

      // remove the element
      if (typeof callback != 'undefined' && callback) {
        // call() with context of _this
        callback.call(_this, el);
      }
    }
  }

  removeNotification(el) {
    this.timerIdFadeOut = window.setTimeout(() => { 
      removeNotificationCb(this) 
    }, this.options.delayFadeOut);

    function removeNotificationCb(_this) {
      // dispatches action in parent via props
      _this.props.removeNotification(_this.props.id);
    }
  }

  render() {
    return (
      <p 
        ref={this.ref} 
        className={'notification'} 
        id={this.props.id}>
          {this.props.copy}
      </p>
    );
  }
}

export default Notification;
