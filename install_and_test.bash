#! /usr/bin/env bash
repo=$1
pkg=$2
tester=`pwd`

dir="$pkg"/`date +'%Y-%m-%d_%H:%M:%S'`
dir="$pkg"/`date +'%Y-%m-%d_%H:%M:%S'`

results="$tester/results/$dir"
tests="$tester/tests/$dir"
mkdir -p $results
mkdir -p $tests
cd $tests

( git clone "$repo"  --recursive | tee "$results/git_clone.log" 
  cd *
  npm install . -d | tee "$results/npm_install.log"
  npm test | tee "$results/npm_test.log"
) 
