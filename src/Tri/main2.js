
d3.csv("./assets/data/Art_in_Public_Places.csv").then(function(data) {
  // Khúc này xử lý data, tùy theo yêu cầu mà viết hàm xử lý thui
  var countData = convertData(data)

  // Thiết lập kích thước của biểu đồ
  var margin = { top: 30, right: 30, bottom: 100, left: 100 },
  width = 1200 - margin.left - margin.right, 
  height = 600 - margin.top - margin.bottom; 

  // Create SVG element and set its size
  var svg = d3.select("#chart2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  // Thiết lập scale cho trục x và y
  var x = d3.scaleBand()
    .domain(countData.map(function(d) { return d.type; }))
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
    .attr("x", function(d) { return (x(d.type) + x.bandwidth() / 4); })
    .attr("y", function(d) { return y(d.count); })
    .attr("width", x.bandwidth() - x.bandwidth()/2 )
    .attr("height", function(d) { return height - y(d.count); })
    .attr("fill", 'green');
  // Thêm label phía trên của mỗi cột
  svg.selectAll(".text")
  .data(countData)
  .enter().append("text")
  .attr("class", "label")
  .attr("x", function(d) { return x(d.type) + x.bandwidth() / 2; })
  .attr("y", function(d) { return y(d.count) - 5; }) // Dịch lên một chút để tránh chồng chéo
  .text(function(d) { return d.count; })
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("fill", "black");

  svg.append("text")
  .attr("class", "axis-label")  // Optional class for styling
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - margin.bottom/2) +")")  // Position the label
  .text("Loại tác phẩm")  // Set the label text
  .style("text-anchor", "middle")  // Center align the text
  .attr("font-size", "14px")  // Optional font size adjustment
  .attr("fill", "black");  // Optional text color

  svg.append("text")
  .attr("class", "axis-label")  // Optional class for styling
  .attr("transform", "translate(" + (- margin.left/2) + " ," + (height / 2) + ")rotate(-90)")  // Position the label
  .text("Số lượng tác phẩm")  // Set the label text
  .style("text-anchor", "middle")
  .attr("font-size", "14px")
  .attr("fill", "black");

}).catch(function(error) {
  console.error("Error loading the data: " + error);
});



const convertData = (data) => {
  // Tạo một đối tượng để lưu trữ số lượng sự cố cho từng loại thời tiết
  var countBytype = {};

  // Tính số lượng sự cố cho từng loại thời tiết
  data.forEach(function(d) {
    var key = d["Type"];
    countBytype[key] = (countBytype[key] || 0) + 1;
  });

  // Chuyển đổi đối tượng thành mảng các đối tượng [{type: key, count: value}]
  var countData = Object.keys(countBytype).map(function(key) {
    return { type: key, count: countBytype[key] };
  });

  return countData
}