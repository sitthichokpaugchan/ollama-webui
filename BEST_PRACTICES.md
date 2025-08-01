# 📘 Project Best Practices

## 1. Project Purpose  
Ollama Web UI is a modern, responsive web application for managing and interacting with chat-based models. It provides a user-friendly interface for chat sessions, model selection, and real-time updates, built with SvelteKit, TailwindCSS, and TypeScript.

## 2. Project Structure
- **src/**: Main source code
  - **lib/**: Shared libraries and utilities
    - **components/**: Svelte UI components, organized by feature (chat, common, layout)
    - **constants.ts**: Application-wide constants
    - **stores/**: Svelte stores for state management
    - **utils/**: Utility functions and helpers
  - **routes/**: SvelteKit routing structure, including layouts and pages
    - **(app)/**: Main application routes and nested chat routes
- **static/**: Static assets
- **package.json**: Project metadata and dependencies
- **svelte.config.js**: SvelteKit configuration
- **tailwind.config.js**: TailwindCSS configuration
- **tsconfig.json**: TypeScript configuration
- **vite.config.ts**: Vite build configuration

## 3. Test Strategy
- **Framework**: [Vitest](https://vitest.dev/) for unit testing
- **Location**: Test files are placed alongside source files (e.g., `utils/index.test.ts`)
- **Naming**: Use `.test.ts` suffix for test files
- **Philosophy**: Focus on unit tests for utilities and logic; integration tests for complex flows
- **Mocking**: Use built-in mocking from Vitest as needed
- **Coverage**: Aim for meaningful coverage of core utilities and state logic

## 4. Code Style
- **Language**: TypeScript for type safety; Svelte for UI
- **Async**: Use async/await for asynchronous operations
- **Naming**:
  - Variables/functions: `camelCase`
  - Classes/types: `PascalCase`
  - Files: `kebab-case` or `PascalCase.svelte` for components
- **Comments**: Use JSDoc-style comments for exported functions/utilities; avoid redundant comments
- **Error Handling**: Prefer try/catch for async errors; surface errors to UI where appropriate

## 5. Common Patterns
- **Reusable Svelte components** for UI (inputs, modals, spinners)
- **Svelte stores** for global state (chat, models, settings)
- **Utility functions** for stream processing and data transformation
- **Constants file** for API endpoints and config
- **Separation of concerns**: UI, state, and logic are modularized

## 6. Do's and Don'ts
- ✅ Use Svelte stores for shared state
- ✅ Keep components focused and reusable
- ✅ Write unit tests for utilities and logic
- ✅ Use TypeScript types for clarity and safety
- ✅ Keep configuration in dedicated files
- ❌ Avoid logic in Svelte markup blocks
- ❌ Do not duplicate code—extract helpers/utilities
- ❌ Avoid global variables outside Svelte stores
- ❌ Do not leave debug statements (e.g., `console.log`) in production code

## 7. Tools & Dependencies
- **SvelteKit**: Main web framework
- **TailwindCSS**: Utility-first CSS
- **TypeScript**: Static typing
- **Vite**: Build tool
- **Vitest**: Testing framework
- **IDB**: IndexedDB wrapper for local storage
- **Prettier**: Code formatting
- **Other**: `uuid`, `highlight.js`, `katex`, `marked`, `tippy.js`, `svelte-french-toast`
- **Setup**:
  - `npm install` to install dependencies
  - `npm run dev` to start development server
  - `npm run build` for production build

## 8. Other Notes
- SvelteKit routing uses filesystem-based conventions; keep routes modular
- Use SvelteKit's built-in stores and lifecycle hooks for reactivity
- Prefer colocating tests with source files for maintainability
- When adding new models or chat features, update constants and stores accordingly
- Follow idiomatic Svelte and TypeScript patterns for maintainability and clarity
