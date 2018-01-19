# fh-mbaas-api

fh-mbaas-api provides FeedHenry MBaaS APIs for Node.js cloud apps.

[![npm package](https://nodei.co/npm/fh-mbaas-api.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/fh-mbaas-api/)

[![Build status](https://img.shields.io/travis/feedhenry/fh-mbaas-api/master.svg?style=flat-square)](https://travis-ci.org/feedhenry/fh-mbaas-api)
[![Dependency Status](https://img.shields.io/david/feedhenry/fh-mbaas-api.svg?style=flat-square)](https://david-dm.org/feedhenry/fh-mbaas-api)
[![Known Vulnerabilities](https://snyk.io/test/npm/fh-mbaas-api/badge.svg?style=flat-square)](https://snyk.io/test/npm/fh-mbaas-api)


|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache License, Version 2.0  |
| Build:          | npm  |
| Documentation:  | http://docs.feedhenry.com/v3/api/cloud_api.html  |
| Issue tracker:  | https://issues.jboss.org/projects/FH/summary  |
| Mailing list:   | [feedhenry-dev](https://www.redhat.com/archives/feedhenry-dev/) ([subscribe](https://www.redhat.com/mailman/listinfo/feedhenry-dev))  |
| IRC:            | [#feedhenry](https://webchat.freenode.net/?channels=feedhenry) channel in the [freenode](http://freenode.net/) network.  |

## Usage
fh-mbaas-api is included as standard with your cloud app code.

For custom apps, add the module via npm by running the following for the root of your app

```
npm install --save fh-mbaas-api
```

This will install the latest version of fh-mbaas-api and save the installed version in your package.json

## Documentation
Documentation for the $fh cloud API is maintained at the [Red Hat Customer Portal.](https://access.redhat.com/documentation/en-us/red_hat_mobile_application_platform_hosted/3/html/cloud_api/)

## Deprecated
Legacy Rhino functions have been deprecated. These are listed below - with their replacements **in bold**. All replacements listed but '$fh.web' have drop-in replacements available.

* $fh.web -> **[request](https://github.com/mikeal/request)**
* $fh.log -> **console.log**
* $fh.parse -> **JSON.parse**
* $fh.stringify  **JSON.stringify**

## Tests
In order to run the tests, please make sure you have [Docker](https://www.docker.com/) installed.

Before running tests do:

```
npm install
npm install -g grunt-cli
```

Then to run the tests use ```npm test```

On Windows, use ```npm run testwindows```

## API logging

Users of the fh-mbaas-api can then enable logging if they would like to see more output. This is useful for debugging purposes.
It's possible to pass environment variables to enable the logging according the rules specified for [debug](https://www.npmjs.com/package/debug) module:

```
DEBUG="fh-mbaas-api:*" ./yourscript
```
If `DEBUG_COLORS=0` is passed also it will print log messages with proper timestamps. This is automatically enabled outside properly supported terminal.

## Contributing to fh-mbaas-api

### Pull Requests

All PRs that involve a version bump to fh-mbaas-api to should also update the CHANGELOG.md file in the root of the repo. All notable changes to the codebase since the last version bump should be included.

### Commit Messages

All commit messages should adhere to the following standard:

```
<type>[optional scope]: <description> [issue reference**]
 
[optional body]
 
[optional footer]
```

** if commit relates to a specific JIRA/ issue ticket include the reference here.

Examples of commits following this convention:

- bug-fixes: `git commit -a -m "fix(parsing): fixed a bug in our parser (RHMAP-1234)"`
- features: `git commit -a -m "feat(parser): we now have a parser \o/ (FH-3456)"`
- breaking changes: 
```
git commit -a -m "feat(new-parser): introduces a new parsing library (FH-6789)
BREAKING CHANGE: new library does not support foo-construct"
```
- other changes: `git commit -a -m "docs: fixed up the docs a bit"`