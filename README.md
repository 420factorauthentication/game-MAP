<!-- @format -->

# GameMAP

### Game and Media Modules and Projects

**GameMAP** is a monorepo of personal HTML5 game projects and JS modules.  
I'm creating an ad hoc web development framework and game engine.  
Then I'm creating browser-based indie games with it.  
I'm doing this from scratch to learn:

-   Indie game development
    -   Software engineering
    -   Digital painting and vector graphics
    -   Sound design and music composition
    -   Productivity in software used for above (Adobe Creative Cloud, DAWs, etc.)
-   Front-end web design
-   The various web development frameworks, dev tools, and practices out there
-   Personal style guides / practices for solo or small-team projects

I plan on posting free browser-based indie games on Newgrounds and Itch.io as a hobby.  
I also plan on creating a static portfolio website and hosting it on Amazon S3, to see what it's like.

<br>
<br>

<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->

## Dev Toolchain

### Windows - Fresh Install / Update

Preparing a fresh install:

-   Install [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/#install-winget)
    if your version of Windows doesn't already come with it
-   Install [GitHub CLI](https://cli.github.com/) with
    `winget install --scope=machine -e --id GitHub.cli`
-   Clone this repo with
    `gh repo clone https://github.com/420factorauthentication/game-MAP.git`

Fresh install:

-   Install dev tools with _`dev/installDev.bat`_<br>
    Requires admin rights. Run cmd prompt or shell as admin.
-   Install JS dependencies with `npm install` from repo root<br>
    Note: NPM is configured to ignore NPM scripts for security<br>

Update:

-   Do the above two steps
-   Or, run `just update` from repo root to do the same thing

<br>

<!--------------------------->

### Unix - Fresh Install / Update

-   WIP

<br>

<!--------------------------->

### Globally Installed Preprocessors

-   [TypeScript](https://www.typescriptlang.org/)
-   [Less CSS](https://lesscss.org/)
-   [JSDoc](https://jsdoc.app/about-getting-started.html)

<br>

<!--------------------------->

### Globally Installed Dev Tools

-   [VSCode](https://code.visualstudio.com/) -
    For IntelliSense, JSDoc in IntelliSense, code snippets, and format on save
-   [Git](https://git-scm.com/)
-   [Git LFS](https://git-lfs.com/)
-   [GitHub CLI](https://cli.github.com/)
-   [NPM from NodeJS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) -
    For JS dependencies
-   [Python](https://www.python.org/) -
    For cross-platform file I/O in build steps, and generating SVG
-   [Just](https://just.systems/) -
    For automating install and build steps

<br>

<!--------------------------->

### Locally Installed Dev Tools

-   [Jest](https://jestjs.io/)
-   [Prettier](https://prettier.io/)<br>
    Note: Local works better with extension<br>
    ([Prettier - Code formatter](vscode:extension/esbenp.prettier-vscode))

<br>

<!--------------------------->

### Installed VSCode Extensions

-   [Prettier - Code formatter](vscode:extension/esbenp.prettier-vscode)
-   [Live Server by Ritwick Dey](vscode:extension/ritwickdey.LiveServer)
-   [Comment Bars by Zack Frost](vscode:extension/zfzackfrost.commentbars)
-   [json by ZainChen](vscode:extension/ZainChen.json)
-   [just by skellock](vscode:extension/skellock.just)
-   [Python](vscode:extension/ms-python.python)
-   [Python: Pylance](vscode:extension/ms-python.vscode-pylance)
-   [Python: isort](vscode:extension/ms-python.isort)
-   [Python: Black Formatter](vscode:extension/ms-python.black-formatter)

<br>
<br>
<br>

<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->

## HTML and JS Workflow

### Creating Game Projects

-   Write JS modules in _`src/lib-**/`_ folders
-   Write game projects in _`src/**/`_ folders
-   Run `just build` to build JS and TS in `src/` into _`_out`_ and _`_api`_ folders
    -   Run `just rebuild` to delete old build artifacts then build
-   To run a game project, usually launch `src/**/index.html` in a browser after building

<br>

<!--------------------------->

### Storing Large Assets

-   The pattern _`**/assets/**`_ uses Git LFS<br>
    Large files are kept in any subfolder named "assets"<br>
    Example: High-res art and audio assets, software project files, etc.

<br>

<!--------------------------->

### Commenting and Organizing

VSCode Snippets (for organizing properties of classes in JS modules):

-   jscBar/80
-   jscBoxApi
-   jscBoxComp
-   jscBoxInit
-   jscBoxHelper

VSCode Commands (from extension
[Comment Bars by Zack Frost](vscode:extension/zfzackfrost.commentbars)):

| Title                             | ID                           | Hotkey |
| --------------------------------- | ---------------------------- | ------ |
| Comment Bars: Generate (Quick)    | commentbars.generateQuick    |
| Comment Bars: Generate (Advanced) | commentbars.generateAdvanced |

<br>

<!--------------------------->

### Opinionated Code Formatting On Save

-   [Prettier](https://prettier.io/) formats most languages on save, using extension
    [Prettier - Code formatter](vscode:extension/esbenp.prettier-vscode)
-   [Black](https://pypi.org/project/black/) formats Python on save, using extension
    [Python: Black Formatter](vscode:extension/ms-python.black-formatter)
-   Only files with a pragma (comment containing `@format`) are formatted on save<br>
    Absence of a pragma is used to manually format some files<br>
    Exception: Python files are always formatted

<br>

<!--------------------------->

### Tests

-   Jest tests include _`.spec.ts`_ and _`.spec.tsx`_ files in any level
-   Run `just test` in repo root to run all tests

VSCode Commands (from extension
[Live Server by Ritwick Dey](vscode:extension/ritwickdey.LiveServer)):

| Title                 | ID                             | Hotkey           |
| --------------------- | ------------------------------ | ---------------- |
| Open with Live Server | extension.liveServer.goOnline  | Alt + L, Alt + C |
| Stop Live Server      | extension.liveServer.goOffline | Alt + L, Alt + O |

<br>
<br>
<br>

<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->

## License

[WTFPL License](http://www.wtfpl.net/txt/copying/)
