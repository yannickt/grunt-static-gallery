#!/bin/bash

mkdir -p medias/folder1/folder11/folder111
mkdir -p medias/folder1/folder11/folder112
mkdir -p medias/folder1/folder12
mkdir -p medias/folder2
mkdir -p medias/folder3

imglist=( \
"medias/img_a.jpg" \
"medias/folder1/folder11/img_11a.jpg" \
"medias/folder1/folder11/folder111/img_111a.jpg" \
"medias/folder1/folder11/folder111/img_111b.jpg" \
"medias/folder1/folder11/folder111/img_111c.png" \
"medias/folder1/folder11/folder111/img_111d.jpg" \
"medias/folder1/folder11/folder111/img_111e.jpg" \
"medias/folder1/folder11/folder111/img_111f.jpg" \
"medias/folder1/folder11/folder111/img_111g.jpg" \
"medias/folder1/folder11/folder111/img_111h.jpg" \
"medias/folder1/folder11/folder111/img_111i.jpg" \
"medias/folder1/folder11/folder111/img_111j.jpg" \
"medias/folder1/folder11/folder112/img_112a.jpg" \
"medias/folder1/folder11/folder112/img_112b.jpg" \
"medias/folder1/folder11/folder112/img_112c.jpg" \
"medias/folder1/folder12/img_12a.jpg" \
"medias/folder2/img_2a.jpg" \
)

color=0
for img in ${imglist[@]}; do
   echo $img
   # imagemagick command
   convert -size 1200x800 -background "hsl($color,96,192)" -gravity center label:" $img \n Original size : 1200x800 " -quality 50 -sampling-factor "1x1" "$img"
   # exiftool command
   exiftool -ExifIFD:DateTimeOriginal=now -IFD0:ImageDescription="ImageDescription of $img" -IFD0:Artist="Artist of $img" -ExifIFD:UserComment="UserComment of $img" -IFD0:XPTitle="XPTitle of $img" -IFD0:XPComment="XPComment of $img" -IFD0:XPAuthor="XPAuthor of $img" -q -overwrite_original $img
   color=$(( ($color + 17) % 256 ))
done

echo "My gallery" >medias/title.html
echo "Root album of my exemple gallery" >medias/description.html

echo "Title of folder 1" >medias/folder1/title.html

echo "Title of folder 11" >medias/folder1/folder11/title.html

echo "Title of folder 111" >medias/folder1/folder11/folder111/title.html
echo "Description for the folder 111. Et voilà !" >medias/folder1/folder11/folder111/decription.html
echo "Content of 'img_111b.html' file" >medias/folder1/folder11/folder111/img_111b.html

echo "Title of the second folder, level 1" >medias/folder2/title.html

echo "Title of the (empty) folder 3" >medias/folder3/title.html
