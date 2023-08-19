set windows-shell := ["cmd.exe", "/c"]
br := if os_family() == "windows" {"echo("} else {"echo $'\n'"}
installDevFile := if os_family() == "windows" {"installDev.bat"} else {"installDev.sh"}

#################
#################
_default:
    @just --list

# Build app
build: _compile
    @{{br}}
    @{{br}}

_compile:
    tsc -b .config
    py dev/buildLess.py

# Delete old app then build app
rebuild: _cleanApp _compile
    @{{br}}
    @{{br}}

_cleanApp:
    @py dev/cleanApp.py
    @{{br}}
    @{{br}}

# Update dev tools and JS dependencies. Requires admin.
updateDev:
    @cd dev && {{installDevFile}}
    @{{br}}
    @{{br}}
    @{{br}}
    npm install
    @{{br}}
    @{{br}}
    @{{br}}
    npm update
    @{{br}}
    @{{br}}
    @{{br}}
    npm prune
    @{{br}}
    @{{br}}

# Build TypeDoc pages
buildDocs: _compileDocs
    @{{br}}
    @{{br}}

_compileDocs:
    typedoc

# Delete old TypeDoc pages then build TypeDoc pages
rebuildDocs: _cleanDocs _compileDocs
    @{{br}}
    @{{br}}

_cleanDocs:
    @py dev/cleanDocs.py
    @{{br}}
    @{{br}}

# Run JS tests
@test:
    jest -c .config/jest.config.js
