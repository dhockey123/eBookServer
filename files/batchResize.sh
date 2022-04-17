#!/bin/bash
# Resize images in calibre library
for i in *Library/*/*/*.jpg; do
convert "$i" -resize 300x480! "$i"; 
done
