# Mini Pokédex - Angular Single Page Application

This repository contains the source code for the "Mini Pokédex" project, a Single Page Application developed in Angular. The architecture, technological choices, and implemented features strictly adhere to the functional requirements and technical specifications outlined in the assignment PDFs provided for this project.

## Introduction and Requirements Compliance

The application was designed to provide an interactive Pokémon catalog and a user squad management system. In compliance with the PDF guidelines, the project integrates public GraphQL APIs (PokéAPI) to fetch global data and a local mock server to persist the user's squad information.

The user interface was developed following the provided design guidelines, ensuring a fluid, responsive, and optimized experience, with specific attention paid to loading states and network error handling.

## Tech Stack and Architectural Choices

The project leverages modern features introduced in recent Angular versions, discarding NgModules in favor of a fully Standalone approach.

*   **Framework:** Angular (Standalone Components, Native Control Flow)
*   **Change Detection:** `ChangeDetectionStrategy.OnPush` applied globally to optimize the rendering cycle, reducing DOM recalculations strictly to components where the state explicitly changes.
*   **State Management (Hybrid Approach):**
*   **Angular Signals:** Used for fine-grained view state management (loading flags, errors, squad composition) ensuring synchronous reactivity.
*   **RxJS (BehaviorSubject):** Employed to orchestrate complex and asynchronous data streams, such as pagination concatenation, textual search, and filtering.
*   **Data Fetching:** Native `HttpClient` module used to execute GraphQL queries and mutations against designated endpoints.
*   **Styling:** SCSS with a Custom Properties (CSS Variables) architecture to centralize design tokens and ease theme maintenance (e.g., elemental type colors, background palettes).

## Implemented Features

### 1. Catalog Exploration (Pokédex)
*   **Server-Side Pagination:** Integration with the PokéAPI GraphQL endpoint to request batches of 20 Pokémon at a time, optimizing bandwidth usage.
*   **Optimized Search Engine:** Implementation of a reactive RxJS stream using `debounceTime(300)` and `distinctUntilChanged` operators to prevent redundant API calls or recalculations during user input.
*   **Combined Filters:** Use of `combineLatest` to simultaneously cross-reference network response data, the search term, and the type filter, returning a derived array processed entirely on the client side.

### 2. Pokémon Detail
*   Parametric navigation to the individual Pokémon detail page.
*   Extended visualization of aggregated base statistics.
*   Asynchronous fetching of specific abilities via a dedicated GraphQL query, including English translations or fallbacks if descriptions are missing.

### 3. Squad Management (Dream Team)
*   **Domain Rules:** Selection limited to a maximum of 6 Pokémon and strict duplication prevention, as per specifications.
*   **Local and Remote Persistence:**
*   Real-time state synchronization in `localStorage` to prevent data loss upon page refresh.
*   Integration of `TeamApiService` to interact with a local GraphQL mock server via mutations (creating, reading, and deleting squads).

## Project Structure

The codebase is organized into conceptual feature modules, ensuring high cohesion and low coupling:

```text
src/
├── app/
│   ├── core/
│   │   └── models/               # Domain TypeScript Interfaces (Pokemon, Team, GraphQL Node)
│   ├── pokedex/                  # Feature: Catalog navigation and exploration
│   │   ├── components/           # UI Components (Page, Card, Detail)
│   │   ├── services/             # HTTP Communication Layer (PokéAPI)
│   │   └── state/                # Store and Selectors (Signals + RxJS)
│   ├── teams/                    # Feature: User squad management
│   │   ├── components/           # Specific UI components for the team
│   │   ├── services/             # GraphQL Mock Server communication
│   │   └── state/                # State management and local persistence
│   ├── app.component.ts          # Root Component (Shell)
│   ├── app.config.ts             # Global providers configuration (Router, HTTP)
│   └── app.routes.ts             # Lazy Loaded Routing configuration
├── styles.scss                   # Global stylesheets and architectural tokens
└── main.ts                       # Application entry point
```
## Setup and Execution Instructions
To properly set up and run the application locally, follow these steps:

1. Install Dependencies

```bash
npm install
```

2. Start the GraphQL Mock Server
   Start the local mock server on port 4000 using the provided database configuration file:

```bash
npx json-graphql-server db.js -port 4000
```

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

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## What I'd Improve with More Time
- **Virtual Scrolling:** Implement `@angular/cdk/scrolling` for the Pokémon catalog table to handle massive datasets with ultimate performance instead of traditional pagination.
- **End-to-End Testing:** Add full E2E test suites using Playwright to cover critical user flows (searching, filtering, and building a team).
- **Offline Support:** Integrate a Service Worker / PWA capabilities to cache GraphQL responses locally for seamless offline usage.
