# Repository Guidelines

## Project Structure & Module Organization
-  `src/` holds all React + TypeScript features; `modules/` groups vertical flows, while `components/` and `hooks/` supply shared building blocks. 
-  `shared_types/` defines DTOs consumed by the backend; update these first when API contracts shift. 
-  `public/` keeps static assets and the HTML shell; only place production-safe files here. 
- Root configs such as  `vite.config.ts`, `tailwind.config.js`, and `tsconfig.*` control builds; adjust them alongside `npm run build` verification. 

## Build, Test, and Development Commands
-  `npm install` installs or refreshes dependencies after cloning or pulling. 
-  `npm run dev` launches the Vite server on port 5173 using `.env.local`. 
-  `npm run build` runs the TypeScript project references then emits a production bundle under `dist/`. 
-  `npm run preview` serves the compiled bundle for smoke testing before deploy. 
-  `npm run lint` and `npm run build:check` enforce ESLint and required env keys; run both before opening a PR. 
-  `npm run backend` starts the Express adapter used for local SUNAT integration tests. 

## Coding Style & Naming Conventions
- Follow ESLint and TypeScript defaults (2-space indent, semicolons off); run  `npm run lint` to auto-fix. 
- Name React components in PascalCase, hooks in camelCase prefixed with  `use`, and Tailwind utility groups with feature-specific prefixes. 
- Co-locate feature-specific types and helpers within  `modules/<feature>/` to keep cross-cutting code in `components/` or `shared_types/`. 

## Testing Guidelines
- Automated UI tests are not yet defined; rely on linting plus targeted manual checks of critical flows (empresas, obras, valorizaciones).
- Use  `npm run test-sunat` when modifying SUNAT integration logic and confirm responses through the mocked backend. 
- Before merging, verify responsive layouts across breakpoints using the  `preview` build to catch Tailwind regressions. 

## Commit & Pull Request Guidelines
- Match the existing history: short, descriptive Spanish subjects in present tense (e.g.,  `Mejora contraste en modo oscuro`). 
- Each PR should describe the change scope, list manual verification steps, and attach screenshots or screen recordings for UI updates.
- Reference related backend changes or tickets when altering shared DTOs so reviewers can sync both repositories.

## Environment & Deployment Notes
- Keep  `.env.local` minimal; required keys are `VITE_BACKEND_URL` and `VITE_ENVIRONMENT`. Never commit secrets. 
- Vercel uses  `vercel.json` for headers and rewrites; confirm changes with a preview deployment if routes shift. 
- After env or config updates, run  `npm run build:check` followed by `npm run build` to validate the deployment path. 
