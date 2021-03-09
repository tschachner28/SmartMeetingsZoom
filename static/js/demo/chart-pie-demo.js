//import JSON

// Set new default font family and font color to mimic Bootstrap's default styling

Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
console.log('before fetch');
var json_data = null;
var ttmuch = [];
var ttless = [];  
var avepol = 0;
var aveobj = 0;
var maxtalk = 0;
var mintalk = 0;

fetch('http://127.0.0.1:5000/parse')
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    //console.log( myJson );
    json_data = myJson;
    console.log(JSON.stringify(myJson));
    console.log('hi');
    document.getElementById("long-pauses").innerHTML = myJson.long_pauses.toString();
    document.getElementById("num-profane-words").innerHTML = myJson.num_profane_words.toString();
    drawChart();
    drawScatter();
    fillSum();
  });

function fillSum() {
  var innerselect = '<a class="dropdown-item"><button type="button" onclick="changeSum(-1)">Team</button></a><div class="dropdown-divider"></div>'
  var numofpar = json_data.participants.length;
  maxtalk = (1/numofpar) * 130;
  mintalk = (1/numofpar) * 70;
  for (i=0; i<numofpar; i++) {
    avepol += json_data.sentiments[i][0];
    aveobj += json_data.sentiments[i][1];
    if (json_data.speaking_times[i] > maxtalk) {
      ttmuch.push(json_data.participants[i]);
    } else if (json_data.speaking_times[i] < mintalk) {
      ttless.push(json_data.participants[i]);
    }
    innerselect += '<a class="dropdown-item"><button type="button" onclick="changeSum(' + i.toString() + ')">' + json_data.participants[i] + '</button></a>'
  }
  document.getElementById("people").innerHTML = innerselect;
  aveobj /= numofpar;
  avepol /= numofpar;
  everyoneSum();
}

function everyoneSum() {
  if (json_data.num_profane_words > 0) {
    document.getElementById("sum-unprof").innerHTML = "Let's encourage each other to use professional language.";
  } else {
    document.getElementById("sum-unprof").innerHTML = "Great job using professional language!";
  }
  if (ttless.length == 0 && ttmuch.length == 0) {
    document.getElementById("sum-tt").innerHTML = "Nice job sharing speaking times!";
  } else {
    document.getElementById("sum-tt").innerHTML = "For the next meeting, ";
    if (ttmuch.length == 1) {
      document.getElementById("sum-tt").innerHTML += ttmuch[ttmuch.length-1] + ", ";
    } else if (ttmuch.length > 0) {
      for (i=0; i<ttmuch.length-1; i++) {
        document.getElementById("sum-tt").innerHTML += ttless[i] + ", ";
      }
      document.getElementById("sum-tt").innerHTML += "and " + ttmuch[ttmuch.length-1] + ", ";
    }
    document.getElementById("sum-tt").innerHTML += "let's give more speaking time to ";
    if (ttless.length == 1) {
      document.getElementById("sum-tt").innerHTML += ttless[ttless.length-1] + ".";
    } else if (ttless.length > 0) {
      for (i=0; i<ttless.length-1; i++) {
        document.getElementById("sum-tt").innerHTML += ttless[i] + ", ";
      }
      document.getElementById("sum-tt").innerHTML += "and " + ttless[ttless.length-1] + ".";
    } else {
      document.getElementById("sum-tt").innerHTML += "other people.";
    }
  }
  if (avepol < 0) {
    document.getElementById("sum-pol").innerHTML = "Being more positive could brighten the mood in the next meeting.";
  } else {
    document.getElementById("sum-pol").innerHTML = "Amazing job keeping the mood positive!";
  }
  if (aveobj < 0.25) {
    document.getElementById("sum-obj").innerHTML = "Being more objective could help your next meeting.";
  } else if (aveobj > 0.75) {
    document.getElementById("sum-obj").innerHTML = "Voicing more opinions could help your next meeting.";
  } else {
    document.getElementById("sum-obj").innerHTML = "Wonderful job keeping balance between objectivity and subjectivity!";
  }
  if (json_data.long_pauses > 3) {
    document.getElementById("sum-pause").innerHTML = "Let's be more prepared to efficiently run the meeting.";
  } else {
    document.getElementById("sum-pause").innerHTML = "Fantastic job keeping the conversation going!";
  }
}

function changeSum(pnum) {
  if (pnum == -1) {
    everyoneSum();
  }
  else {
    //talking time
    if (ttless.includes(json_data.participants[pnum])) {
      document.getElementById("sum-tt").innerHTML = "Let's try to speak more in the next meeting."
    } else {
      if (ttmuch.includes(json_data.participants[pnum])) {
        document.getElementById("sum-tt").innerHTML = "Let's try to talk less";
      } else {
        document.getElementById("sum-tt").innerHTML = "Keep up the balanced talking time";
      }
      if (ttless.length > 0) {
        document.getElementById("sum-tt").innerHTML += ", and let's encourage ";
        if (ttless.length == 1) {
          document.getElementById("sum-tt").innerHTML += ttless[ttless.length-1] + " to talk more.";
        } else if (ttless.length > 0) {
          for (i=0; i<ttless.length-1; i++) {
            document.getElementById("sum-tt").innerHTML += ttless[i] + ", ";
          }
          document.getElementById("sum-tt").innerHTML += "and " + ttless[ttless.length-1] + " to talk more.";
        }
      } else {
        document.getElementById("sum-tt").innerHTML += "."
      }
    }
  }
  //pol
  if (json_data.sentiments[pnum][0] < 0) {
    document.getElementById("sum-pol").innerHTML = "Being more positive could brighten the mood in the next meeting.";
  } else {
    document.getElementById("sum-pol").innerHTML = "Amazing job keeping the mood positive!";
  }
  //obj
  if (json_data.sentiments[pnum][1] < 0.25) {
    document.getElementById("sum-obj").innerHTML = "Being more objective could help your next meeting.";
  } else if (aveobj > 0.75) {
    document.getElementById("sum-obj").innerHTML = "Voicing more opinions than facts could help your next meeting.";
  } else {
    document.getElementById("sum-obj").innerHTML = "Wonderful job keeping balance between objectivity and subjectivity!";
  }
}


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
                    fontColor: "#A9A9A9",
                    fontSize: "14",
                    fontWeight: "bold",

                }
            },
            rightBottom: {
                fill: "#b7e9f7",
                title: {
                    fontColor: "#A9A9A9",
                    text: "Positive Polarity, Low Subjectivity",
                    fontSize: "14",
                    fontWeight: "bold"
                }
            },
            leftBottom: {
                fill: "#e9d3ff",
                title: {
                    fontColor: "#A9A9A9",
                    text: "Negative Polarity, Low Subjectivity",
                    fontSize: "14",
                    fontWeight: "bold"
                }
            },
            leftTop: {
                fill: "#CBC3E3",
                title: {
                    fontColor: "#A9A9A9",
                    text: "Negative Polarity, High Subjectivity",
                    fontSize: "14",
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