import React, { Component } from 'react';
import { getData } from '../Modules/PerformanceData';
import { Message, Segment, Divider } from 'semantic-ui-react'
import { Line, Bar } from 'react-chartjs-2';
import moment from 'moment';

class DisplayPerformanceData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      performanceData: null
    }
  }
  componentDidMount() {
    this.getPerformanceData()
  }

  async getPerformanceData() {
    let result = await getData();
    this.setState({ performanceData: result.data.entries }, () => {
      this.props.indexUpdated();
    })
  }

  render() {
    let dataIndex;
    let distances = []
    let dates = []
    let numOfExcellent;
    let numOfAboveAverage;
    let numOfAverage;
    let numOfBelowAverage;
    let numOfPoor;

    let barChartData = {
      datasets: [{
        label: 'Performance Status',
        data: [
          { x: "Excellent", y: 15 },
          { x: "Above average", y: numOfAboveAverage },
          { x: "Average", y: numOfAverage },
          { x: "Below average", y: numOfBelowAverage },
          { x: "Poor", y: numOfPoor },
        ],
      }]
    };

    let lineChartData = {
      datasets: [{
        label: 'Distance over time',
        data: distances,
      }],
      labels: dates
    };

    let lineChartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            min: 0
          }
        }]
      }
    }


    if (this.props.updateIndex === true) {
      this.getPerformanceData();
    }

    if (this.state.performanceData != null) {
      this.state.performanceData.forEach(entry => {
        let dateString = entry.created_at;
        let dateObj = new Date(dateString);
        let momentObj = moment(dateObj);
        let momentString = momentObj.format('YYYY-MM-DD');
        distances.push(entry.data.distance);
        dates.push(momentString);
      })

      numOfExcellent = 0;
      for (var a = 0; a < this.state.performanceData.length; a++) {
        if (this.state.performanceData[a].data.message === "Excellent")
          numOfExcellent++;
      }

      numOfAboveAverage = 0;
      for (var b = 0; b < this.state.performanceData.length; b++) {
        if (this.state.performanceData[b].data.message === "Above average")
          numOfAboveAverage++;
      }

      numOfAverage = 0;
      for (var c = 0; c < this.state.performanceData.length; c++) {
        if (this.state.performanceData[c].data.message === "Average")
          numOfAverage++;
      }

      numOfBelowAverage = 0;
      for (var d = 0; d < this.state.performanceData.length; d++) {
        if (this.state.performanceData[d].data.message === "Below average")
          numOfBelowAverage++;
      }

      numOfPoor = 0;
      for (var e = 0; e < this.state.performanceData.length; e++) {
        if (this.state.performanceData[e].data.message === "Poor")
          numOfPoor++;
      }
      dataIndex = (
        <div>
          {this.state.performanceData.map(item => {
            return <div key={item.id}>Your result of <b>{item.data.distance}</b> meters is <b>{item.data.message}</b></div>
          })}
        </div>
      )
    }

    return (
      <>
        <Divider horizontal>Distance and Result log</Divider>
        <Segment>
          <Message>
            {dataIndex}
          </Message>
        </Segment>


        <Line
          data={lineChartData}
          options={lineChartOptions}
        />
        <Bar
         data={barChartData}
        // options={barChartOptions}
        />

      </>
    )
  }
}
export default DisplayPerformanceData
