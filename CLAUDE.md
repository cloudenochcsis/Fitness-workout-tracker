# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test/Lint Commands
- Build: `npm run build` - Builds the application
- Dev: `npm run dev` - Runs the application in development mode
- Test: `npm test` - Runs all tests
- Single test: `npm test -- -t 'test name'` - Runs a specific test
- Lint: `npm run lint` - Lints all files
- Format: `npm run format` - Formats code with Prettier

## Code Style Guidelines
- Imports: Group imports by type (React, third-party, local)
- Formatting: Use Prettier with 2-space indentation
- Types: Use TypeScript strict mode, prefer explicit types over 'any'
- Naming: camelCase for variables/functions, PascalCase for components/classes
- Error handling: Use try/catch for async operations, create custom error types
- Components: Prefer functional components with hooks over class components
- State management: Use React Context API for global state when appropriate