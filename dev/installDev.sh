#!/bin/bash

# TODO: Install dev tools with darwin/linux package manager

echo "\n\n"
echo "==== INSTALL PRE-PROCESSORS ===="
sudo npm install -g typescript
sudo npm install -g less

echo "\n\n"
echo "==== INSTALL VSCODE EXTENSIONS ===="
code --install-extension esbenp.prettier-vscode
code --install-extension zfzackfrost.commentbars
