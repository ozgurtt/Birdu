#!/bin/bash

echo $0 #this script requires ImageMagick, must be ran with bash

for entry in $(pwd)/* #each file in current working directory
do
  WIDTH=$(convert $entry -print %w /dev/null)

  #do floating point division with the 'bc' command
  TWO=$(bc -l <<< "$WIDTH / 2.0")
  FOUR=$(bc -l <<< "$WIDTH / 4.0")
  SIX=$(bc -l <<< "$WIDTH / 6.0")
  EIGHT=$(bc -l <<< "$WIDTH / 8.0")
  TEN=$(bc -l <<< "$WIDTH / 10.0")
  ELEVEN=$(bc -l <<< "$WIDTH / 11.0")

  #format the numbers to 3 decimal points
  TWO=$(printf '%.3f\n' $TWO)
  FOUR=$(printf '%.3f\n' $FOUR)
  SIX=$(printf '%.3f\n' $SIX)
  EIGHT=$(printf '%.3f\n' $EIGHT)
  TEN=$(printf '%.3f\n' $TEN)
  ELEVEN=$(printf '%.3f\n' $ELEVEN)
	
  echo "$entry-----width in 2s:: $TWO, 4s::$FOUR, 6s::$SIX, 8s::$EIGHT, 10s::$TEN, 11s::$ELEVEN"
done


