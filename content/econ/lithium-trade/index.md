---
title: 'Global lithium trade'
date: 2019-02-11T19:27:37+10:00
weight: 1
---

As the global shift to electrifying energy and transport networks accelerates, the lithium battery supply chain will need to rapidly expand to meet new demand. This post uses UN ComTrade data to explore how the global trade flows in this strategic mineral have been changing through recent history.

<!--more-->

#### Motivation
This started as a project aimed at understanding the structural changes in the international trade of lithium, a mineral essential to modern batteries.Up until now the energy-bearing salt has been mostly extracted from brine, which method is most prevalent in South America.

Lithium _ore_ (a.k.a. spodumene), however, is more energy-dense and is also abundant in Australia. I was therefore curious whether growing global demand for lithium batteries would translate into a growing export market for Australian lithium.

To investigate, I went searching for international trade data and found the Harvard [Atlas of Economic Complexity - International Trade Data](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/T4CHWJ). This contains import/export data for _all countries_ for _all products_ listed in the [Harmonised System](https://unstats.un.org/unsd/tradekb/Knowledgebase/Harmonized-Commodity-Description-and-Coding-Systems-HS) classification.

#### Approach
There are two HS product codes which are relevant for this investigation:
- 283691: Lithium carbonate, up until now the primary source of lithium for batteries
- 282520: Lithium hydroxide, the principle result of extracting lithium ore (spodumene)

In general, my aim was to select the overall top importers and exporters and then graph them as nodes in a network, where the links between nodes represented the main trade relationships between importers and exporters. The data is available for every year from 2015-2019, so the secondary objective was to show the graph changing over time.

#### Implementation
This project was first and foremost an opportunity to learn Javascript for the first time, specifically the graphing library D3.js. In order to create the network graph(s) below, it was necessary to understand:
- [Thinking with joins](https://bost.ocks.org/mike/join/) and d3's [General Update Pattern](https://bl.ocks.org/mbostock/3808234) for data binding
- The [selection-join pattern](https://observablehq.com/@d3/selection-join) for cleanly managing data updates/transitions
- Working with [d3 force layouts](https://github.com/d3/d3-force), specifically [updating the force simulation with new data](https://stackoverflow.com/questions/57277281/d3-how-to-update-force-simulation-when-data-values-change)
- Making [tooltips](https://www.d3-graph-gallery.com/graph/bubblemap_tooltip.html) work nicely, including colouring import/export links differently

In order to position nodes as close as possible to their geographic location, it was necessary to use [d3's geographic projections](https://github.com/d3/d3-geo/blob/main/README.md) to translate each country's [latitude/longitude coordinates](https://developers.google.com/public-data/docs/canonical/countries_csv) into SVG coordinates. Each node could then include `forceX` and `forceY` components to encourage them to keep geographically relative to each other.

Finally, I wrote a simple API which takes a HS product code as input and returns the relevant data for all years in JSON format. The results for lithium carbonate are available below.

<!-- Load d3.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.15.0/d3.js"></script>
<!-- Prepare a div -->
<!-- <div>
    <table><tr>
    <td>
    <label class='toggle'>
        <input type='checkbox', id='li-trade-type-input'>
        <span class='toggle-slider' id='li-trade-type-slider'></span>
    </label>
    </td>
    <td>
    <input type='range', id='li-trade-year-input', min='2015', max='2018', step='1'>
    li-trade-network.js also handles updating the displayed year
    <div id='li-trade-year-input-display'></div>
    </td>
    </tr></table>
</div> -->
<div>
    <input type='range', id='li-trade-year-input', min='2015', max='2018', step='1'>
    <div id='li-trade-year-input-display'></div>
</div>
<div id='li-trade-fig'></div>

<!-- Populate div -->
<script src="/scripts/li-trade-network.js"></script><br>

#### Further development
It was overkill to write a whole API just for one or two products. However, it meant that once all the data was in place, it was very simple to generalise the whole project into an all-product trade data visualisation. To ensure speedy responses and good-looking visualisations, it was necessary to:

- Break up the data by product code, so the API didn't have to index/search the whole dataset
- Server-side, ensure all important (high-volume) nodes and links are included in the output data
- Client-side, hide links with a volume falling below a given percentile (e.g. the median)