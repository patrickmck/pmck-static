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
    </label>
    </td>
    <td>
    <input type='range', id='li-trade-year-input', min='2015', max='2018', step='1'>
    <!-- li-trade-network.js also handles updating the displayed year -->
    <div id='li-trade-year-input-display'></div>
    </td>
    </tr></table>
</div>
<div id='li-trade-fig'></div>

<!-- Populate div -->
<script src="/scripts/li-trade-network.js"></script><br>