d3.csv("../assets/data/Traffic_Accidents.csv").then(function(data) {
  // Khúc này xử lý data, tùy theo yêu cầu mà viết hàm xử lý thui
  var countData = convertData1(data)

  // Thiết lập kích thước của biểu đồ
  var width = 340;
  var height = 400;
  var margin = {top: 20, right: 20, bottom: 60, left: 100};

  // Tạo một đối tượng SVG và thiết lập kích thước
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Thiết lập scale cho trục x và y
  var x = d3.scaleBand()
    .domain(countData.map(function(d) { return d.weather; }))
    .range([0, width])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([0, d3.max(countData, function(d) { return d.count; })])
    .nice()
    .range([height, 0]);

  // Tạo trục x và y
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .attr("class", "xlabel")
    .attr("x", width / 2)
    .attr("y", margin.bottom-5)
    .style("font-size", "16px")
    .style("fill", "black")
    .text("City");

  svg.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("class", "ylabel")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "black")
    .text("Number of Accidents");

    

  // Vẽ các cột
  svg.selectAll(".bar")
    .data(countData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return (x(d.weather) + x.bandwidth() / 4); })
    .attr("y", function(d) { return y(d.count); })
    .attr("width", x.bandwidth() - 50)
    .attr("height", function(d) { return height - y(d.count); })
    .attr('fill', 'orange'); // Chọn màu sắc cho từng cung
  
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
}).catch(function(error) {
  console.error("Error loading the data: " + error);
});



const convertData1 = (data) => {
  // Tạo một đối tượng để lưu trữ số lượng sự cố cho từng loại thành phố
  var countByCity = {};

  // Tính số lượng sự cố cho từng loại thành phố
  data.forEach(function(d) {
    // Tách ngày, tháng và năm từ cột "Date and Time"
    var dateParts = d["Date and Time"].split('/');
    var month = parseInt(dateParts[0], 10); // Lấy tháng từ phần tử thứ nhất trong mảng
    var day = parseInt(dateParts[1], 10); // Lấy ngày từ phần tử thứ hai trong mảng
    var year = parseInt(dateParts[2], 10); // Lấy năm từ phần tử thứ ba trong mảng
    var city = d["City"];

    // Kiểm tra tháng, ngày và năm
    if (month === 9 && year === 2021 && (city === "NASHVILLE" || city === "ANTIOCH" || city === "OLD HICKORY")) {
      var key = city;
      countByCity[key] = (countByCity[key] || 0) + 1;
    }
  });

  // Chuyển đổi đối tượng thành mảng các đối tượng [{: key, count: value}]
  var countData = Object.keys(countByCity).map(function(key) {
    return { weather: key, count: countByCity[key] };
  });

  return countData
}



// Biểu đồ tròn nè keo




d3.csv("../assets/data/Traffic_Accidents.csv").then(function(data) {
  // Xử lý dữ liệu ở đây
  var countData = convertData2(data); // Chuyển đổi dữ liệu thành dạng phù hợp

  // Lọc các phần tử có phần trăm lớn hơn hoặc bằng 5%
  var filteredData = countData.filter(function(d) {
    return d.count >= 5;
  });

  // Tính tổng phần trăm các phần tử nhỏ hơn 5%
  var smallPercentageTotal = 0;
  countData.forEach(function(d) {
    if (d.count < 5) {
      smallPercentageTotal += +d.count;
    }
  });

  // Thêm phần tử tổng vào dữ liệu
  if (smallPercentageTotal > 0) {
    filteredData.push({ weather: "Other", count: smallPercentageTotal.toFixed(2) });
  }

  // Thiết lập kích thước của biểu đồ
  var width = 600;
  var height = 600;
  var radius = Math.min(width, height) / 2; // Bán kính của biểu đồ

  // Tạo một đối tượng SVG và thiết lập kích thước
  var svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); // Dịch chuyển gốc tọa độ tới trung tâm của SVG

  // Thiết lập scale màu sắc
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // Thiết lập pie layout để chuyển đổi dữ liệu thành dạng phù hợp cho biểu đồ pie chart
  var pie = d3.pie()
    .value(function(d) { return d.count; });

  var data_ready = pie(filteredData); // Áp dụng pie layout cho dữ liệu đã lọc

  // Vẽ các cung
  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius); // Thiết lập bán kính trong và ngoài cho các cung

  // Vẽ các cung của biểu đồ pie chart
  svg.selectAll('path')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc) // Tạo đường d cho các cung
    .attr('fill', function(d) {
      // Chọn màu sắc cho từng cung
      return (d.data.weather === "Other") ? "gray" : color(d.data.weather);
    })
    .attr("stroke", "white") // Thiết lập màu viền cho các cung
    .style("stroke-width", "2px"); // Thiết lập độ dày của viền

  // Thêm nhãn cho các phần tử
  svg.selectAll('text')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function(d) { return +d.data.count + "%"; }) // Hiển thị tên và phần trăm
    .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; }) // Đặt vị trí của nhãn
    .style('text-anchor', 'middle'); // Canh giữa văn bản
}).catch(function(error) {
  console.error("Error loading the data: " + error);
});

// Hàm chuyển đổi dữ liệu từ dạng ban đầu thành dạng phù hợp cho biểu đồ pie chart
const convertData2 = (data) => {
  // Tạo một đối tượng để lưu trữ số lượng sự cố cho từng loại thời tiết
  var countByIllumination = {};

  // Tính tổng số lượng sự cố
  var totalCount = data.length;

  // Tính số lượng sự cố cho từng loại thời tiết
  data.forEach(function(d) {
    var key = d["Illumination Description"];
    countByIllumination[key] = (countByIllumination[key] || 0) + 1;
  });

  // Chuyển đổi đối tượng thành mảng các đối tượng [{weather: key, count: value}]
  var countData = Object.keys(countByIllumination).map(function(key) {
    // Tính tỷ lệ phần trăm
    var percentage = (countByIllumination[key] / totalCount) * 100;
    return { weather: key, count: percentage.toFixed(2) }; // Làm tròn đến 2 chữ số sau dấu thập phân
  });

  return countData;
}
