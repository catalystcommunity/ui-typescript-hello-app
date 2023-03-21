# ui-typescript-hello-app

This project requires lightmon as part of its workflow. It's easy to install, but you should do that first:

[Installing lightmon](https://github.com/reaganmcf/lightmon#installation)

To try this project, you just `npm install` and `npm run dev`

We're trying to avoid using anything but the simplest of dependencies. Work in progress.


### Testing

Tests require the static/index.html has been created. This is normally done by running the `npm run dev` which will run the rundev.sh script. Part of that copies the resulting dist/index.html to be copied back to static. This is ok to commit, it's just the last run build version.

Once that exists, and it probably does in any clone you have made before modifying anything, you can simple `npm test` and it will run jest for you.