---
title: 'Global lithium trade'
date: 2019-02-11T19:27:37+10:00
weight: 1
---

As the global shift to electrifying energy and transport networks accelerates, the lithium battery supply chain will need to rapidly expand to meet new demand. What can the global lithium trade from 2015-2019 tell us in the lead-up to this transition?

<!--more-->

#### Motivation
This started as a project aimed at understanding the structural changes in the international trade of lithium, a mineral essential to modern batteries. Up until now the energy-bearing salt has been mostly extracted from brine, which method is most prevalent in South America.

Lithium _ore_, however, is more energy-dense and is also abundant in Australia. Multiple large mines have already or are soon scheduled to come online in Western Australia and the Northern Territory. I was therefore curious whether growing global demand for lithium batteries would translate into a growing export market for Australian lithium.

To investigate, I went searching for international trade data and found the Harvard [Atlas of Economic Complexity - International Trade Data](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/T4CHWJ). This contains import/export data for _all countries_ for _all products_ listed in the [Harmonised System](https://unstats.un.org/unsd/tradekb/Knowledgebase/Harmonized-Commodity-Description-and-Coding-Systems-HS) classification -- counted by value in USD and split by year.

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

#### Results

Try toggling between the different types of lithium, and cycling through the years, to observe the change in trade.

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
    <input type='range', id='li-trade-year-input', min='2015', max='2019', step='1'>
    <!-- li-trade-network.js also handles updating the displayed year -->
    <div id='li-trade-year-input-display'></div>
    </td>
    </tr></table>
</div>

<div id='li-trade-fig'></div>

<!-- Populate div -->
<script src="/scripts/li-trade-network.js"></script>

#### Conclusions
The data suggests that South American countries still dominate the global lithium trade, and any possible "Australian surge" is still some time in the future. Japan features as a surprisingly strong _exporter_ of both hydroxide and carbonate, whereas I thought they may occupy some in-between position like Germany does.

Because brine mostly yields lithium carbonate, South America doesn't feature as heavily in the lithium hydroxide network. What is interesting is how little concentration there seems to be in the hydroxide export market generally, compared to the Chile/Argentina domination in carbonates.

In general, it's not surprising that Australia doesn't feature on either of these maps. Although we have a number of large lithium mines, many of them are still in the construction phase -- while many production-ready mines are shut down or operating at reduced capacity because of the global [lithium price slump](https://www.fastmarkets.com/article/4010975/a-fast-and-furious-year-for-lithium-lme-week-2021).

We can expect 2020 and 2021 data to be horribly skewed by the impacts of the pandemic, but it will be interesting to track this into the future as Australia's lithium industry comes into its own.

#### Further development
It was overkill to write a whole API just for one or two products. However, it meant that once all the data was in place, it was very simple to generalise the whole project into an all-product trade data visualisation. To ensure speedy responses and good-looking visualisations, it was necessary to:

- Break up the data by product code, so the API didn't have to index/search the whole dataset
- Server-side, ensure all important (high-volume) nodes and links are included in the output data
- Client-side, hide links with a volume falling below a given percentile (e.g. the median)

Go check out [trade-networks.xyz](http://trade-networks.xyz) in production, or have a look at [the code](https://github.com/patrickmck/trade-networks) on Github!

#### To Do
1. **Fix the jerkiness of the force animation as the years change.**

    Currently, the nodes seem to move first to their original lat/lon positions and _then_ jostle into their relative places based on proximity and radius. Better would be for them to calculate their eventual position first, then smoothly transition there along with the radius/colour/line transitions.

2. **Capture all export/import values, not just those in-network.**

    Currently, the total export/import values are calculated only with respect to the other nodes in the top N. Better would be for those figures to reflect all trade with all countries, i.e. to include an "other" entry in each country's import/export links data.

It wouldn't be as much fun if it was already perfect!


<br><hr><br>