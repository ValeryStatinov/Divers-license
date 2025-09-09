# Divers License Senior Frontend 2025

## Introduction
Welcome to the coding challenge for the Senior Frontend Developer position at Dive CAE.
This repository contains a basic React application setup along with a lib module that exposes key APIs for building out the user interface.

## Getting Started
To get the application up and running, install the dependencies and start the development server:
```
npm install
npm start
```

## 3D Viewport API
The `lib` module exports an instance of ViewportManager as `viewportManager`. This object is responsible for initializing the 3D viewport and interacting with cube objects in 3D via `viewportManager.cubeManager`.

To better understand the API, refer to the `ViewportManager` and `CubeManager` class definitions.

The module also exports the `Viewport` react component that provides a div in which the `Viewport` is initialized. This component should be placed in the application layout by you.

> Note: Do not modify any files inside the `lib` directory. Use only the exports from `index.ts`.

## CRUD API
The `API` object, also exported from the `lib` module, offers four basic CRUD operations to manage cube state.
This state is persisted and should be retrieved and re-synced when the application is reloaded.

> Heads-up: The application is collaborative. Another simulated user may add, update, or delete cubes in your shared state. Your UI and 3D viewport must reflect these external changes within a reasonable time interval.