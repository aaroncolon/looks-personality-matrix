import React from "react";

export default class ChartPieG extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef(); // Create Ref to draw chart
  }

  componentDidMount() {
    this.initPieChartG(this.props.chartData);
  }

  componentDidUpdate(prevProps) {
    if (this.props.chartData !== prevProps.chartData) {
      this.initPieChartG(this.props.chartData);
    }
  }

  initPieChartG(_data) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart.bind(this));

    function drawChart() {
      // unshift labels for data 'Zone', Hits'
      // [['Zone', 'Hits'],
      // ['No Go',  11],
      // ['Danger',  2],
      // ['Fun',     2],
      // ['Date',    2],
      // ['Spouse',  7],
      // ['Unicorn', 0],
      _data.unshift(['Zone', 'Hits']);

      const data = google.visualization.arrayToDataTable(_data);

      const options = {
        chartArea: {
          height: '80%',
          width: '80%'
        },
        legend: {
          alignment: 'center',
          position: 'top'
        }
      };

      const chart = new google.visualization.PieChart(this.ref.current);

      chart.draw(data, options);
    }
  }

  render() {
    return (
      <div
        ref={this.ref}
        id="person-chart-pie--google"
        className="person-chart-pie--google"></div>
    );
  }
}
