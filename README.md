[![Build Status](https://travis-ci.org/farmermel/palett-picker.svg?branch=master)](https://travis-ci.org/farmermel/palett-picker)

# Palette Lab

[Project Spec](http://frontend.turing.io/projects/palette-picker.html)

## Live Project

See Palette Lab live [here](https://melenasuliteanu-palette-lab.herokuapp.com/)

## Description

The goal of this project is to develop skills in Node.js and Express. It is an individual project completed in 5 days.
A user can go to the app and generate a palette which can then be saved to an existing project. If the desired project hasn't been created yet, it can be created.

## Implementation

Palettes are saved to a posgres database and associated with a project by a foreign key. The posgres database is connected to the Express server with Knex. The front end is build with jQuery.

## Design

![Top half of page](https://i.imgur.com/WCBlLzYm.png)
![Bottom half of page](https://i.imgur.com/uYMWIRcm.png)