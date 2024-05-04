d3.csv("../assets/data/Traffic_Accidents.csv").then(function(data) {

  // Tạo các đối tượng dữ liệu
  var countAccidentNumber = {};
  var sumOfInjuries = {};


  data.forEach(function(d) {
    var year = new Date(d["Date and Time"]).getFullYear();
    countAccidentNumber[year] = (countAccidentNumber[year] || 0) + 1;
  });

  data.forEach(function(d) {
    var year = new Date(d["Date and Time"]).getFullYear();
    sumOfInjuries[year] = (sumOfInjuries[year] || 0) + parseInt(d["Number of Injuries"]);
  });

  // Chuyển dữ liệu thành đối tượng
  var lineData1 = Object.keys(countAccidentNumber).map(function(year) {
    return { year: parseInt(year), count: countAccidentNumber[year] };
  });

  var lineData2 = Object.keys(sumOfInjuries).map(function(year) {
    return { year: parseInt(year), count: sumOfInjuries[year] };
  });

  var margin = { top: 20, right: 30, bottom: 100, left: 100 };
  var width = 800 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  // Tạo đối tượng svg để vẽ biểu đồ
  var svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Scale khung của trục x và trục y
  var x = d3.scaleBand()
    .domain(lineData1.map(function(d) { return d.year; }))
    .range([0, width])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([0, d3.max(lineData1, function(d) { return d.count; })])
    .nice()
    .range([height, 0]);

  // Tạo trục x và trục y
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  var line = d3.line()
    .x(function(d) { return x(d.year) + x.bandwidth() / 2; })
    .y(function(d) { return y(d.count); });

  // Vẽ biểu đồ đường
  svg.append("path")
    .datum(lineData1) 
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 2);

  svg.append("path")
    .datum(lineData2)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2);


  //tạo label cho dữ liệu đường
  svg.selectAll(".label")
    .data(lineData1)
    .enter().append("text")
    .attr("class", "label1")
    .attr("x", function(d) { return x(d.year) + x.bandwidth() / 2; })
    .attr("y", function(d) { return y(d.count) - 10; })
    .text(function(d) { return d.count; })
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black");

    svg.selectAll(".label")
    .data(lineData2)
    .enter().append("text")
    .attr("class", "label2")
    .attr("x", function(d) { return x(d.year) + x.bandwidth() / 2; })
    .attr("y", function(d) { return y(d.count) + 20; })
    .text(function(d) { return d.count; })
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black");

    svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - margin.bottom/2) +")")  // Position the label
    .text("Năm")
    .style("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "black");
  
    svg.append("text")
    .attr("class", "axis-label")  // Optional class for styling
    .attr("transform", "translate(" + (- margin.left/2) + " ," + (height / 2) + ")rotate(-90)")  // Position the label
    .text("Số vụ tai nạn hoặc số người bị thương")  // Set the label text
    .style("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "black");



}).catch(function(error) {
  console.error("Error loading the data: " + error);
});
