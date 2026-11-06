#!/bin/bash
set -e
cd ~/tech-u-marketplace
echo "--- BEFORE ---"
git status --short
git branch --show-current
git log --oneline -1
git checkout -b backup/preserve-design-before-firebase || git checkout backup/preserve-design-before-firebase
git add -A
if ! git diff --cached --quiet; then
  git commit -m "BACKUP: Preserve formal TECH-U design before Firebase upgrade - Artifact 46 reference - 2026-11-06"
else
  git commit --allow-empty -m "BACKUP: Preserve formal TECH-U design before Firebase upgrade - Artifact 46 reference - 2026-11-06"
fi
echo "--- AFTER ---"
echo "BRANCH: $(git branch --show-current)"
echo "COMMIT: $(git rev-parse HEAD)"
git status
git push origin backup/preserve-design-before-firebase
mkdir -p backup/2026-11-06-pre-firebase
echo "GIT BACKUP DONE"
