#!/bin/bash

# TODO: Install dev tools with darwin/linux package manager

echo "\n\n"
echo "==== INSTALL PRE-PROCESSORS ===="
sudo npm install -g typescript
sudo npm install -g less

echo "\n\n"
echo "==== INSTALL VSCODE EXTENSIONS ===="
code --install-extension esbenp.prettier-vscode
code --install-extension ritwickdey.LiveServer
code --install-extension zfzackfrost.commentbars
code --install-extension ZainChen.json
code --install-extension skellock.just
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension ms-python.isort
code --install-extension ms-python.black-formatter
