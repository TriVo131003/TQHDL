const Traffic_Accidents_Path = '../assets/data/Traffic_Accidents.csv'

d3.csv(Traffic_Accidents_Path).then(function(data) {
  // Khúc này xử lý data, tùy theo yêu cầu mà viết hàm xử lý thui
  var countData = countByCity(data)

  // Thiết lập kích thước của biểu đồ
  var width = 1440;
  var height = 400;
  var margin = {top: 20, right: 20, bottom: 50, left: 80};

  // Tạo một đối tượng SVG và thiết lập kích thước
  var svg = d3.select("#chart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Thiết lập scale cho trục x và y
  var x = d3.scaleBand()
    .domain(countData.map(function(d) { return d.city; }))
    .range([0, width])

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
    .attr("x", function(d) { return x(d.city) + (x.bandwidth()) / 4; })
    .attr("y", function(d) { return y(d.count); })
    .attr("width", x.bandwidth() / 2)
    .attr("height", function(d) { return height - y(d.count); })
    .attr("fill", function(d, i) { 
      // Chọn màu theo chỉ số của cột
      return [
        "#1f77b4", // Xanh dương
        "#ff7f0e", // Cam
        "#2ca02c", // Xanh lá cây
        "#d62728", // Đỏ
        "#9467bd", // Tím
        "#8c564b", // Nâu
        "#e377c2", // Hồng
        "#7f7f7f", // Xám
        "#bcbd22", // Vàng
        "#17becf"  // Xanh nước biển
      ][i];
  });
  
  // Thêm label phía trên của mỗi cột
  svg.selectAll(".text")
  .data(countData)
  .enter().append("text")
  .attr("class", "label")
  .attr("x", function(d) { return x(d.city) + x.bandwidth() / 2; })
  .attr("y", function(d) { return y(d.count) - 5; }) // Dịch lên một chút để tránh chồng chéo
  .text(function(d) { return d.count; })
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("fill", "black");

  // Thêm tên cho trục x
  svg.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 15) + ")")
  .style("text-anchor", "middle")
  .style("color", "red")
  .text("City");

  // Thêm tên cho trục y
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -70)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Number of Accidents");
}).catch(function(error) {
  console.error("Error loading the data: " + error);
});

function countByCity(data) {
  var countByCity = {};

  // Lặp qua dữ liệu và đếm số lượng hàng cho mỗi thành phố
  data.forEach(function(d) {
    var city = d["City"];
    countByCity[city] = (countByCity[city] || 0) + 1;
  });

  // Chuyển đổi đối tượng thành mảng các đối tượng [{city: key, count: value}]
  var countData = Object.keys(countByCity).map(function(key) {
    return { city: key, count: countByCity[key] };
  });

  return countData.slice(0,10);
}


// CHART 2

d3.csv(Traffic_Accidents_Path).then(function(data) {
  // Khúc này xử lý data, tùy theo yêu cầu mà viết hàm xử lý thui
  var countData = countByWeather(data)

  // Thiết lập kích thước của biểu đồ
  var width = 1440;
  var height = 400;
  var margin = {top: 20, right: 20, bottom: 50, left: 80};

  // Tạo một đối tượng SVG và thiết lập kích thước
  var svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Thiết lập scale cho trục x và y
  var x = d3.scaleBand()
    .domain(countData.map(function(d) { return d.weather; }))
    .range([0, width])

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
    .attr("x", function(d) { return x(d.weather) + (x.bandwidth()) / 4; })
    .attr("y", function(d) { return y(d.count); })
    .attr("width", x.bandwidth() / 2)
    .attr("height", function(d) { return height - y(d.count); })
    .attr("fill", function(d, i) { 
      // Chọn màu theo chỉ số của cột
      return [
        "#1f77b4", // Xanh dương
        "#ff4c4c", // Đỏ hồng
        "#339933", // Xanh lá cây đậm
        "#ffcc00", // Vàng
        "#993399"  // Màu mận chín
      ][i];
  });
  
  // Thêm label phía trên của mỗi cột
  svg.selectAll(".text")
  .data(countData)
  .enter().append("text")
  .attr("class", "label")
  .attr("x", function(d) { return x(d.weather) + x.bandwidth() / 2; })
  .attr("y", function(d) { return y(d.count) - 5; }) // Dịch lên một chút để tránh chồng chéo
  .text(function(d) { return d.count; })
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("fill", "black");

  // Thêm tên cho trục x
  svg.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 15) + ")")
  .style("text-anchor", "middle")
  .style("color", "red")
  .text("Weather Description");

  // Thêm tên cho trục y
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -70)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Number of Accidents");
}).catch(function(error) {
  console.error("Error loading the data: " + error);
});


function countByWeather(data) {
  var countByWeather = {};

  // Lặp qua dữ liệu và đếm số lượng hàng cho mỗi thành phố
  data.forEach(function(d) {
    var weather = d["Weather Description"];
    if (weather && weather !== 'UNKNOWN')
      countByWeather[weather] = (countByWeather[weather] || 0) + 1;
  });

  // Chuyển đổi đối tượng thành mảng các đối tượng [{weather: key, count: value}]
  var countData = Object.keys(countByWeather).map(function(key) {
    return { weather: key, count: countByWeather[key] };
  });

  countData = countData.sort((a,b) => b.count - a.count)

  return countData.slice(0,5);
}