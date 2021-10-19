---
title: 'Wage curve(s)'
date: 2019-02-11T19:27:37+10:00
weight: 2
---

It has been hypothesised that "a worker who is employed in an area of high unemployment earns less than an identical individual who works in a region with low joblessness." Is this supported by the Australian data? 

<!--more-->

#### Background

This is a thing that economists have claimed -- their claims properly belong in this section.

#### Data sources
To perform a proper comparison, it's necessary to compare people in the _same profession_ across geographical areas with differing unemployment rates. Therefore we cannot use the [personal earnings](https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/6524.0.55.0022011-2015?OpenDocument) data provided by the ABS, because it does not provide the occupation breakdown.

Instead we will use the ABS series [5673.0.55.003 - Wage and Salary Earner Statistics for Small Areas](https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/5673.0.55.0032005-06%20to%202010-11?OpenDocument) which gives the number of wage earners and their income, for each small area (choice of LGA or SA2) and for each major occupational group (in Australia the standard classification is called ANZSCO).


To get unemployment numbers to compare, we will use the [Small Area Labour Market estimates data](https://lmip.gov.au/default.aspx?LMIP/Downloads/SmallAreaLabourMarketsSALM/Estimates), which records labour force participation at both the SA2 and LGA levels. Per standard ABS advice we will be using the seasonally adjusted numbers for both metrics.

#### Methodology
This project is a useful opportunity to explore two different approaches to statistical interpretation:
- _Marginal model:_ within each professional group, can we estimate how sensitive local wages are to changes in local unemployment?
- _Clustered model:_ if the unemployment rate goes down over time in a particular locality, does that affect local wages for everyone?

In both cases the regression approach will be generalised linear models (GLMs) - but having only just collected the data (1 Oct 2021) the details of this are still being worked out!