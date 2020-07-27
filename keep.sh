#!/bin/bash

while true
do
  running=`ps -ef | grep node | grep "No Estimates"`
  if [ $running ]
  then
    echo "Running..."
  else
    echo "CRASHED!"
    exit 0
  fi
done
