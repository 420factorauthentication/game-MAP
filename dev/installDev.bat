@REM use @echo( for newline
@REM info: https://www.dostips.com/forum/viewtopic.php?p=4554#p4554

@echo(
@echo(
@echo(
@echo ==== INSTALL DEV TOOLS ====
call winget install Microsoft.VisualStudioCode --scope=machine --override "/SILENT /mergetasks=""quicklaunchicon,addcontextmenufiles,addcontextmenufolder,associatewithfiles,addtopath,!runcode"""
call winget install --scope=machine -e --id Git.Git
call winget install --scope=machine -e --id GitHub.GitLFS
call winget install --scope=machine -e --id GitHub.cli
call winget install --scope=machine -e --id Casey.Just
call winget install --scope=machine -e --id OpenJS.NodeJS
call winget install --scope=machine -e --id Python.Python.3.12

@echo(
@echo(
@echo(
@echo ==== INSTALL PRE-PROCESSORS ====
call npm install -g typescript
@echo on
call npm install -g less
@echo on

@echo(
@echo(
@echo(
@echo ==== INSTALL VSCODE EXTENSIONS ====
call code --install-extension esbenp.prettier-vscode
@echo on
call code --install-extension ritwickdey.LiveServer
@echo on
call code --install-extension zfzackfrost.commentbars
@echo on
call code --install-extension ZainChen.json
@echo on
call code --install-extension skellock.just
@echo on
call code --install-extension ms-python.python
@echo on
call code --install-extension ms-python.vscode-pylance
@echo on
call code --install-extension ms-python.isort
@echo on
call code --install-extension ms-python.black-formatter
@echo on
