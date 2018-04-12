# Deployment Script and Process

## Script

There is a bash script called "[deploy.sh](../deploy.sh)" in the project's root directory for easy deployment to GitHub Pages. But before using the script, you need to have the remote url for github:

- `git remote add github https://github.com/dorukgezici/SpaceHunt.git` (You need to have writing access to the repo)

- `npm run build`

- In this step, run `git add -A`, `git commit -m "new build"` and `git push`

- In the root directory, run `bash deploy.sh`

- The build directory is pushed to gh-pages branch in the [GitHub repo](https://github.com/dorukgezici/SpaceHunt.git)!

- The website is live at [SpaceHunt.tk](http://spacehunt.tk)