
export default {

  config: function() {
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
  }
}
