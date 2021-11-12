

# UpflowAssessment

This project was generated using [Nx](https://nx.dev). Nx is a set of extensible dev tools for monorepos.

## Problem Statement

Construct a re-usable datagrid component in React supported by a light-weight server using node.js.

### Technologies to use

- Typescript
- Node
- React

### Requirements

- ✅ Handles 100,000s of rows.
- ✅ Generic, re-usable API that abstracts away the underlying implementation.
- ✅ Light backend that serves up the data.
- ✅ Allow sorting by clicking on columns.
- ✅ Please don't use a 3rd party data grid library.

### Stretch Goals (do as many as you can/want)

- Auto-sizes columns based on cell content.
- Resizable / draggable columns.
- ✅ Edit cell content.
- ✅ Ability to delete rows.
- ✅ ⏳ Tests (a little bit).

## Repository structure

```
.
└── root
    ├── apps
    │   ├── api                       <-- express API
    │   └── upflow                    <-- nextjs app
    └── libs
        └── ui                        <-- ui shared librairy (dir)
            ├── .storybook            <-- storybook configuration folder (dir)
            └── src
                └── lib               <-- react component lib
                    └── test          <-- component testing code
```



## Development server

Run `npm run start upflow` for next dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

Run `npm run start api` for express dev server. Navigate to http://localhost:3333/. The app will automatically reload if you change any of the source files.

Run `npm run start ui:storybook` for storybook server. Navigate to http://localhost:4400/. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build upflow` to build the nextjs frontend. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

Run `npm run build api` to build the express api backend. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.


## Running unit tests

Run `npm run test ui` to execute the unit tests via [Jest](https://jestjs.io) on the shared library.


## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.


