#!/usr/bin/env sh
# abort on errors
set -e

# cleanup
rm -rf ./build
rm -rf ./node_modules

# build
npm ci --cache .npm --prefer-offline --silent --no-optional
npm run build

# navigate into the build output directory
cd build

echo 'chat.agoston.io' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:agoston-io/agoston-example-react-urql.git master:gh-pages

cd -
