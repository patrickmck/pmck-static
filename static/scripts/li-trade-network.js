
const fig_width = 800
const fig_height = 500
let transition_duration = 500

let trade_year = d3.select('#li-trade-year-input').node().value;
let data = {nodes: null, links: null};

let product_code = '333444'

fetch(`https://frklvrq4cj.execute-api.ap-southeast-2.amazonaws.com/testing/product?hs_code=${product_code}`, {method: "GET"})
    .then(response => response.json())
    .then(d => {
        console.log(d.statusCode)
        data = JSON.parse(d.body)
        update_li_network()
    })
    .catch(error => console.log(error))


// Expecting trade volumes to take arbitrary non-negative values, construct scales
// for both bubbles (entity total volume) and links (pairwise volume)
let bubble_min_size = 5
let bubble_max_size = 50
let bubblescaler = data => d3.scaleLinear()
    .domain([Math.min(...data.nodes.map(n => n.volume[trade_year])), Math.max(...data.nodes.map(n => n.volume[trade_year]))])
    .range([bubble_min_size, bubble_max_size]);

let edgeline_min_size = 1
let edgeline_max_size = 10
let edgelinescaler = data => d3.scaleLinear()
    .domain([Math.min(...data.links.map(l => l.volume[trade_year])), Math.max(...data.links.map(l => l.volume[trade_year]))])
    .range([edgeline_min_size, edgeline_max_size]);

// Nodes are assigned a "type" between 0 (importer) and 1 (exporter) so the colour
// scale should be divergent with the midway colour corresponding to a type of 0.5
let colourScale = d3.scaleOrdinal(d3.schemeTableau10)

// Geographical projection to translate (lon,lat) into (x,y) coordinates
let geoScale = d3.geoMercator()
    .center([35,0])
    .translate([fig_width/2, fig_height/2])


// Set up base selection and append a blank svg
let fig = d3.select("#li-trade-fig")
    .append('svg')
    .attr('width', fig_width)
    .attr('height', fig_height)

let force_simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-1000))
    // .force("center", d3.forceCenter().x(300).y(300))
    .force("collision", d3.forceCollide().radius(d => 1.2*(d.r)))
    .force("x", d3.forceX().x(d => d.xpos))
    .force("y", d3.forceY().y(d => d.ypos))
    // .size([fig_width, fig_height])
    .on('tick', updateNetworkSim)

function updateNetworkSim() {
    d3.selectAll("circle.netnode")
        .attr("cx", d => Math.min(Math.max(d.x, d.r), fig_width - d.r))
        .attr("cy", d => Math.min(Math.max(d.y, d.r), fig_height - d.r))
    d3.selectAll("text.nodetxt")
        .attr("x", d => Math.min(Math.max(d.x, d.r), fig_width - 1.5*d.r))
        .attr("y", d => Math.min(Math.max(d.y, d.r), fig_height - 1.5*d.r)+20)
    d3.selectAll("line.netlink")
        .attr("x1", d => Math.min(Math.max(d.source.x, d.source.r), fig_width - d.source.r))
        .attr("x2", d => Math.min(Math.max(d.target.x, d.target.r), fig_width - d.target.r))
        .attr("y1", d => Math.min(Math.max(d.source.y, d.source.r), fig_height - d.source.r))
        .attr("y2", d => Math.min(Math.max(d.target.y, d.target.r), fig_height - d.target.r))
}

let node_data;
let edge_data;
let findNode;

d3.select("#li-trade-year-input").on('input', update_li_network)

function update_li_network() {
    // console.log(data)
    trade_year = d3.select('#li-trade-year-input').node().value

    nodescale = bubblescaler(data)
    linkscale = edgelinescaler(data)

    /**
    For lines to appear below circles, they have to be drawn first. To avoid
    drawing newly-appearing lines on top of already-existing circles, they'll
    all get drawn at once.
    
    If any line/circle should _not_ be visible to the user, its thickness/radius
    will simply be set to zero, rendering useless the enter() and exit() methods
    in the d3 general update pattern.

     */

    node_data = data.nodes.reduce((accum, node) => {
        // Translate the geographic coordinates to svg coordinates
        let coords = geoScale([node.lon, node.lat])
        let xpos = coords[0]
        let ypos = coords[1]
        // Check whether a circle already exists on the DOM for this node
        // (see findNode below) and if so, pull across current (x,y) values
        prevNode = findNode ? findNode[node.id] : undefined
        if(prevNode) {
            accum.push({
                // id: node.id,
                r: node.volume[trade_year] ? nodescale(node.volume[trade_year]) : 0,
                name: node.name,
                x: prevNode.x,
                y: prevNode.y,
                xpos: xpos,
                ypos: ypos,
                type: node.type[trade_year]
            })
        }
        else {
            // This node is newly introduced, so just use the
            // canonical (x.y) positions as the start values
            accum.push({
                // id: node.id,
                r: node.volume[trade_year] ? nodescale(node.volume[trade_year]) : 0,
                name: node.name,
                x: xpos,
                y: ypos,
                xpos: xpos,
                ypos: ypos,
                type: node.type[trade_year]
            })
        }
        return accum
    }, [])

    // When updating the start and end points for drawing edge lines, we
    // will need access to the actual objects at the start and end nodes,
    // to fetch their current positions in the DOM.
    findNode = node_data.reduce((findarray, node) => {
        findarray[node.name] = node;
        return findarray
    }, {})
    

    // Construct edge data similar to nodes, but edges only have volume
    // when source and target nodes both have non-zero radius
    edge_data = data.links.reduce((accum, link) => {
        let source_node = findNode[link.source]
        let target_node = findNode[link.target]
        // console.log(node_data)
        // console.log(findNode)
        // console.log(source_node)
        // console.log(target_node)
        let show_edge = (source_node.r * target_node.r) > 0
        accum.push({
                id: `${link.source}-${link.target}`,
                source: source_node,
                target: target_node,
                strength: show_edge ? linkscale(link.volume[trade_year]) : 0
            })
        return accum
    }, [])


    // Perform edge select-join-update before nodes and labels, so that
    // graph lines appear underneath the bubbles and are hidden by them
    
    let edgeSelect = fig.selectAll("line.netlink")
        .data(edge_data, d => d.id)
        .join(
            (enter) => {
                return enter
                    .append('line')
                    .attr('class', 'netlink')
                    .style('stroke', 'black')
                    .style('stroke-width', 0)
                    .attr("x1", e => e.source.x)
                    .attr("x2", e => e.target.x)
                    .attr("y1", e => e.source.y)
                    .attr("y2", e => e.target.y)
            },
            (update) => {
                return update
            },
            (exit) => {
                return exit
                    .transition()
                    .duration(transition_duration)
                    .style('stroke-width', 0)
                    .remove()
            }
        )
        .transition()
        .duration(transition_duration)
        .style('stroke-width', d => d.strength)


    let nodeSelect = fig.selectAll("circle.netnode")
        .data(node_data, d => d.name)
        .join(
            (enter) => {
                return enter
                    .append('circle')
                    .attr('class', 'netnode')
                    .attr('fill', d => d3.interpolateViridis(d.type))
            },
            (update) => {
                return update
            },
            (exit) => {
                return exit
                    .transition()
                    .duration(transition_duration)
                    .attr('r', 0)
                    .remove()
            }
        )
        .transition()
        .duration(transition_duration)
        .attr('r', d => d.r)

    let textSelect = fig.selectAll("text.nodetxt")
        .data(node_data, d => `${d.name}-txt`)
        .join(
            (enter) => {
                return enter
                    .append('text')
                    .attr('class', 'nodetxt')
                    // .attr('x', d => d.x)
                    // .attr('y', d => d.y + d.r + 2)
                    // .attr('fill', d => d3.interpolateViridis(d.type))
            },
            (update) => {
                return update
            },
            (exit) => {
                return exit
                    .transition()
                    .duration(transition_duration)
                    .remove()
            }
        )
        .transition()
        .duration(transition_duration)
        .text(d => d.name)
        .style('font-size', '0.8em')

    // Reset the force simulation to take account of the new data
    force_simulation.force('x').initialize(node_data)
    force_simulation.force('y').initialize(node_data)
    force_simulation.force('collision').initialize(node_data)
    force_simulation.nodes(node_data)
    force_simulation.alpha(0.8).restart();
}
