---
title: 'Loan Calculator [proto]'
date: 2021-09-15
weight: 2
---

The aim is to set up a simple guide and free calculator to help aspiring Australian first home owners. It will be predominantly content-focused, but there will need to be at least one calculator graphic embedded in the site. This page is testing whether Hugo + D3 alone will be able to receive input, do calculations and return outputs/graphics ...

<!--more-->

<!-- Load d3.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.15.0/d3.js"></script>
<!-- <script src='https://d3js.org/d3.v6.js'></script> -->

<br>

<table>
    <tr>
        <td>Deposit ($)</td>
        <td colspan=2>
        <input type='number' id='test-input-deposit'>
        </td>
    </tr>
    <tr>
        <td>Total value ($)</td>
        <td><input type='number' id='test-input-value'></td>
        <td><button id='test-input-button1'>Calculate LVR</button></td>
    </tr>
    <tr><td colspan=3></td></tr>
</table>

<div id='test-d3inputs-lvr'></div>

<br><br>

<table>
    <tr>
        <td>Interest rate (%)</td>
        <td colspan=2>
        <input type='number' id='test-input-rate'>
        </td>
    </tr>
    <tr>
        <td>Loan period (years)</td>
        <td><input type='number' id='test-input-period'></td>
        <td><button id='test-input-button2'>Calculate payments</button></td>
    </tr>
    <tr><td colspan=3></td></tr>
</table>

<div id='test-d3inputs-pmt'></div>


<!-- Calling the script to populate #barviz -->
<script src="/scripts/test-inputs.js"></script><br>

<hr><br>

<details>
<summary>
<b>Conclusion</b>
</summary>

<p>Adding text content and routing to different pages is a lot easier than if we were to go with a fully-fledged web app written in React or whatever, since those are generally geared towards the 'single page' paradigm.</p>

<p>However, it's hard keeping track of state using HTML+D3 alone and not clear how the "capture input node values" approach to interpreting inputs will scale when those inputs need to be sent to an API for processing.</p>

<p>Next step, then, is to see whether the modern approach of "React front-end calling a web API for data updates" is a better fit for this problem.</p>
</details>