# MN Precinct Finder

> (temporarily titled MPLS 2021 Poll Finder)

This project includes a Node.js server script and a web page that connects to it, along with several helper functions to retrieve the necessary precinct data. The server returns info to the page that allows it to update the display with the precinct information. π³οΈ

It also returns JSON data if the `format=json` query parameter is passed, or if the `Accept` header of the request specifies JSON.

[Node.js](https://nodejs.org/en/about/) is a popular runtime that lets you run server-side JavaScript. This project uses the [Fastify](https://www.fastify.io/) framework and explores basic templating with [Handlebars](https://handlebarsjs.com/).

## Prerequisites

You'll get best use out of this project if you're familiar with basic JavaScript. If you've written JavaScript for client-side web pages this is a little different because it uses server-side JS, but the syntax is the same!

## What's in this project?

β `README.md`: Thatβs this file, where you can tell people what your cool website does and how you built it.

β `public/style.css`: The styling rules for the pages in your site.

β `server.js`: The **Node.js** server script for your new site.

β `package.json`: The NPM packages for your project's dependencies.

β `src/`: This folder holds the site template along with some basic data files.

β `src/pages/index.hbs`: This is the main page template for your site. The template receives parameters from the server script, which it includes in the page HTML.

β `src/seo.json`: When you're ready to share your new site or add a custom domain, change SEO/meta settings in here.

## Credits
This site was prototyped using [Glitch](https://glitch.com)'s Hello Node template! Thanks Glitch.
