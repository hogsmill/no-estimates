#!/bin/bash

FORCE=false
NEW=false
while [ $1 ]
do
  echo $1
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  shift
done

BASEPORT=4350
REPO="https://github.com/hogsmill/no-estimates.git"
MAINNOESTIMATESAPP="no-estimates"
MAINNOESTIMATESCOLLECTION="noEstimates"
MAINNOESTIMATESGAMECOLLECTION="noEstimatesGames"
MAINNOESTIMATESAPPNAME="No Estimates"
MAINKANBANAPP="kanban-playground"
MAINKANBANCOLLECTION="kanbanPlayground"
MAINKANBANGAMECOLLECTION="kanbanPlaygroundGames"
MAINKANBANAPPNAME="Kanban Playground"
ROUTES=(
  '','','No Estimates'
  'new','New','No Estimates'
  'dex','Dex','No Estimates'
  'zoran','Zoran',,'No Estimates'
  'guardian','Guardian','No Estimates'
  'ratesetter','Ratesetter','No Estimates'
  'eagile','EverydayAgile','No Estimates'
  'and','And','No Estimates'
  '','','Kanban Playground'
  'new','New','Kanban Playground'
  'dex','Dex','Kanban Playground'
  'zoran','Zoran','Kanban Playground'
  'guardian','Guardian','Kanban Playground'
  'ratesetter','Ratesetter','Kanban Playground'
  'eagile','EverydayAgile','Kanban Playground'
  'and','And','Kanban Playground'
)

for ((i = 0; i < ${#ROUTES[@]}; i++))
do
  REC="${ROUTES[$i]}"
  ROUTE=`echo $REC | cut -d, -f1`
  COLLECTIONSUFFIX=`echo $REC | cut -d, -f2`
  APPTYPE=`echo $REC | cut -d, -f3`

  if [ "$APPTYPE" == "No Estimates" ]; then
    BASEAPP=$MAINNOESTIMATESAPP
    APP=$MAINNOESTIMATESAPP
    COLLECTION=$MAINNOESTIMATESCOLLECTION
    GAMECOLLECTION=$MAINNOESTIMATESGAMECOLLECTION
    APPNAME=$MAINNOESTIMATESAPPNAME
  fi

  if [ "$APPTYPE" == "Kanban Playground" ]; then
    BASEAPP=$MAINKANBANAPP
    APP=$MAINKANBANAPP
    COLLECTION=$MAINKANBANCOLLECTION
    GAMECOLLECTION=$MAINKANBANGAMECOLLECTION
    APPNAME=$MAINKANBANAPPNAME
  fi

  if [ "$ROUTE" != "" ]; then
    APP="${APP}-${ROUTE}"
  fi
  if [ "$COLLECTIONSUFFIX" != "" ]; then
    COLLECTION="${COLLECTION}${COLLECTIONSUFFIX}"
  fi
  if [ "$COLLECTIONSUFFIX" != "" ]; then
    GAMECOLLECTION="${GAMECOLLECTION}${COLLECTIONSUFFIX}"
  fi
  let PORT=$BASEPORT+$i

#REPO="https://github.com/hogsmill/no-estimates.git"
#MAINAPP="no-estimates"
#APPS=(
#  'no-estimates,noEstimatesGames,noEstimates,3007,No Estimates'
#  'no-estimates-funconf,noEstimatesFunconfGames,noEstimatesFunconf,3042,No Estimates,No Estimates - Funconf 2021'
#  'no-estimates-new,noEstimatesNewGames,noEstimatesNew,3020,No Estimates,No Estimates Private'
#  'no-estimates-dex,noEstimatesDexGames,noEstimatesDex,3051,No Estimates,No Estimates Dex'
#  'no-estimates-ratesetter,noEstimatesRatesetterGames,noEstimatesRatesetter,3057,No Estimates,No Estimates'
#  'no-estimates-eagile,noEstimatesEverydayAgileGames,noEstimatesEverydayAgile,3065,No Estimates,No Estimates'
#  'no-estimates-and,noEstimatesAndGames,noEstimatesAnd,3112,No Estimates,No Estimates'
#  'no-estimates-zoran,noEstimatesZoranGames,noEstimatesZoran,3079,No Estimates,No Estimates'
#  'kanban-playground,kanbanPlaygroundGames,kanbanPlayground,3030,Kanban Playground,Kanban Playground'
#  'kanban-playground-ratesetter,kanbanPlaygroundRatesetterGames,kanbanPlaygroundRatesetter,3058,Kanban Playground,Kanban Playground'
#  'kanban-playground-eagile,kanbanPlaygroundEverydayAgileGames,kanbanPlaygroundEverydayAgile,3066,Kanban Playground,Kanban Playground'
#  'kanban-playground-and,kanbanPlaygroundAndGames,kanbanPlaygroundAnd,3104,Kanban Playground,Kanban Playground'
#)
#
#for ((i = 0; i < ${#APPS[@]}; i++))
#do
#  REC="${APPS[$i]}"
#
#  APP=`echo $REC | cut -d, -f1`
#  GAMECOLLECTION=`echo $REC | cut -d, -f2`
#  COLLECTION=`echo $REC | cut -d, -f3`
#  PORT=`echo $REC | cut -d, -f4`
#  APPTYPE=`echo $REC | cut -d, -f5`
#  APPNAME=`echo $REC | cut -d, -f6`

  echo "------------------------------------------------"
  if [ -z "$APPNAME" ]; then
    echo "Installing $APPTYPE:$APPTYPE ($GAMECOLLECTION, $COLLECTION, $PORT)"
  else
    echo "Installing $APPTYPE:$APPTYPE ($GAMECOLLECTION, $COLLECTION, $PORT, $APPNAME)"
  fi
  echo "------------------------------------------------"

  DIR="/usr/apps/$APP"
  if [ ! -d $DIR ]; then
    git clone $REPO $DIR
  fi
  ENVFILE="$DIR/.env"
  echo "VUE_APP_PORT=$PORT" > $ENVFILE
  echo "VUE_APP_TYPE=$APPTYPE" >> $ENVFILE
  echo "VUE_APP_COLLECTION=$COLLECTION" >> $ENVFILE
  echo "VUE_APP_GAME_COLLECTION=$GAMECOLLECTION" >> $ENVFILE
  if [ ! -z "$APPNAME" ]; then
    echo "VUE_APP_NAME=$APPNAME" >> $ENVFILE
  fi

  cd $DIR

  rm $DIR/package-lock.json
  rm -rf $DIR/node_modules

  PWD=`pwd`
  APP=`basename $PWD`
  git stash
  GIT=`git pull`
  echo $GIT
  if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
    exit 0
  fi

  npm install --legacy-peer-deps
  npm run build
  if [ ! -d /var/www/html/$APP/ ]; then
    mkdir /var/www/html/$APP
  fi
  if [ -d /var/www/html/$APP/css ]; then
    rm /var/www/html/$APP/css/*
  else
    mkdir /var/www/html/$APP/css
  fi
  if [ -d /var/www/html/$APP/js ]; then
    rm /var/www/html/$APP/js/*
  else
    mkdir /var/www/html/$APP/js
  fi
  cp -R dist/* /var/www/html/$APP
  if [ -f "src/server.js" ]; then
    SERVER=`ps -ef | grep server.js | grep "/$APP/" | awk {'print $2'}`
    if [ "$SERVER" != "" ]; then
      kill -9 $SERVER
    fi
  fi
  if [ $i == 0 ]; then
      rm -rf $DIR/node_modules/.cache
    else
      rm -rf node_modules
      ln -s ../$BASEAPP/node_modules node_modules
    fi
    rm -rf $DIR/dist
done

ps -ef | grep php | grep outdated
if [ $? -eq 1 ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi
