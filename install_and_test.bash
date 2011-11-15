#! /usr/bin/env bash
repo=$1
pkg=$2
tester=`pwd`

timestamp=`date +%s`
dir="$pkg"/"$timestamp"

results="$tester/results/$dir"
summary="$results/summary.yaml"
tests="$tester/tests/$dir"
mkdir -p $results
mkdir -p $tests
echo CREATE: $dir
cd $tests

declare -x returned=1
echo TESTING "$pkg"@"$commitish" `date`

(git clone "$repo"  --recursive "$pkg" 2>&1;echo clone: $? >> "$summary") | tee "$results/git_clone.log" 
cd $pkg
commitish=`git rev-parse HEAD`
#tests= `(ls * -1d | wc -l) || echo 0`
(npm install . -d 2>&1 ; echo install: $? >> "$summary") | tee "$results/npm_install.log"
(npm test 2>&1; export returned=$?; echo test: $? >> "$summary") | tee "$results/npm_test.log"
cd $results/..
runs=`ls -1d | wc -l`
echo "$timestamp" $runs_"$commitish"
mv "$timestamp" $runs_"$commitish"
#echo $returned

TEST=`grep test: $runs_"$commitish"/summary.yaml`
TEST=${TEST##test: }
echo $TEST if test is zero, run the pass script for this project. else run the fail script.

#
# search recursively for the post test scripts
#
cd $tester
$tester/run_posttest $pkg $TEST $tests