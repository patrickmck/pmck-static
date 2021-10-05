
const fig_width = 500
const fig_height = 500
let transition_duration = 500

let trade_year;
let data = {nodes: null, links: null};
d3.json('test-network-data.json').then((d) => {data = d; update_network()})


// Expecting trade volumes to take arbitrary non-negative values, construct scales
// for both bubbles (entity total volume) and links (pairwise volume)
let bubble_min_size = 5
let bubble_max_size = 50
let bubblescaler = data => d3.scaleLinear()
    .domain([Math.min(...data.nodes.map(n => n.total[trade_year])), Math.max(...data.nodes.map(n => n.total[trade_year]))])
    .range([bubble_min_size, bubble_max_size]);

let edgeline_min_size = 1
let edgeline_max_size = 10
let edgelinescaler = data => d3.scaleLinear()
    .domain([Math.min(...data.links.map(l => l.volume[trade_year])), Math.max(...data.links.map(l => l.volume[trade_year]))])
    .range([edgeline_min_size, edgeline_max_size]);

let colourScale = d3.scaleOrdinal(d3.schemeTableau10)

// Set up base selection and append a blank svg
let fig = d3.select("#test-network-fig")
    .append('svg')
    .attr('width', fig_width)
    .attr('height', fig_height)

let force_simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-40))
    // .force("center", d3.forceCenter().x(300).y(300))
    .force("collision", d3.forceCollide().radius(d => 1.2*(d.r)))
    .force("x", d3.forceX().x(d => d.xpos))
    .force("y", d3.forceY().y(d => d.ypos))
    .on('tick', updateNetworkSim)

function updateNetworkSim() {
    d3.selectAll("circle.netnode2")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
    d3.selectAll("line.netlink2")
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y)
}

let node_data;
let edge_data;
let findNode;

d3.select("#test-net-year-input").on('input', update_network)

function update_network() {
    // console.log(data)
    trade_year = d3.select('#test-net-year-input').node().value

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
        // Check whether a circle already exists on the DOM for this node
        // (see findNode below) and if so, pull across current (x,y) values
        prevNode = findNode ? findNode[node.id] : undefined
        if(prevNode) {
            accum.push({
                id: node.id,
                r: node.total[trade_year] ? nodescale(node.total[trade_year]) : 0,
                name: node.name,
                x: prevNode.x,
                y: prevNode.y,
                xpos: node.xpos,
                ypos: node.ypos
            })
        }
        else {
            // This node is newly introduced, so just use the
            // canonical (x.y) positions as the start values
            accum.push({
                id: node.id,
                r: node.total[trade_year] ? nodescale(node.total[trade_year]) : 0,
                name: node.name,
                x: node.xpos,
                y: node.ypos,
                xpos: node.xpos,
                ypos: node.ypos
            })
        }
        return accum
    }, [])

    // When updating the start and end points for drawing edge lines, we
    // will need access to the actual objects at the start and end nodes,
    // to fetch their current positions in the DOM.
    findNode = node_data.reduce((findarray, node) => {
        findarray[node.id] = node;
        return findarray
    }, {})
    

    // Construct edge data similar to nodes, but edges only have volume
    // when source and target nodes both have non-zero radius
    edge_data = data.links.reduce((accum, link) => {
        let source_node = findNode[link.source]
        let target_node = findNode[link.target]
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
    
    let edgeSelect = fig.selectAll("line.netlink2")
        .data(edge_data, d => d.id)
        .join(
            (enter) => {
                return enter
                    .append('line')
                    .attr('class', 'netlink2')
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


    let nodeSelect = fig.selectAll("circle.netnode2")
        .data(node_data, d => d.name)
        .join(
            (enter) => {
                return enter
                    .append('circle')
                    .attr('class', 'netnode2')
                    .attr('fill', d => colourScale(d.id))
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


    // Reset the force simulation to take account of the new data
    force_simulation.force('x').initialize(node_data)
    force_simulation.force('y').initialize(node_data)
    force_simulation.force('collision').initialize(node_data)
    force_simulation.nodes(node_data)
    force_simulation.alpha(0.8).restart();
}






/**
 * Notes/references
 * 
 * 
 * General update pattern in d3
 * https://bl.ocks.org/mbostock/3808234
 * 
 * Modifying a force layout
 * https://bl.ocks.org/mbostock/1095795
 * 
 * Fixing jumpiness with new data
 * https://stackoverflow.com/questions/48087984/how-to-smoothly-update-a-d3-v4-force-diagram-with-new-data
 * 
 * Re-initialising forces w/ radius
 * https://stackoverflow.com/questions/57277281/d3-how-to-update-force-simulation-when-data-values-change
 * 
 * 
 */