
export default {

  config: function() {
    return {
      data: {
        labels: [],
        datasets: [{
          backgroundColor: '',
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
              labelString: 'Days to cpmplete'
            }
          }],
          xAxes: [{
            gridLines: {display: false},
            scaleLabel: {
              display: true,
              labelString: 'Card Number'
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
