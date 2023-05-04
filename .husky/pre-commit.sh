#!/usr/bin/env bash

branch="$(git rev-parse --abbrev-ref HEAD)"
restricted_branch_pattern='(master|develop)'
restricted_branch_message="Denied commit and push to $restricted_branch_pattern branch. Please use check out and create merge request"

if [[ $branch =~ $restricted_branch_pattern ]]; then
  echo "*****************************"
  echo "$restricted_branch_message"
  echo "*****************************"
  exit 1
fi

exit 0
