#!/bin/bash

echo $0 #this script requires ImageMagick, must be ran with bash

#copied from http://askubuntu.com/questions/179898/how-to-round-decimals-using-bc-in-bash
round()
{
echo $(printf %.f $(echo "scale=$2;(((10^$2)*$1)+0.5)/(10^$2)" | bc))
};





for entry in $(pwd)/* #each file in current working directory
do
  WIDTH=$(convert $entry -print %w /dev/null)
  HEIGHT=$(convert $entry -print %h /dev/null)

  #do floating point division with the 'bc' command
  #I expect the images to be about 120 pixels. Thus use that to approximate. This may be wrong, and the output will need to be checked in Phaser
  NUM_FRAMES=$(bc -l <<< "$WIDTH / 120.0")
  NUM_FRAMES=$(round $NUM_FRAMES 10) #Round to nearest integer
  INDIVIDUAL_WIDTH=$(bc -l <<< "$WIDTH / $NUM_FRAMES")

  FILE_NAME=$(basename $entry)
  echo "this.load.spritesheet('${FILE_NAME%.*}', 'assets/birds/$(basename $entry)', $INDIVIDUAL_WIDTH, $HEIGHT);"
done


