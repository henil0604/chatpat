#!/bin/bash

# Array of allowed branch names
allowed_branches=("main" "dev")

# Get the current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

env

# Check if the current branch is in the allowed branches array
if [[ ! " ${allowed_branches[@]} " =~ " $current_branch " ]]; then
  echo "Error: Deployment allowed only on specific branches. Current branch: $current_branch"
  exit 0
else
  echo "Deployment allowed for branch $current_branch. Proceeding with deployment."
  exit 1
fi
