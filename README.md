# MN Precinct Finder

A REST API and minimal web interface for finding a Minnesota precinct and returning its electoral boundary data 📍

It returns JSON data if the `format=json` query parameter is passed.

The server is written with [Hono](https://hono.dev/) so it supports a variety of JavaScript runtimes, including Node.js and Cloudflare Workers.

## What's in this project?

← `README.md`: That’s this file, where you can tell people what your cool website does and how you built it.

← `public/style.css`: The styling rules for the pages in your site.

← `package.json`: The NPM packages for your project's dependencies.

← `src/`: This folder holds the server logic, site template, and some basic data files.

← `src/components/index.tsx`: The main React component for the web interface.

← `src/node-server.ts`: A thin wrapper around `src/server.tsx` that serves as the entrypoint for Node.js.

← `src/server.tsx`: The main Hono server entrypoint.

← `src/seo.json`: When you're ready to share your new site or add a custom domain, change SEO/meta settings in here.

## Credits

This site was originally prototyped using [Glitch's Hello Node starter template](https://blog.glitch.com/post/a-closer-look-at-the-new-glitch-starter-apps)! Thanks Glitch.
