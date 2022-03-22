import React from "react";
import { connect } from "react-redux";

class ChartLineG extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef(); // Create Ref to draw chart
  }

  componentDidMount() {
    this.initLineChartG(this.props.chartData);
  }

  componentDidUpdate(prevProps) {
    if (this.props.chartData !== prevProps.chartData) {
      this.initLineChartG(this.props.chartData);
    }
  }

  initLineChartG(_data) {
    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(drawChart.bind(this));

    function drawChart() {
      const matrixType = this.props.matrixType;
      let chartTitle   = '';

      const data = new google.visualization.DataTable();
      data.addColumn('string', 'Date');

      data.addColumn('number', 'Looks');
      data.addColumn('number', 'Personality');
      chartTitle = 'Looks / Personality';

      data.addRows(_data);

      const options = {
        chart: {
          'title': chartTitle + ' Over Time'
        },
        chartArea: {
          height: '70%',
          width: '70%'
        },
        curveType: 'function',
        vAxis: {
          'viewWindow': {
            'max': 10,
            'min': 0,
            'viewWindowMode': 'pretty'
          }
        }
      };

      const chart = new google.charts.Line(this.ref.current);

      chart.draw(data, google.charts.Line.convertOptions(options));
    }
  }

  render() {
    return (
      <div
        ref={this.ref}
        id="person-chart-line--google"
        className="person-chart-line--google"></div>
    );
  }
}

function mapStateToProps(state) {
  return {
    matrixType: state.matrixType
  };
}

export default connect(mapStateToProps)(ChartLineG);
