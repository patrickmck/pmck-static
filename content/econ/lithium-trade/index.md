---
title: 'Global lithium trade'
date: 2019-02-11T19:27:37+10:00
weight: 1
---

As the global shift to electrifying energy and transport networks accelerates, the lithium battery supply chain will need to rapidly expand to meet new demand. This post uses UN ComTrade data to explore how the global trade flows in this strategic mineral have been changing through recent history.

<!--more-->

## Data sources

Whereas previously the energy-bearing salt was mostly extracted from brine, in the future there is likely to be much greater attention paid to the processing of lithium ore (spodumene). The aim of this project is to visualise the changing structure of the lithium supply chain as this transformation takes hold.

<!-- ![Super wide](http://www.placecage.com/1280/300) -->

Initially framed as an opportunity to explore the UN ComTrade data and learn data visualisation in D3.

### Visualising


<!-- Load d3.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.15.0/d3.js"></script>
<!-- Prepare a div -->
<div>
    <table><tr>
    <td>
    <label class='toggle'>
        <input type='checkbox', id='li-trade-type-input'>
        <span class='toggle-slider' id='li-trade-type-slider'></span>
        <script>
            let toggle=1
            function update_li_trade_type() {
                toggle = toggle * -1
                let trade_type = (toggle > 0) ? 'Exports' : 'Imports'
                // console.log(trade_type)
            }
            update_li_trade_type()
            d3.select("#li-trade-type-input").on('change', update_li_trade_type);
        </script>
    </label>
    </td>
    <td>
    <input type='range', id='li-trade-year-input', min='2015', max='2019', step='1'>
    <div id='li-trade-year-input-display'></div>
    <!-- script to select and update the displayed year input -->
    <script>
        function update_li_trade_year() {
            d3.selectAll('.li-trade-year-display')
                .remove()
            d3.select('#li-trade-year-input-display')
                .append('text')
                .attr('class', 'li-trade-year-display')
                .attr("text-anchor", "middle")
                .text(d3.select('#li-trade-year-input').node().value)
        }
        update_li_trade_year();
        d3.select("#li-trade-year-input").on('input', update_li_trade_year);
    </script>
    <!-- <output for="li-trade-year-input" id="li-trade-year-output">2015</output> -->
    </td>
    </tr></table>
</div>
<div id='li-trade-fig'></div>

<!-- Populate div -->
<script src="/scripts/li-trade-network.js"></script><br>