<!-- @format -->

# GameMAP

### Game and Media Modules and Projects

**GameMAP** is a monorepo of personal HTML5 game projects and related ES6 modules.

<br>

## Personal Notes: Binary Assets

Binary assets are kept in cloud storage separate from the repo.
When pulling the repo, download the
[assets folder](https://drive.google.com/drive/folders/1nbAjKdv-4MV9Md6lP3ThGYlSwMLeyWch?usp=sharing)
and merge it's contents into the repo root.

<br>

## Personal Notes: Workflow Config Settings

### VSCode Extensions

-   [Prettier Formatter for Visual Studio Code](vscode:extension/esbenp.prettier-vscode)

<br>

### package.json

-   `npm run build` builds all game projects into `_out` folder
-   `npm run compile` skips some build steps. Use if rebuilding minor changes.
-   `npm install` also pre-installs TypeScript and Prettier globally
-   `npm test` runs all Jest tests

<br>

### jest.config.js

-   Jest tests include _`.spec.ts`_ and _`.spec.tsx`_ files in any level

<br>

### tsconfig.json

-   Import ES6 modules from library folders (_`lib-`_ prefix)
-   Build artifacts appear in _`_out`_ folder

<br>

### .vscode/settings.json

-   Prettier formats on save, using the VSCode Extension
    [Prettier Formatter for Visual Studio Code](vscode:extension/esbenp.prettier-vscode)

<br>

### .prettierrc.json

-   Only files with a pragma (comment containing `@format`) are formatted on save
-   Absence of a pragma is used to manually format some files
