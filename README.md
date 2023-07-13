<!-- @format -->

# GameMAP

### Game and Media Modules and Projects

**GameMAP** is a monorepo of personal HTML5 game projects and related JS modules.

<br>
<br>

<!--####################################################################-->
<!--####################################################################-->
<!--####################################################################-->

## Fresh Install Notes

-   Install VSCode, NPM (and NodeJS), Python, Git, and GitHub CLI
-   Clone this repo and run `npm install`

<!--####################################################################-->
<!--####################################################################-->
<!--####################################################################-->

<br>
<br>
<br>

## HTML and JS Workflow

<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->

### Preprocessors Used

These are automatically installed globally with `npm install`

-   [TypeScript](https://www.typescriptlang.org/)
-   [Less CSS](https://lesscss.org/)
-   [Prettier](https://prettier.io/)

<!--------------------------->

<br>

### Build Tools Used

-   [Visual Studio Code](https://code.visualstudio.com/) -
    For code snippets and format on save
-   [Node Package Manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-installer-to-install-nodejs-and-npm) -
    For JS dependencies and automating parts of fresh installs
-   [Python](https://www.python.org/) - For recursively compiling .less files

<!--------------------------->

<br>

### Creating Game Projects

-   Write JS modules in _`src/lib-**/`_ folders
-   Write game projects in _`src/**/`_ folders
-   Run `npm run build` to build all game projects into _`_out`_ and _`_api`_ folders
    -   Use `npm run compile` instead if you dont need to purge old files before building

<!--------------------------->

<br>

### Storing Large Assets

-   The pattern _`**/assets/**`_ uses Git LFS
-   Large assets are kept in any subfolder named "assets"

<!--------------------------->

<br>

### Commenting and Organizing

Use these VSCode Snippets for organizing properties of classes in JS modules:

-   commentSeparator
-   apiBlockComment
-   compBlockComment
-   initBlockComment
-   helperBlockComment

Use these command palette actions for general organization
(from extension [Comment Bars by Zack Frost](vscode:extension/zfzackfrost.commentbars))

-   Comment Bars: Generate (Quick)
-   Comment Bars: Generate (Advanced)

<br>
<br>
<br>

<!--####################################################################-->
<!--####################################################################-->
<!--####################################################################-->

## Config File Notes

<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->

### package.json

-   `npm install` also installs some dev dependencies in the `pre-install` step:
    -   Global NPM Packages:
        -   [TypeScript](https://www.npmjs.com/package/typescript)
        -   [Prettier](https://www.npmjs.com/package/prettier)
        -   [Less CSS](https://www.npmjs.com/package/less)
    -   VSCode Extensions:
        -   [Prettier Formatter for Visual Studio Code](vscode:extension/esbenp.prettier-vscode)
        -   [Comment Bars by Zack Frost](vscode:extension/zfzackfrost.commentbars)
-   `npm run build` builds all game projects into _`_out`_ and _`_api`_ folders
-   `npm run compile` skips some build steps. Use if rebuilding minor changes.
-   `npm test` runs all Jest tests

<!--------------------------->

<br>

### jest.config.js

-   Jest tests include _`.spec.ts`_ and _`.spec.tsx`_ files in any level

<!--------------------------->

<br>

### tsconfig.json

-   Import JS modules from library folders (_`lib-`_ prefix)
-   Build artifacts appear in _`_out`_ and `_api` folders

<!--------------------------->

<br>

### .vscode/settings.json

-   Prettier formats most languages on save, using the VSCode Extension
    [Prettier Formatter for Visual Studio Code](vscode:extension/esbenp.prettier-vscode)
-   Python Black formats Python on save, using Microsoft's VSCode Extension
    [Black Formatter](vscode:extension/ms-python.black-formatter)

<!--------------------------->

### .vscode/\*.code-snippets

-   VSCode project snippets for code templates.

<br>

### .prettierrc.json

-   Only files with a pragma (comment containing `@format`) are formatted on save
-   Absence of a pragma is used to manually format some files
