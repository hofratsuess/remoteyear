#!/bin/sh

COMMIT_HASH="$(git log --pretty=format:%h | head -n1)"
COMMIT_URL="https://github.com/hofratsuess/remoteyear_api/commit/${COMMIT_HASH}"

curl -X POST --data "payload={\"text\": \":octocat: build <${COMMIT_URL}|#${COMMIT_HASH}> deployed successfully to <http://$1|$1> :thumbsup:\"}" $SLACK_URL
