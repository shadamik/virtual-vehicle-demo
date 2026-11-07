#!/usr/bin/env bash
set -euo pipefail
if [[ "$DEPLOY_ENV" == 'Preview' ]]; then
  [[ "$PR_NUMBER" =~ ^[0-9]+$ ]] || exit 1
  destination=".site-state/preview/pr-$PR_NUMBER"
  mkdir -p "$destination"
  rsync -a --delete build-output/ "$destination/"
else
  # Production updates never remove existing PR previews or the state branch.
  rsync -a --delete --exclude='.git' --exclude='preview' build-output/ .site-state/
fi
mkdir -p _site
rsync -a --delete --exclude='.git' .site-state/ _site/
