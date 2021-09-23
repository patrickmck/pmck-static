
// console.log('Hello?')


const test_fig_margin = {top: 20, right: 20, bottom: 30, left: 50};
const test_fig_width = 900 - test_fig_margin.left - test_fig_margin.right;
const test_fig_height = 300 - test_fig_margin.top - test_fig_margin.bottom;

const test_xscale = d3.scaleLinear()
    .range([0, test_fig_width])
    .domain([0, 100]);
const test_yscale = d3.scaleLinear()
    .range([test_fig_height, 0])
    .domain([0, 300]);

// xAxis = g => g
//     .attr("transform", `translate(0,${height})`)
//     .call(d3.axisBottom(x).tickFormat(i => input_data[i].city).tickSizeOuter(0))

const test_lvr_text = d3.select('#test-d3inputs-lvr')
    .append('text')
    .attr("text-anchor", "middle")
    .text("...")

const test_pmt_text = d3.select('#test-d3inputs-pmt')
    .append('text')
    .attr("text-anchor", "middle")
    .text("...")

const test_inputs_data = [
    {x: 0, y: 0},
    {x: 100, y: 300}
]

const makeline = d3.line()
    .x(function(d) { return test_xscale(d.x); })
    .y(function(d) { return test_yscale(d.y); });

// test_fig.append('path')
//     .data(test_inputs_data)
//     .attr('class', 'line')
//     .attr('d', makeline);

const update_test_fig = function() {
    
    reload_lvr_text = function() {
        console.log('clicked 1')
        let deposit = +d3.select('#test-input-deposit').node().value
        let homeval = +d3.select('#test-input-value').node().value
        let loanval = homeval - deposit

        let lvr_data = {
            dep: deposit,
            hmv: homeval,
            lvl: loanval
        }

        let new_text = `
        Loan Value: $${loanval} ....

        LVR: ${Math.round(100 * loanval/homeval)}%
        `
        console.log(new_text)

        test_lvr_text.text(new_text)
        return lvr_data
    }

    reload_pmt_text = () => {
        console.log('clicked 2')
        let rate = 1 + 0.01*(+d3.select('#test-input-rate').node().value)
        let period = +d3.select('#test-input-period').node().value
        
        // let lvr_data = 
        let loanval = reload_lvr_text().lvl

        console.log(rate)
        console.log(period)
        console.log(Math.pow(rate, period))

        let totalval = loanval*(Math.pow(rate, period))
        let interest = totalval - loanval
        let monthlypay = totalval/(12*period)

        let pmt_data = {
            lvl: loanval,
            tvl: totalval,
            int: interest,
            mpy: monthlypay
        }
        console.log(pmt_data)

        let new_text = `
        Total loan value: $${totalval.toLocaleString("en-AU")} ....
        (Interest: $${interest.toLocaleString("en-AU")}) ....
        Monthly payments of $${monthlypay.toLocaleString("en-AU")}
        `

        test_pmt_text.text(new_text)
    }
    
    d3.select("#test-input-button1").on('click', reload_lvr_text)
    d3.select("#test-input-button2").on('click', reload_pmt_text)
    
}

update_test_fig();
