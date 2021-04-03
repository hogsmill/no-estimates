#!/bin/bash

if [ "$1" == "-f" ]; then
  FORCE=true
fi

APPS=('no-estimates' 'no-estimates-new')
for APP in ${APPS[@]};
do
  echo "------------------------------------------------"
  echo "Installing $APP"
  echo "------------------------------------------------"

  cd "/usr/apps/$APP"

  PORT=3007
  PWD=`pwd`
  APP=`basename $PWD`
  git stash
  GIT=`git pull`
  echo $GIT
  if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
    exit 0
  fi

  npm install
  npm run build
  rm /var/www/html/$APP/css/*
  rm /var/www/html/$APP/js/*
  cp -R dist/* /var/www/html/$APP
  if [ -f "src/server.js" ]; then
    SERVER=`ps -ef | grep server.js | grep "/$APP/" | awk {'print $2'}`
    if [ "$SERVER" != "" ]; then
      kill -9 $SERVER
    fi
  fi

  php /usr/apps/monitor/src/lib/outdated.php &
Done
