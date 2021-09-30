# Shotstack Positioning Utility

This is a positioning utility built for the Shotstack API. Using the Konva canvas
library you can simulate the positioning of [HTML](https://shotstack.io/docs/api/#tocs_htmlasset)
and [Image](https://shotstack.io/docs/api/#tocs_imageasset) asset components by
providing you with the corresponding JSON to use with the Shotstack API.

## Requirements

- Node 8.10+

## Project Structure

The project is divided in to a two components:

### Backend Server

The backend uses the [http-server](https://www.npmjs.com/package/http-server) module to
serve the HTML content.

### Static Build

The build folder includes a static version of the positioning utility

## Installation

Install node module dependencies:

```bash
npm install

```

## Configuration

You can adapt some of the colours used in the utility by changing the theme property
in `tailwind.config.js`.

## Run Locally

To start the server, build the CSS and serve the utility:

```bash
npm start
```

Then visit [http://localhost:8080](http://localhost:8080)

## Build

The utility can be deployed as a static website by. This builds your
CSS file from Tailwind and copies the Javascript and HTML into the build directory:

```bash
npm run build
```
