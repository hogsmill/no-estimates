#!/bin/bash

while true
do
  running=`ps -ef | grep node | grep "No Estimates"`
  echo $running
  if [ $$ -eq 0 ]
  then
    echo "Running..."
  else
    echo "CRASHED!"
    exit 0
  fi
done
