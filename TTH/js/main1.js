d3.csv("../assets/data/Traffic_Accidents.csv").then(function(data) {
    // lọc dữ liệu vào năm 2019  
    var filteredData = data.filter(function(d) {
      year = new Date(d["Date and Time"]).getFullYear();
      return year === 2019;
    });
  
    // Tạo một đối tượng để lưu trữ số vụ tai nạn theo loại va chạm
    var countByCollision = {};
  
    filteredData.forEach(function(d) {
      var key = d["Collision Type Description"];
      countByCollision[key] = (countByCollision[key] || 0) + 1;
    });
  
    // Chuyển đổi đối tượng thành mảng các đối tượng [{collision: key, count: value}]
    var countData = Object.keys(countByCollision).map(function(key) {
      return { collision: key, count: countByCollision[key] };
    });
    
    // sắp xếp dữ liệu giảm dần và lấy top 5
    countData.sort(function(a, b) {
      return b.count - a.count;
    });
  
    var topFiveData = countData.slice(0, 5);
  
    // Thiết lập kích thước của biểu đồ
    var margin = { top: 20, right: 30, bottom: 100, left: 100 };
    var width = 800 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
  
    // Tạo một đối tượng SVG và thiết lập kích thước
    var svg = d3.select("#chart2")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // Thiết lập scale cho trục x và y
    var x = d3.scaleBand()
      .domain(topFiveData.map(function(d) { return d.collision; }))
      .range([0, width])
      .padding(0.1);
  
    var y = d3.scaleLinear()
      .domain([0, d3.max(topFiveData, function(d) { return d.count; })])
      .nice()
      .range([height, 0]);
  
    // Tạo trục x và y
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
       
  
    svg.append("g")
      .call(d3.axisLeft(y));
      
  
    // Vẽ các cột
    svg.selectAll(".bar")
      .data(topFiveData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return (x(d.collision) + x.bandwidth() / 4); })
      .attr("y", function(d) { return y(d.count); })
      .attr("width", x.bandwidth()/2)
      .attr("height", function(d) { return height - y(d.count); })
      .attr("fill", "orange");
    
    // Thêm label phía trên của mỗi cột
    svg.selectAll(".text")
    .data(topFiveData)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", function(d) { return x(d.collision) + x.bandwidth() / 2; })
    .attr("y", function(d) { return y(d.count) - 15; })
    .text(function(d) { return d.count; })
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black");
    
  }).catch(function(error) {
    console.error("Error loading the data: " + error);
  });
  