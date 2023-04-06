# ui-typescript-hello-app

This started as an exploration to answer "what pain does React/Angular/Vue/Svelte alleviate for me?" We have found that given modern browser APIs, much of what these tools do is unneeded, and now it's a not-quite-finished demo of web components, routers, and eventing with vanilla JS in a full SPA.

## Status

At the moment, it's not fully complete. For instance we haven't spun up a Hello Service to hit with the `fetch` API, and we haven't made a page for all menu items.

We're satisfied with our exploration and may come back to this to finish it after some other priorities. Or we'd accept PRs if you want to finish some aspect of it for your own learning.

## Things we think are cool

- You can send an event to 100,000 callbacks and they're all called almost instantly! The browser is very fast at this.
- CSS and HTML and Javascript are separate again! Hand this same workflow over to a CSS designer and they can iterate using their favorite tools. No more trying to find a huge editor that handles JSX or some templating library thing. Separation of concerns makes for good things. (We believe this will make things easier for reusing these components in different apps ourselves.)
- The router is simple, but it could be extended to handle multiple path hierarchies and split off "params" or whatnot really easily. The control and understanding are key to us.
- None of this is a black box.
- This works in all modern browsers, even Safari! Some aspects of Web Components or Custom Elements as they're sometimes called might require a small polyfill, but that can also be understood by any dev now.
- Everything for this site is less than 20K at the time of this writing. That's unminified, and is html and the image and everything. Compare that to whatever library you think might be relevant to your use case. We don't think that magic is worth it.
- Look at the dependencies! Even dev dependencies are barely there.

## Running

This project requires lightmon as part of its workflow. Obviously you can do things however you want. It's easy to install, but you should do that first:

[Installing lightmon](https://github.com/reaganmcf/lightmon#installation)

To try this project after that, you just `npm install` and `npm run build` and `npm run serve`

If you want to run the server and compiler in automatice reloading methods, just do `npm run watch` in one terminal and `npm run serve` in another, and edit away. 

We're trying to avoid using anything but the simplest of dependencies.


### Testing

Tests require the static/index.html has been created. This is normally done by running the `npm run dev` which will run the rundev.sh script. Part of that copies the resulting dist/index.html to be copied back to static. This is ok to commit, it's just the last run build version.

Once that exists, and it probably does in any clone you have made before modifying anything, you can simple `npm test` and it will run jest for you.

### A note on bash

Bash is our choice over make or a mountain of javascript just to copy files, because bash super portable. We develop on Linux, Mac, and Windows. In Windows, there's a dozen options to use bash. We do WSL2 or Cmder, but you could use git-bash or cygwin or something else. Every dev should be comfortable with a competent CLI. Take an afternoon if you need to learn how to get that shell on your own system setup. You'll be better for it.

The biggest alternative suggested has been Make. Make is not an appropriate tool for scripting, and it requires a less portable application be installed in your system. Bash is just far easier and more flexible, and we believe it is more appropriate for working with most development workflows, Javascript repos included.
