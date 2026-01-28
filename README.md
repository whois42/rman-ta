# RentmanTest

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## System Design Overview

This application renders a hierarchical folder–item structure from a normalized API response.

### Data Flow

1. API response:

Data is received in a column-based format (columns + data arrays).

This format is optimized for transport but not directly usable by the UI.

2. Normalization

The response is converted into typed objects (Folder, Item) using a pure helper (formatResponse).

This step decouples the UI from backend-specific data shapes.

3. Tree construction

Folders and items are transformed into a recursive tree structure via prepareTreeData.

Folders may contain:

- child folders

- items

Sorting rules:

- folders before items

- alphabetical order within each group

4. Presentation

The tree is rendered recursively using dedicated components:

FolderTreeComponent – tree root and state holder

FolderNodeComponent (or split folder/item components) – renders individual nodes