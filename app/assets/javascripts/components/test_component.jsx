import React from 'react'
import ReactDOM from 'react-dom'

export default class TestComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }

  componentWillMount() {
    console.log("[APPEAR ONLY ONCE]: Clock is gonna get mounted!")
  }

  componentDidMount() {
    console.log("[APPEAR ONLY ONCE]: Mounted!! Timer starts now!")
    this.timer = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    let sec = this.state.date.getSeconds()
    if (sec % 2 == 0) {
      var display = <h2>Tick: { this.state.date.toLocaleTimeString() }.</h2>;
    } else {
      var display = <h2>Tock: { this.state.date.toLocaleTimeString() }.</h2>;
    }
    return (
      <div>
        { display }
      </div>
    );
  }
}
