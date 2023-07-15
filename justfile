set windows-shell := ["cmd.exe", "/c"]
br := if os_family() == "windows" {"echo("} else {"echo $'\n'"}
installDevFile := if os_family() == "windows" {"installDev.bat"} else {"installDev.sh"}

#################
#################
_default:
    @just --list

# Update dev tools and JS dependencies
update:
    @cd dev && {{installDevFile}}
    @{{br}}
    @{{br}}
    @{{br}}
    npm install
    @{{br}}
    @{{br}}

# Delete old build artifacts
clean:
    @py dev/clean.py

# Generate build artifacts
_compile:
    tsc --build
    py dev/buildLess.py

# Delete old build artifacts then build new artifacts
build: clean _compile

# Build without cleaning old artifacts
fastb: _compile

# Run JS tests
@test:
    jest
