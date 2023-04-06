#!/usr/bin/env bash

rm -rf dist/*
mkdir -p dist
cp -a static/* dist/
cat static/index_head.html > dist/index.html
cat static/styleblocks/*.html >> dist/index.html
cat static/templates/*.html >> dist/index.html
cat static/index_foot.html >> dist/index.html
# Copy this back for testing, it can be committed as well
cp dist/index.html static/index.html

npm run build
npm run serve

