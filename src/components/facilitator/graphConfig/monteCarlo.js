
export default {

  config: function() {
    return {
      data: {
        labels: [],
        datasets: [{
          label: 'Number of times run completes in this many days',
          backgroundColor: '#f87979',
          pointBackgroundColor: 'white',
          borderWidth: 1,
          pointBorderColor: '#249EBF',
          data: []
        }]
      },
      percentiles: {
        50: 0,
        75: 0,
        90: 0,
        95: 0,
        99: 0
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {beginAtZero: true},
            gridLines: {display: true}
          }],
          xAxes: [{
            gridLines: {display: false}
          }]
        },
        legend: {display: false},
        responsive: true,
        maintainAspectRatio: false
      }
    }
  }
}
