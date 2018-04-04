git checkout master
FILE="build/CNAME"
[[ -f $FILE ]] || echo "spacehunt.tk" >> $FILE && git add $FILE && git commit -m "Added CNAME file." && echo "Added CNAME file"
git subtree split --prefix build -b gh-pages # create a local gh-pages branch containing the splitted build folder
git push -f github gh-pages:gh-pages # force the push of the gh-pages branch to the remote gh-pages branch
git branch -D gh-pages # delete the local gh-pages branch
