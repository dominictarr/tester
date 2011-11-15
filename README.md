#tester

super simple test github post commit hook triggered tester.


``` bash
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

( git clone "$repo"  --recursive > "$results/git_clone.log" 
  cd *
  npm install . -d > "$results/npm_install.log"
  npm test > "$results/npm_test.log"
)