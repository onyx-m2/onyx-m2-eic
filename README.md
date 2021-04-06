This is part of the [Onyx M2 Project](https://github.com/onyx-m2), which enables
read-only real-time access to the Tesla Model 3/Y CAN bus data, including the
ability to run apps on the car's main screen through its built in web browser.

This project is a React web app designed to be run as the `Instrument Cluster` app
from within the Onyx M2 mobile app
([onyx-m2-mobile-app](https://github.com/onyx-m2/onyx-m2-mobile-app)).

**NOTE: Proper documentation is forthcoming**

TODOS:
- animate the indicators
- implement consumption context

## Usage

## Design

Clusters
Displays
Indicators
Gauges

## Installing

## Deployment

I currently use `AWS Amplitude` for deployment, and am really happy with it. It pretty
much handles everything and can hook up to the GitHub repo for auto-deploying.

TODO: provide step by step instructions

If you'd rather server locally, use `serve` by doing `npm install -g serve` once, and
then build and serve the app.

```
  npm run build
  serve -s build -l 4000
```

Note that the app was created with `create-react-app`, so any deployment tool that
supports this very popular tooling should be compatible.
