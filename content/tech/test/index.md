---
title: '~ test ~'
date: 2021-09-11
weight: 3
---

Just for testing d3 visualisations, for now ...

<!--more-->

<!-- Load d3.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.15.0/d3.js"></script>
<!-- <script src='https://d3js.org/d3.v6.js'></script> -->



---

###### Network diagram

Preparing for the global lithium trade data visualisation. Objectives include:
- Read in JSON data and draw graph
- Accept input to change underlying data
- _Smoothly_ transition from one state to the next
- Position nodes geographically, but prevent their radii from overlapping

<div>
    <input type='range', id='test-net-year-input', min='2015', max='2016', step='1'>
</div>

<div id='test-network-fig'></div>

<!-- Call the script to populate #test-network-fig -->
<script src="/scripts/test-network.js"></script>

<br>

The key to making this work was (a) understanding the d3 update pattern; (b) initialising nodes close to their eventual position, so that the force layout didn't jump in from the top-left corner every time.

---

<!-- ###### Bar chart (basic) -->
<!-- Create a div where the graph will take place -->
<!-- <div id='test-barchart-fig'></div> -->

<!-- Calling the script to populate #barviz -->
<!-- <script src="/scripts/test-barchart.js"></script><br> -->