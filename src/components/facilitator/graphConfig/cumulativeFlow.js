
export default {

  config: function() {
    return {
      data: {
        labels: [],
        datasets: [{
          label: 'Done',
          backgroundColor: 'navy',
          data: [],
          barPercentage: 1,
          categoryPercentage: 1
        }, {
          label: 'Deploy',
          backgroundColor: '#4f0384',
          data: [],
          barPercentage: 1,
          categoryPercentage: 1
        }, {
          label: 'Test',
          backgroundColor: '#0067b1',
          data: [],
          barPercentage: 1,
          categoryPercentage: 1
        }, {
          label: 'Develop',
          backgroundColor: '#76a001',
          data: [],
          barPercentage: 1,
          categoryPercentage: 1
        }, {
          label: 'Design',
          backgroundColor: '#b10018',
          data: [],
          barPercentage: 1,
          categoryPercentage: 1
        }]
      },
      options: {
        tooltips: {
          displayColors: true,
          callbacks:{
            mode: 'x',
          },
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display: false,
            }
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
            type: 'linear',
          }]
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom' },
      }
    }

/*
    return {
      data: {
        labels: [],
        datasets: [{
          label: 'No. of Cards that took this many days',
          backgroundColor: '#f87979',
          pointBackgroundColor: 'white',
          borderWidth: 1,
          pointBorderColor: '#249EBF',
          data: []
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {beginAtZero: true, stepSize: 1},
            gridLines: {display: true}
          }],
          xAxes: [{
            gridLines: {display: false}
          }]
        },
        legend: {display: true},
        responsive: true,
        maintainAspectRatio: false
      }
    }
*/
  }
}
