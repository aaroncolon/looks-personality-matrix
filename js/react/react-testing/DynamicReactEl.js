import React from 'react';

class El extends React.Component {
  constructor(props) {
    super(props);

    this.timerId = null;
  }

  componentDidMount() {
    console.log('childComponentDidMount');

    this.timerId = window.setTimeout(() => {
      window.clearTimeout(this.timerId);
      // pass the id
      this.props.meth(this.props.id);
    }, 3000);
  }

  componentDidUpdate() {
    console.log('childComponentDidUpdate');
  }

  componentWillUnmount() {
    console.log('childComponentWillUnmount');
    window.clearTimeout(this.timerId);
    console.log('this.timerId', this.timerId);
  }

  render() {
    return (
      <p id={this.props.id}>{this.props.text}</p>
    );
  }
}

export default El;
