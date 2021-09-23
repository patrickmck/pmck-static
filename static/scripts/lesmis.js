
console.log('Lez Miz!')

const margin = {top: 10, right: 30, bottom: 30, left: 40}

const triangle_fig = d3.select('#trifig')
    .attr('width', 500)
    .attr('height', 500)
    .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

d3.json('triangle.json').then(input_data => {
    console.log(input_data)

    triangle_fig.selectAll('points')
        .data(input_data.nodes)
        .enter()
        .append('circle')
        .attr('x', n => {return 50*n.id})
        .attr('y', n => {return 100*n.id})
        .attr('r', 30)
})