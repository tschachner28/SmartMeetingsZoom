//import JSON

// Set new default font family and font color to mimic Bootstrap's default styling

Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
console.log('before fetch');
var json_data = null;

fetch('http://0.0.0.0:5000/parse')
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    //console.log( myJson );
    json_data = myJson;
    console.log(JSON.stringify(myJson));
    console.log('hi');
    document.getElementById("long-pauses").innerHTML = myJson.long_pauses.toString();
    drawChart();
  });

function drawChart() {
  // Pie Chart Example
  var ctx = document.getElementById("myPieChart");
  console.log("started making pie chart");
  var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      //labels: ["Directttttttt", "Referral", "Social"],
      labels: json_data.participants,
      datasets: [{
        //data: [95, 3, 2],
        data: json_data.speaking_times,
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  });
}