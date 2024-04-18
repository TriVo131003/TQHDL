d3.csv("Traffic_Accidents.csv").then(function(data) {
  // Khúc này xử lý data, tùy theo yêu cầu mà viết hàm xử lý thui
  var countData = convertData(data)

  data.sort(function(a, b) {
    return d3.descending(a.count, b.count);
  });

  var topFiveData = data.slice(0, 5);

  // Thiết lập kích thước của biểu đồ
  var width = 1600;
  var height = 400;
  var margin = {top: 20, right: 20, bottom: 30, left: 40};

  // Tạo một đối tượng SVG và thiết lập kích thước
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Thiết lập scale cho trục x và y
  var x = d3.scaleBand()
    .domain(countData.map(function(d) { return d.collision; }))
    .range([0, width])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([0, d3.max(countData, function(d) { return d.count; })])
    .nice()
    .range([height, 0]);

    var colorScale = d3.scaleOrdinal()
        .domain(topFiveData.map(function(d) { return d.collision; }))
        .range(["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff"]); // Example color range


    // var topFiveData = y.slice(0, 5);

  // Tạo trục x và y
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll(".tick")
     

  svg.append("g")
    .call(d3.axisLeft(y));
    

  // Vẽ các cột
  svg.selectAll(".bar")
    .data(countData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return (x(d.collision) + x.bandwidth() / 5); })
    .attr("y", function(d) { return y(d.count); })
    .attr("width", x.bandwidth() - 50)
    .attr("height", function(d) { return height - y(d.count); })
    .attr("fill", function(d) { return colorScale(d.collision); });
  
  // Thêm label phía trên của mỗi cột
  svg.selectAll(".text")
  .data(countData)
  .enter().append("text")
  .attr("class", "label")
  .attr("x", function(d) { return x(d.collision) + x.bandwidth() / 2; })
  .attr("y", function(d) { return y(d.count) - 15; }) // Dịch lên một chút để tránh chồng chéo
  .text(function(d) { return d.count; })
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("fill", "black");
  
}).catch(function(error) {
  console.error("Error loading the data: " + error);
});



const convertData = (data) => {
  // Tạo một đối tượng để lưu trữ số lượng sự cố cho từng loại thời tiết
  var countByCollision = {};

  // Tính số lượng sự cố cho từng loại thời tiết
  data.forEach(function(d) {
    var key = d["Collision Type Description"];
    countByCollision[key] = (countByCollision[key] || 0) + 1;
  });


  // Chuyển đổi đối tượng thành mảng các đối tượng [{collision: key, count: value}]
  var countData = Object.keys(countByCollision).map(function(key) {
    return { collision: key, count: countByCollision[key] };
  });

  return countData
}