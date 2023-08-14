set windows-shell := ["cmd.exe", "/c"]
br := if os_family() == "windows" {"echo("} else {"echo $'\n'"}
installDevFile := if os_family() == "windows" {"installDev.bat"} else {"installDev.sh"}

#################
#################
_default:
    @just --list

# Update dev tools and JS dependencies. Requires admin rights. Run cmd prompt or shell as admin.
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

# Delete old build artifacts
clean:
    @py dev/clean.py
    @{{br}}
    @{{br}}

# Build source code
_compile:
    tsc --build
    py dev/buildLess.py

# Build JSDoc pages
_compileDocs:
    typedoc

# Delete old build artifacts then build new artifacts
rebuild: clean _compile _compileDocs
    @{{br}}
    @{{br}}

# Build without cleaning old artifacts
build: _compile _compileDocs
    @{{br}}
    @{{br}}

# Run JS tests
@test:
    jest
