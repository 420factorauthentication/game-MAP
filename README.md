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

-   Install VSCode and extensions:
    -   [Prettier Formatter for Visual Studio Code](vscode:extension/esbenp.prettier-vscode)
    -   [Comment Bars by Zack Frost](vscode:extension/zfzackfrost.commentbars)
-   Install Python, Git, and GitHub CLI
-   Clone this repo and run `npm install`

<br>
<br>
<br>

<!--####################################################################-->
<!--####################################################################-->
<!--####################################################################-->

## HTML and JS Workflow

<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->

### Preprocessors Used

These are automatically installed globally with `npm install`.

-   [TypeScript](https://www.typescriptlang.org/)
-   [Less CSS](https://lesscss.org/)
-   [Prettier](https://prettier.io/)

<!--------------------------->

### Build Tools Used

-   [Python](https://www.python.org/) - For recursively compiling .less files

<br>

<!--------------------------->

### Creating Game Projects

-   Write JS modules in _`src/lib-**/`_ folders
-   Write game projects in _`src/**/`_ folders
-   Run `npm run build` to build all game projects into _`_out`_ and _`_api`_ folders
    -   Use `npm run compile` instead if you dont need to purge old files before building

<!--------------------------->

<br>

### Storing Large Assets

-   The pattern "\*\*/assets/\*\*" uses Git LFS.
-   Large assets are kept in any subfolder named "assets"

<!--------------------------->

<br>

### VSCode Snippets

**JS Modules: Class Property Organizers**

-   apiBlockComment
-   compBlockComment
-   initBlockComment
-   helperBlockComment

**Separator Bars**

-   commentSeparator
-   VSCode Extension: [Comment Bars by Zack Frost](vscode:extension/zfzackfrost.commentbars)

<br>
<br>
<br>

<!--####################################################################-->
<!--####################################################################-->
<!--####################################################################-->

## Config File Notes

<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->

### package.json

-   `npm run build` builds all game projects into `_out` and `_api` folders
-   `npm run compile` skips some build steps. Use if rebuilding minor changes.
-   `npm install` also pre-installs TypeScript and Prettier globally from NPM
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

-   Prettier formats on save, using the VSCode Extension
    [Prettier Formatter for Visual Studio Code](vscode:extension/esbenp.prettier-vscode)

<!--------------------------->

<br>

### .prettierrc.json

-   Only files with a pragma (comment containing `@format`) are formatted on save
-   Absence of a pragma is used to manually format some files
