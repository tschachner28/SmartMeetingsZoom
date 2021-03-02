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
    drawScatter();
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
        display: true
      },
      cutoutPercentage: 80,
    },
  });
}






function drawScatter() {

  // create data. x: polarity, y: subjectivity
/*
  var data = [
    {x: 0, value: 0},
    {x: 0, value: 0},
    {x: 0, value: 0},
    {x: 25, value: 63},
    {x: 44, value: 54},
    {x: 55, value: 58},
    {x: 56, value: 46},
    {x: 60, value: 54},
    {x: 72, value: 73}
  ]; */

  console.log("json_data.sentiments[0][0]: " + json_data.sentiments[0][0].toString());
  console.log("type: " + typeof(json_data.sentiments[0][0]));
/*
  var data = [];

  for (var i = 0; i < json_data.participants.length; i++) {
    data.push({x: json_data.sentiments[i][0], value: json_data.sentiments[i][1]});

  }

console.log("data for scattter plot: " + data.toString()); */

  // create a chart
  chart = anychart.quadrant();
  for (var i = 0; i < json_data.participants.length; i++) {
      var data = [{x: json_data.sentiments[i][0], value: json_data.sentiments[i][1]}];
      var series = chart.marker(data);
      series.name(json_data.participants[i]);
      series.labels().format("{%x}");
  }

  var legend = chart.legend();
  legend.enabled(true);

  chart.xAxis(0, {ticks: true, labels: true});
  chart.yAxis(0, {ticks: true, labels: true});
  chart.yScale().minimum(0);
    chart.yScale().maximum(1);
    chart.xScale().minimum(-1);
chart.xScale().maximum(1);

  chart.quarters(
        {
            rightTop: {
                fill: "#ccfff2",
                title: {
                    text: "Positive Polarity, High Subjectivity",
                    fontColor: "#000000",
                    fontSize: "20",
                    fontWeight: "bold",

                }
            },
            rightBottom: {
                fill: "#b7e9f7",
                title: {
                    fontColor: "#000000",
                    text: "Positive Polarity, Low Subjectivity",
                    fontSize: "20",
                    fontWeight: "bold"
                }
            },
            leftBottom: {
                fill: "#e9d3ff",
                title: {
                    fontColor: "#000000",
                    text: "Negative Polarity, Low Subjectivity",
                    fontSize: "20",
                    fontWeight: "bold"
                }
            },
            leftTop: {
                fill: "#CBC3E3",
                title: {
                    fontColor: "#000000",
                    text: "Negative Polarity, High Subjectivity",
                    fontSize: "20",
                    fontWeight: "bold"
                }
            }
        }
);

  // set the container id
  chart.container("scatterplot");

  // initiate drawing the chart
  chart.draw();
}