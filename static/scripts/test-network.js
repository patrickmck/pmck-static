
const fig_width = 500
const fig_height = 500

let trade_year;
let transition_duration = 500

let roleScale = d3.scaleOrdinal(d3.schemeTableau10)

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
    // .force("link", d3.forceLink())

function updateNetworkSim() {
    d3.selectAll("circle.netnode")
        // .attr("transform", d => `translate(${d.x},${d.y})`)
        .attr("cx", d => d.xpos)
        .attr("cy", d => d.ypos)
    d3.selectAll("line.netlink")
        .attr("x1", d => d.source.xpos)
        .attr("x2", d => d.target.xpos)
        .attr("y1", d => d.source.ypos)
        .attr("y2", d => d.target.ypos)
        // .attr("x1", d => d.source.x)
        // .attr("x2", d => d.target.x)
        // .attr("y1", d => d.source.y)
        // .attr("y2", d => d.target.y)
}


update_test_network_data = () => {
    // Get the current input from the slider
    trade_year = d3.select('#test-net-year-input').node().value
    // Handle the external display of this value
    d3.selectAll('.test-year-display')
        .remove()
    d3.select('#test-net-year-input-display')
        .append('text')
        .attr('class', 'test-year-display')
        .attr("text-anchor", "middle")
        .text(trade_year)
    
    // Read data, then pass it to the update function
    d3.json('test-network-data.json').then(update_test_network)
}

update_test_network = (data) => {
    
    // console.log(trade_year)
    // console.log(data.nodes.map((i) => `${i.name}=${i.total[trade_year]}`))
    
    let global_total = data.nodes.reduce((a,x) => a + x.total[trade_year], 0)

    let bubblescale = bubblescaler(data)
    let edgelinescale = edgelinescaler(data)

    // Construct array of nodes/bubbles
    let nodeData = data.nodes.reduce((accum, node) => {
        if(node.total[trade_year] > 0) {
            accum.push({
                id: node.id,
                r: bubblescale(node.total[trade_year]),
                name: node.name,
                xpos: node.xpos,
                ypos: node.ypos
            })
        }
        return accum
    }, [])

    // Reset network forces to account for new node data
    force_simulation
        .alpha(1).restart()
        .nodes(nodeData)
        .on("tick", updateNetworkSim);

    // When updating the start and end points for drawing edge lines, we
    // will need access to the actual objects at the start and end nodes,
    // to fetch their current positions in the DOM.
    // This is an array where indexing by a node's numeric ID will take
    // you to a pointer for that node's object, to access its properties.
    let findNode = nodeData.reduce((findarray, node) => {
        findarray[node.id] = node;
        return findarray
    }, {})

    // Construct array of edges/lines
    let edgeData = data.links.reduce((accum, link) => {
        let source_node = findNode[link.source]
        let target_node = findNode[link.target]
        if(source_node && target_node) {
            accum.push({
                id: `${link.source}-${link.target}`,
                source: source_node,
                target: target_node,
                strength: edgelinescale(link.volume[trade_year])
            })
        }
        return accum
    }, [])

    // Draw lines first so they appear beneath the nodes
    let lineSelect = fig.selectAll("line.netlink")
    lineSelect
        .data(edgeData, d => d.id)
        .join(
            (enter) => {
                return enter
                    .append('line')
                    .attr("class", "netlink")
                    .style("stroke", "black")
                    // initially at 0 to support transitions
                    .style('stroke-width', 0)
                    .attr("x1", e => e.source.xpos)
                    .attr("x2", e => e.target.xpos)
                    .attr("y1", e => e.source.ypos)
                    .attr("y2", e => e.target.ypos)
            },
            (update) => {
                return update
            },
            (exit) => {
                return exit
                    .transition()
                    .duration(transition_duration)
                    .style('stroke-width', 0)
                    // to keep lines underneath other objects,
                    // don't actually remove them at exit
                    // .remove()
            }
        )
        .transition()
        .duration(transition_duration)
        .style('stroke-width', e => e.strength)


    // Separate nodes and node text, to avoid grouped join calls
    let nodeSelect = fig.selectAll("circle.netnode")
    nodeSelect
        .data(nodeData, d => d.name)
        .join(
            (enter) => {
                // console.log('enter')
                // console.log(enter)
                return enter
                    .append('circle')
                        .attr('class', 'netnode')
                        .style('fill', (d, i) => roleScale(i))
                        .style('opacity', 0) // for transitions
            },
            (update) => update,
            (exit) => {
                // console.log('exit')
                // console.log(exit)
                return exit
                    .transition()
                    .duration(transition_duration)
                    .attr('r', 0)
                    .remove()
            }
        )
        .transition()
        .duration(transition_duration)
        .style('opacity', 1)
        .attr('r', d => d.r)
    
    textSelect = fig.selectAll('text.nodetext')
    textSelect
        .data(nodeData, d => `${d.name}-txt`)
        .join(
            (enter) => {
                return enter
                    .append('text')
                        .attr('class', 'nodetext')
                        .style("text-anchor", "middle")
                        .style('opacity', 0)
                        .attr("font-size", "0.8em")
                        .attr("y", d => d.ypos + d.r + 15)
                        .attr("x", d => d.xpos)
                        .text(d => d.name)
            },
            (update) => update,
            (exit) => {
                return exit
                    .transition()
                    .duration(transition_duration)
                    .style('opacity', 0)
                    .remove()
            }
        )
        .transition()
        .duration(transition_duration)
        .style('opacity', 1)
        .attr("y", d => d.ypos + d.r + 15)
        .attr("x", d => d.xpos)

}


update_test_network_data()

d3.select("#test-net-year-input").on('input', update_test_network_data)



/**
 * 
 * 
 * Grouped join calls attempt ...

    let nodeEnter = (enter) => {
        enter.append('g').attr('class','nodegroup')

        // .call(g => {console.log('enter'); console.log(g)})
        .call(g => g
            .append('circle')
                .attr('class', 'netnode')
                .style('fill', (d, i) => roleScale(i))
                // .style('opacity', 0) // for transitions
                // .transition().duration(transition_duration)
                // .style('opacity', 1)
                .attr('r', d => {console.log(`${d.name}: ${d.r}`); return d.r})
        )
        // .call(g => g
        //     .selectAll('circle.netnode')
        //     .transition().duration(transition_duration)
        //     // .style('opacity', 1)
        //     .attr('r', d => d.r)
        // )
        .call(g => g
            .append('text')
                .attr('class', 'nettext')
                .attr('x', d => d.xpos + d.r + 5)
                .attr('y', d => d.ypos + d.r + 5)
                .attr('font-size', '0.6em')
                .text(d => d.name)
        )
    }
    // console.log(fig.selectAll('circle.netnode'))
    let nodeUpdate = (update) => {
        console.log(nodeData)
        // console.log(update.call(g => g.selectAll('g.nodegroup.circle.netnode')))
        // update.call(g => g.transition().duration(transition_duration))
        update
        .call(g => {console.log('update'); console.log(g.selectAll('circle.netnode'))})
        update
        .call(g => g
            .selectAll('circle.netnode')
            // .transition().duration(transition_duration)
            .attr('r', d => {console.log(`${d.name}: ${d.r}`); return d.r})
        )
        .call(g => g
            .selectAll('text.nettext')
            // .transition().duration(transition_duration)
            .attr('x', d => d.xpos + d.r + 5)
            .attr('y', d => {console.log(d); return d.ypos + d.r + 5})
        )
    }

    let nodeExit = (exit) => {
        exit.call(g => g
            .selectAll('circle.netnode')
            .transition().duration(transition_duration)
            .attr('r', 0)
            .remove()
        )
        .call(g => g
            .selectAll('text.nettext')
            .transition().duration(transition_duration)
            .style('opacity', 0)
            .remove()
        )
        exit.call(g => g.remove())
    }
 */



    // // ~~ code from before finding the .join pattern ~~ //
    // nodeSelect.attr('class', 'update')
    //     .attr("r", d => d.r)
    
    // let nodeEnter = nodeSelect.enter()
    //     .append("g")
    //         .attr("class", "netnode");
    // // console.log(nodeEnter)
    // nodeEnter.append("circle")
    //     .style("fill", (d, i) => roleScale(i))
    //     .merge(nodeEnter)
    //         .attr("r", d => d.r);

    // nodeEnter.append("text")
    //     .style("text-anchor", "middle")
    //     .attr("y", d => d.r-2)
    //     .attr("x", d => d.r+5)
    //     .attr("font-size", "0.6em")
    //     .text(d => d.name);
    
    // nodeSelect.exit()
    //     .attr('class', 'exit')
    //     .remove()