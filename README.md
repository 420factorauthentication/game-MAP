<!-- @format -->

# GameMAP

### Game and Media Modules and Projects

**GameMAP** is a monorepo of personal HTML5 game projects and related ES6 modules.

<br>

## Project Settings

### package.json

-   `npm install` also pre-installs TypeScript and Prettier globally
-   `npm test` runs all Jest tests

<br>

### jest.config.js

-   Jest tests include _`.spec.ts`_ and _`.spec.tsx`_ files in any level

<br>

### tsconfig.json

-   `tsc -b` in root dir builds all HTML5 game project folders (no prefix)
-   Import ES6 modules from library folders (_`lib-`_ prefix)
-   Build artifacts appear in _`_out`_ folder

<br>

### .vscode/settings.json

-   Prettier formats on save

<br>

### .prettierrc.json

-   Only files with a pragma (comment containing `@format`) are formatted on save
-   Absence of a pragma is used to manually format some files
