
export default {

  config: function() {
    return {
      data: {
        labels: [],
        datasets: [{
          label: 'Value delivered per team',
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
