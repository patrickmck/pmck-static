
console.log('Hello?')

const width = 600
const height = 300
const barpadding = 30

xAxis = g => g
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(i => input_data[i].city).tickSizeOuter(0))

const fig = d3.select('#test-barchart-fig')
            .append('svg')
            // .style('border', 'dotted')
            .attr('width', width)
            .attr('height', height);

const clean_csv_data = function(row) {
    return {
        'city': row.city,
        'population': +row.population,
    }
}

const update_bar_graph = function(input_data) {
    let totalpop = 0 
    for (let i = 0; i < input_data.length; i++) {
        totalpop += input_data[i].population
    }
    
    xScale = d3.scaleBand()
               .domain(input_data.map(row => row.city))
               .rangeRound([barpadding, width])
               .paddingInner(0.1)
               .paddingOuter(0.1);
    
    const xAxis = d3.axisBottom(xScale)

    yScale = d3.scaleLinear()
               .domain([0, d3.max(input_data, function(d) {return d.population})])
               .range([height - barpadding, barpadding]);
    
    const yAxis = d3.axisLeft(yScale);

    fig.selectAll('rect')
       .data(input_data)
       .enter()
       .append('rect')
       .attr('x', function(row, ind) {return xScale(row.city)})
       .attr('y', function(row, ind) {return yScale(row.population)})
       .attr('width', xScale.bandwidth())
       .attr('height', function(row) {
           return height - barpadding - yScale(row.population)
       })
       .attr('fill', 'steelblue');
    
    fig.append("g")
       .attr('class', 'axis')
       .attr('transform', `translate(0,${height - barpadding})`)
       .call(xAxis)
}

d3.csv("bar-data.csv", clean_csv_data).then(update_bar_graph);


/**
 * Copied from  http://www.d3noob.org/2014/02/making-bar-chart-in-d3js.html
 * with plenty of changes to account for the v3 -> v4 breaking changes in d3
 * 

const margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
const parseDate = d3.timeFormat("%Y-%m").parse;

const x = d3.scaleBand().rangeRound([0, width]).padding(.05);

const y = d3.scaleLinear().range([height, 0]);

const xAxis = d3.axisBottom()
    .scale(x)
    // .orient("bottom")
    .tickFormat(d3.timeFormat("%Y-%m"));

const yAxis = d3.axisLeft()
    .scale(y)
    // .orient("left")
    .ticks(10);

const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("bar-data.csv", function(data) {

    console.log(Object.ent)
    console.log(Object.keys(data))

    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });
 
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

});

*/