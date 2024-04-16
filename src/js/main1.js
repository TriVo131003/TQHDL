d3.csv("../assets/data/Traffic_Accidents.csv").then(function(data) {
  // Lọc dữ liệu theo điều kiện Illumination Code = 1
  var filteredData = data.filter(function(d) {
      return d["Illumination Code"] === "1";
  });
  
  // Tạo một đối tượng để lưu trữ số lượng người bị thương theo năm
  var injuryCountByYear = {};

  // Tính số lượng người bị thương theo năm
  filteredData.forEach(function(d) {
      var year = new Date(d["Date and Time"]).getFullYear();
      injuryCountByYear[year] = (injuryCountByYear[year] || 0) + parseInt(d["Number of Injuries"]);
  });

  // Chuyển đổi đối tượng thành mảng các đối tượng [{year: year, count: count}]
  var countData = Object.keys(injuryCountByYear).map(function(year) {
      return { year: parseInt(year), count: injuryCountByYear[year] };
  });

  // Thiết lập kích thước của biểu đồ
  var margin = { top: 20, right: 30, bottom: 30, left: 40 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // Tạo một đối tượng SVG và thiết lập kích thước
  var svg = d3.select("#chart1")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Thiết lập scale cho trục x và y
  var x = d3.scaleBand()
      .domain(countData.map(function(d) { return d.year; }))
      .range([0, width])
      .padding(0.1);

  var y = d3.scaleLinear()
      .domain([0, d3.max(countData, function(d) { return d.count; })])
      .nice()
      .range([height, 0]);

  // Tạo trục x và y
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .call(d3.axisLeft(y));

  // Vẽ các cột
  svg.selectAll(".bar")
      .data(countData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year) + x.bandwidth() / 4; })
      .attr("y", function(d) { return y(d.count); })
      .attr("width", x.bandwidth() / 2)
      .attr("height", function(d) { return height - y(d.count); });

  // Thêm label phía trên của mỗi cột
  svg.selectAll(".text")
      .data(countData)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", function(d) { return x(d.year) + x.bandwidth() / 2; })
      .attr("y", function(d) { return y(d.count) - 5; }) // Dịch lên một chút để tránh chồng chéo
      .text(function(d) { return d.count; })
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "black");
}).catch(function(error) {
  console.error("Error loading the data: " + error);
});
