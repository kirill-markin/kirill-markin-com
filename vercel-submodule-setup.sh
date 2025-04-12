#!/bin/bash

# Exit on error
set -e

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN environment variable is not set"
  exit 1
fi

# Clone the private submodule
git submodule init
git config -f .gitmodules submodule.obsidian-vault.url https://${GITHUB_TOKEN}@github.com/kirill-markin/obsidian-vault.git
git submodule update

# Sync the submodule
git submodule sync
git submodule update --init --recursive

echo "Successfully cloned private submodule" 