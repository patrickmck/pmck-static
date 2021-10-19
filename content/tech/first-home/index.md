---
title: 'First Home Helper'
date: 2021-09-15
weight: 2
---

The aim is to set up a simple guide and free calculator to help aspiring Australian first home owners. It will be predominantly content-focused, but there will need to be at least one calculator graphic embedded in the site.

<!--more-->

#### Motivation

If there was ever an Australian Dream, it would probably be the modest goal of owning your own home.

Colour me surprised, then, when a friend informed me that there wasn't anywhere a simple, impartial guide detailing exactly what steps are involved in such a large and complicated purchase! 

A quick search online for "first home buyer guide" will return plenty of results:
- From the federal government -- explaining the first home owner grant scheme 
- From state and territory governments -- discussing stamp duty exemptions available
- From banks, brokers or real estate companies -- ultimately trying to sell you something

Some of the third category cover the whole process end-to-end ([like this](https://www.huntergalloway.com.au/first-home-buyer-guide/)) but these are invariably for attracting customers first, helping people second. The nearest thing to an impartial source is the [MoneySmart - Buying A House](https://moneysmart.gov.au/buying-a-house) page, which steps through the whole process and doesn't assume any prior knowledge.

#### User Story

The friend who pointed out this gap has recently been through the process of buying a first home, and incidentally works in financial counselling. They articulated the following four components as being necessary for a really helpful and comprehensive guide:

1. **Guide**: series of articles/posts, one for each "step" in the process
2. **Calculators**: tools which can be used on their own, or else embedded in other pages
3. **Glossary**: detailed explanations of key terms, referenced by the first two components
4. **Search**: navigate by keyword to pages in any of the first three components

As an example of 1-3 working together, a user may arrive at the site having searched for "how to calculate LVR" and landed on the glossary page for "_Loan-Value Ratio_". This page would explain what the LVR is in the context of home buying, with a little calculator embedded in the bottom and links to steps in the process where this ratio is relevant. 

#### Architecture

Having long held web development in some disdain, my personal motivation here was to learn what actually goes into building a modern web app -- hopefully gaining some respect in the meantime for the people who do it for a living. In the spirit of "just pick one already" I chose React as the framework to write in.

One key function of the web app will be to accept user-input parameters and return results/data. Rather than write an API, so far it's proved possible to handle all calculations in-app in pure Javascript. It is however starting to prove necessary to use a state manager like Redux, given that users may enter data anywhere in the app.

#### ... ongoing ...

This project started with the simple-but-bloated `create-react-app`. As of 15 October we are still writing the _content_ for the guide/lingo pages, so I am now re-writing the app from scratch using [Material UI](https://mui.com/getting-started/usage/), [ESBuild](https://esbuild.github.io/) and probably a simpler charting library like [Chart.js](https://www.chartjs.org/docs/latest/) or [Semiotic](https://semiotic.nteract.io/).

Check back in soon!


<br><hr><br>