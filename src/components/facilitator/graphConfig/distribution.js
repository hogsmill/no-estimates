
export default {

  config: function() {
    return {
      data: {
        labels: [],
        datasets: [{
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
            gridLines: {display: true},
            scaleLabel: {
              display: true,
              labelString: 'Number of cards'
            }
          }],
          xAxes: [{
            gridLines: {display: false},
            scaleLabel: {
              display: true,
              labelString: 'Number of days to complete'
            }
          }]
        },
        legend: {display: false},
        responsive: true,
        maintainAspectRatio: false
      }
    }
  }
}
