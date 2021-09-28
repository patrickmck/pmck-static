

const make_li_trade_network = data => {

    const fig_width = 800
    const fig_height = 600

    let roleScale = d3.scaleOrdinal(d3.schemeTableau10)

    
    let trade_type = d3.select('#li-trade-type-input').node().value
    update_trade_type = () => {trade_type = d3.select('#li-trade-type-input').node().value; console.log(trade_type);}
    d3.select("#li-trade-type-input").on('change', update_trade_type)

    let trade_year = d3.select('#li-trade-year-input').node().value
    update_trade_year = () => {trade_year = d3.select('#li-trade-year-input').node().value; console.log(trade_year);}
    d3.select("#li-trade-year-input").on('input', update_trade_year)
    
    let global_total = data.nodes.reduce((a,x) => a + x.export_total, 0)
    

    // Expecting trade volumes to take arbitrary non-negative values, construct scales
    // for both bubbles (entity total volume) and links (pairwise volume)
    let bubble_min_size = 5
    let bubble_max_size = 50
    let bubblescale = d3.scaleLinear()
        .domain([Math.min(...data.nodes.map(n => n.export_total)), Math.max(...data.nodes.map(n => n.export_total))])
        .range([bubble_min_size, bubble_max_size]);
    
    let edgeline_min_size = 0.1
    let edgeline_max_size = 10
    let edgelinescale = d3.scaleLinear()
        .domain([Math.min(...data.links.map(l => l.volume)), Math.max(...data.links.map(l => l.volume))])
        .range([edgeline_min_size, edgeline_max_size]);

    let sampleData = data.nodes.map(node => ({
        id: node.id,
        r: bubblescale(node.export_total),
        name: node.name
    }))

    // When updating the start and end points for drawing edge lines, we
    // will need access to the actual objects at the start and end nodes,
    // to fetch their current positions in the DOM.
    // This is an array where indexing by a node's numeric ID will take
    // you to a pointer for that node's object, to access its properties.
    let findNode = sampleData.reduce((findarray, node) => {
        findarray[node.id] = node;
        return findarray
    }, {})

    let edgeData = data.links.map(link => ({
        id: `${link.source}-${link.target}`,
        source: findNode[link.source],
        target: findNode[link.target],
        strength: edgelinescale(+link.volume)
    }))

    // data.links.forEach(e => {
    //     console.log(e)
    //     let source = e.source
    //     console.log(source)
    // })

    let sim = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-40))
        .force("center", d3.forceCenter().x(300).y(300))
        // .force("collision", d3.forceCollide(d => d.r))
        .force("link", d3.forceLink())
        .nodes(sampleData)
        .on("tick", updateNetwork);

    // sim.force("link").links(edgeData)

    let fig = d3.select("#li-trade-fig")
        .append('svg')
        .attr('width', fig_width)
        .attr('height', fig_height)

    let lineEnter = fig.selectAll("line.netlink")
        .data(edgeData, e => e.connection)
        .enter()
        .append("line")
            .attr("class", "netlink")
            .style("stroke", "black")
            .style("stroke-width", e => e.strength);

    let nodeEnter = fig.selectAll("g.netnode")
        .data(sampleData, d => d.id)
        .enter()
        .append("g")
            .attr("class", "netnode");
    
    nodeEnter.append("circle")
        .style("fill", (d, i) => roleScale(i))
        .attr("r", d => d.r);

    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", d => d.r-5)
        .attr("x", d => d.r+15)
        .attr("font-size", "0.8em")
        .text(d => d.name);


    function updateNetwork() {
        d3.selectAll("g.netnode")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            // .attr("cx", d => d.x)
            // .attr("cy", d => d.y)
        d3.selectAll("line.netlink")
            .attr("x1", d => d.source.x)
            .attr("x2", d => d.target.x)
            .attr("y1", d => d.source.y)
            .attr("y2", d => d.target.y)
    }

}

d3.json('li-trade-data.json').then(make_li_trade_network);