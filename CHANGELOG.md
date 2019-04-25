# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [9.1.5] - Friday Apr 26, 2019
### Change
- Revert unifiedpush-node-sender dependency to 0.12.1 to address breaking change introduced

## [9.1.4] - Thurs Nov 1, 2018
### Change
- Upgrade fh-mbaas-express to 6.1.2 ( Patch version ). console.debug is not available in nodejs 6.x

## [9.1.3] - Fri Oct 19, 2018
### Change
- Upgrade fh-db to 3.3.2 ( Patch version ). Adds funtionality to fix JavaScript Dates getting overwritten as Strings when saved in the databrowser. Dates need to be saved as 
`
{
   $fhdate: "2018-10-10T11:54:12.366Z"
}
`
. The SERIALISE_FH_DATES env var can be set on the studio to return JavaScript Dates from fh-db in this format now.

## [9.1.2] - Thu Sept 26, 2018
### Change
- Upgrade the redis lib to 2.8.0 ( Minor version )

## [9.1.1] - Thu Sept 26, 2018
### Change
- Upgrade unifiedpush-node-sender dependency to 0.16.0
- Upgrade request dependency to 2.88.0
- Upgrade fh-mbaas-express to 6.1.1

## [9.1.0] - Wed Sep 19, 2018
### Changed
- Upgraded `fh-mbaas-express` to `6.1.0` for updated caching of service calls.

## [9.0.0] - Thu Aug 16, 2018
### Changed
- Removed support for Node4
- Added support for Node8 and Node10

## [8.2.4] - Thu Jul 26, 2018
### Changed
- Upgrade fh-sync version from `1.0.14` to `1.0.15` to resolve an issue where the message was not being returned to the client from the collision handler

## [8.2.3] - Tue Jun 14, 2018
### Changed
- Upgrade fh-db version from `3.3.0` to `3.3.1`
- Update CI process to use supported versions

## [8.2.2] - Tue May 1, 2018
### Fix
- Add eslint configuration and fix files 


## [8.2.1] - Tue Feb 27, 2018
### Changed
- updated fh-sync dependency to remove a direct link to github in its dependencies prior to v1.0.14 (RHMAP-19582)
```git
-    "fh-sync": "^1.0.5",
+    "fh-sync": "^1.0.14",
```

## [8.2.0] - Tue Feb 6, 2018
### Added
- fix: update fh-mbaas-client to 1.1.1, to include bug fixes (FH-4374, RHMAP-18299)
- fix: remove sonar-project.properties, as its no longer used (FH-4374)
- fix: update npm-shrinkwrap file (FH-4374)
- fix: bump minor version based on dependency updates (FH-4374)
- fix: update request version to 2.83.0 (FH-4374)
- fix: update fh-mbaas-express (FH-4374)
- fix: package.json to reduce vulnerabilities (FH-4374)


## [8.1.4] - Fri Jan 19, 2018
### Added
- adds note to README to include JIRA/ issue reference in to commit messages


## [8.1.3] - Wed Jan 17, 2018
### Added
- adds changelog to repo


## [8.1.2] - Wed Nov 22 12:39:04 2017 +0000
### Changed
- updates fh-mbaas-express to 5.9.2 to return actual millicore error
```git
-    "fh-mbaas-express": "~5.9.1",
+    "fh-mbaas-express": "~5.9.2",
```


## [8.1.1] - Thu Nov 9 22:48:08 2017 +0000
### Changed
- Updates fh-mbaas-express to 5.9.1 to resolve issue with service api key not being sent in requests
```git
-    "fh-mbaas-express": "~5.9.0",
+    "fh-mbaas-express": "~5.9.1",
```


## [8.1.0] - Thu Nov 2 16:10:50 2017 +0000
### Changed
- Updates fh-mbaas-express to 5.9.0 for mbaas service app api key authorised project check 
```git
-    "fh-mbaas-express": "5.7.1",
+    "fh-mbaas-express": "~5.9.0",
```


## [8.0.3] - Wed Oct 25 17:08:58 2017 +0100
### Changed
- Fixed blocker bug in fh.db list call which caused Databrowser filtering to return no results
```git
-    "fh-db": "3.1.0",
+    "fh-db": "3.3.0",
```


## [8.0.2] - Mon Sep 11 15:06:51 2017 +0100
### Added
- Jenkinsfile for building on Wendy

### Changed
- updates dependencies:
```git
-    "fh-mbaas-express": "5.7.0",
+    "fh-mbaas-express": "5.7.1",
-    "grunt": "^0.4.5",
+    "grunt": "^1.0.1",
-    "grunt-fh-build": "^0.5.0",
+    "grunt-fh-build": "^2.0.0",
```


## [8.0.1] - Mon Sep 11 15:06:51 2017 +0100
### Added
- Support for node 6 (6.9.1)

### Changed
- Bumped minor version of fh.db due to update to node engines.
```git
-    "fh-db": "3.0.0",
+    "fh-db": "3.1.0",
```
- upgrades support from node 4.3 to 4.4

### Removed
- Support for node 0.10


## [8.0.0] - Tue Aug 29 11:44:08 2017 +0100
### Changed
Breaking API changes were introduced in the fh.db list call. Bumped major version:
```git
-    "fh-db": "2.0.0",
+    "fh-db": "3.0.0",
```


## [7.0.16] - Mon Jul 17 15:55:53 2017 +0100
### Changed
- updates dependencies:
```git
-    "fh-sync": "^1.0.4",
+    "fh-sync": "^1.0.5",
```


## [7.0.15] - Fri Jul 14 16:49:18 2017 +0100
### Changed
- Reverted to 2.0.0 due to breaking API changes in the minor version bump to 2.1.0
```git
-    "fh-db": "2.1.0",
+    "fh-db": "2.0.0", 
```


## [7.0.14] - Fri Jul 14 14:35:28 2017 +0100
### Changed
- updates dependencies:
```git
-    "fh-security": "0.2.0",
+    "fh-security": "0.2.1",
```


## [7.0.13] - Tue Jul 11 14:38:08 2017 +0100
### Changed
- This updates the version of the fh-sync module to include a fix for the ttl of queue messages. See https://github.com/feedhenry/fh-sync/pull/22 for more info.
- updates dependencies:
```git
-    "fh-sync": "1.0.3",
+    "fh-sync": "^1.0.4",
```

### Removed
- removed dependencies no longer needed:
```git
-    "backoff": "^2.5.0",
-    "colors": "0.6.2",
-    "cycle": "1.0.3",
-    "eyes": "0.1.8",
-    "fh-component-metrics": "2.7.0",
-    "moment": "2.15.2",
-    "mongodb": "2.1.18",
-    "mongodb-lock": "0.4.0",
-    "mongodb-queue": "2.2.0",
-    "parse-duration": "0.1.1",
-    "pkginfo": "0.2.3",
-    "stack-trace": "0.0.9",
```


## [7.0.12] - Fri May 26 11:03:33 2017 +0100
### Changed
- Breaking API changes were introduced in the fh.db list call. Should have been a major version bump on fh.db
```git
-    "fh-db": "2.0.0",
+    "fh-db": "2.1.0", 
```


## [7.0.11] - Tue Jun 6 15:18:35 2017 +0100
### Changed
- removes sync api prefix
- updates dependencies:
```git
-    "fh-sync": "~1.0.0",
+    "fh-sync": "~1.0.1",
```


## [7.0.10] - Tue May 23 11:31:11 2017 +0100
### Added
- Added MONGODB_VERSION env vars for MongoDB 2.4 & 3.2 to the travis build matrix 

### Changed
- Update to ensure an update object is passed in for tests
- updates dependencies:
```git
-    "fh-sync": "^1.0.0-RC1",
+    "fh-sync": "~1.0.0",
```

### Removed
- Removed sync source code & refactored fh-mbaas-api to now use decoupled fh-sync library instead


## [7.0.9] - Tue May 16 13:05:23 2017 +0100
### Changed
- Fixed background typo


## [7.0.8] - Tue May 16 09:41:47 2017 +0100
### Changed
- Uses stringify for error messages
- Returns sync error to conect() requests by sync clients if sync not ready to start; 'crashed' notification sent to client and client will retry later.
- Corrects null error (FH-3591)
- Change the default sync worker interval & backoff settings to take full advantage of CPU when the sync queue is busy and to allow the CPU to be used for other things when the sync queue is not busy.

### Removed
- Removes 'stop' test


## [7.0.7] - Fri May 12 15:42:56 2017 +0100
### Changed
- Uses mongodb ttl to remove queue messages
- Makes sure only one cleaner job will remove the data when there are multiple workers
- updates fh-component-metrics dependency to use version from tag 
- updates fh-component-metricsdependencies to add support for base tags:
```git
-    "fh-component-metrics": "~2.6.1",
+    "fh-component-metrics": "2.7.0",
```
- Avoids race conditions when creating the indexes on the mongodb queue collections

### Removed
- removes unneeded syncUtils dependencies:
```git
-var syncUtil = require('./util');
-var debug = syncUtil.debug;
-var debugError = syncUtil.debugError;
-var parseDuration = require('parse-duration');
```


## [7.0.6] - Tue May 9 16:28:33 2017 +0100
### Added
- Added error event listener for Redis client

### Changed
- updates dependencies:
```git
-    "fh-component-metrics": "~2.6.0",
+    "fh-component-metrics": "2.6.1",
```


## [7.0.5] - Fri May 5 16:55:25 2017 +0100
### Added
- Added error-debugging
  - Added `fh-mbaas-api:sync:error` debug level
  - Added error debug level for cache
  - Added error debug level for db
  - Added error debug level for call
  - Added error debug level for init
  - Added error debug level for stats
- Added an integration test for datasetClientsCleaner
- Added a new index on the fhsync_datasetClients collection to improve performance


## [7.0.4] - Wed May 3 11:08:02 2017 +0100
### Changed
- Prefixed all metrics with a metricsKey
- Improved the performance & memory usage when deleting datasetClients


## [7.0.3] - Fri Apr 28 12:53:14 2017 +0100
### Changed
- If FH_USE_LOCAL_DB is set, also set the FH_MONGODB_CONN_URL env var to a localhost string so sync can start.


## [7.0.2] - Thu Apr 27 15:58:53 2017 +0100
### Changed
- Improved performance and memory usage when list dataset clients


## [7.0.1] - Tue Apr 25 12:47:10 2017 +0100
### Removed
- Removes Object.freeze
- Removes unused underscore library


## [7.0.0.4] - Thu Apr 13 12:34:41 2017 +0100
### Added
- Adds failing tests for setting handlers/interceptors before init

### Changed
- Fixes bug around SyntaxError when doing a JSON.parse in the cache.js tests

### Removed
- Removes real mongodb client connection from unit tests
- Removes test_sync.js


## [7.0.0.3] - Wed Apr 12 12:26:44 2017 +0100
### Changed
- Change default dataset sync frequency (from 30 to 10) to match clients


## [7.0.0.2] - Tue Apr 11 17:26:09 2017 +0100
### Added
- Adds metrics client report concurrency

### Changed
- Prevents `start` getting called multiple times (sync)


## [7.0.0.1] - Tue Apr 11 12:25:13 2017 +0100
### Added
- Adds cache layer to improve the performance when read records for a given datasetclient (sync)
- Adds sync metric for queue size
- Adds backoff strategy to workers so that they will not consume too much resources when there are no jobs to process

### Changed
- Updates sync configuration options for queues and workers
- Update log statement to use debug
- Change to ensure sync backoff strategy value is case insensitive
- Changes to ensure clients update when there is a collision (Some cases where a client will not update its records from a collision when coming online from an offline state. This can result in a record not being updated on a client until they update another record, which could take a while.)
- Updated tests
- Change to allow configuration of the worker concurrencies (sync)
- Change to add api to allow override the hash functions (sync)
- Fixes bug where sync-server will crash if `clientRecs` is not provided in the body of a syncRecords request
- Changes log to be more description when dataset clients are inactive
- removes winston dependency

### Removed
- Removes setLoglevel from test_sync_apis.js


## [7.0.0.0] - Mon Mar 27 14:59:14 2017 +0100

_**note:**_ fh-mbaas-api v7 sees the implementation of v2 of the sync library. This major update to the sync library focused on making the sync server library horizontally scale to improve performance while making it easy to debug, and retaining current performance. While sync v2 was designed to be backwardly compatible with v1, some code changes may be required to upgrade codebases from v1 of the sync library to v2. 

### Added 
- Added sync tests
  - for new functionality
  - new integration tests for sync & syncRecords APIs
  - integrates sync-acceptance-testing into Travis build
  - integration test for redis & mongodb
  - tests for overriding the collision handlers and the default collision handlers.
- Added code implementations for new sync functionality
  - Adds worker implementation in sync
  - Added sync processor implementation
  - Adds sync scheduler
  - Adds ack processor
  - Adds pending change processor
  - Added hash provider for sync
  - Adds implementation for sync http handler
  - Adds syncRecords implementation
  - Adds default implementation of the dataHandler for cases where a user does not provide an override.
  - Adds function for collision collection names
  - Adds syncRecords implementation
  - Adds implementation for the interceptors (sync)
  - Implement the lock interface. Adds a wrapper around a modified version of mongodb-lock which supports 2.x of the mongodb client. The wrapper stores all locks created and will create a lock if it doesn't exist during an acquisition request.
  - Adds implementation for stop & stopAll (sync)

- Metrics additions
  - Added metrics client to collect metrics data
  - Adds metrics gauge for the queue size

- Other changes
  - Adds JenkinsFile
  - Adds global data handler overrides
  - Adds support to automatically delete the messages from the queue (sync)
  - Adds missing indexes to improve mongodb query performance
  - Adds a background task that will cleanup inactive dataset clients periodically
  - Adds sync_ready event to the fh api. This change included:
    - adding a new `events` EventEmitter object to the fh API i.e. `fh.events`
    - passing this into the sync server
    - emitting a `sync:ready` event when sync is connected OK to mongo &
      redis
    - removing an uneccessary 'bootstrap' call for db string (& fix fhdb
      test)


### Changed 
- Code changes related to new sync functionality
  - Refactors sync-server out of index.js into sync-server.js
  - Add start function with wiring up of workers/scheduler
  - Adds & implements mongodbQueue implementation
  - ack the sync job if they finished successfully
  - Implements the sync datahandlers so that each dataset can have it's own datahandler for list/create/read/update/delete/collision.
  - Changes doCreate(), doList() in sync to return data in correct format
  - Adds sync implementation using MongoDB
  - Adds sync implementation for storage.js
  - Fixes sync.connect arity call from mbaas api (No metrics conf means metrics disabled; This is OK by default)
  - Change to ensure only 1 sync request is put on the queue when a dataset client is due to a sync call
  - Split storage.js into dataset-clients and sync-updates


- Sync tests
  - Tweaks travis tests to only run unit & integration tests for node 0.10, & unit, integration & acceptance for node 4
  - Updates tests for default datahandlers


- Other sync changes
  - Renames cache to storage in sync
  - Changes function names for consistency
  - Changes to logging within sync framework to ensure consistency of logging 
  - Marks pending updates as failed where a datasetclient has been removed from the db (via a cleanup task for inactive clients) yet there are still pending items in the queue for that datasetclient, as we don't have enough info to process it correctly.
  - Formats comments as proper jsdoc
  - Change to not lock the datasetclient collection on sync api call
  - Adds new config option (sync)
  - Change to use debug module for logging (sync)
  - Changed to use updateOne instead of deprecated update
 

### Removed
- Removes the start API from the sync server


## [6.1.8] - Wed Mar 15 11:49:24 2017 +0000
### Changed
- updates dependencies to mitigate qs and moment vulnerabilities
```git
-    "fh-mbaas-client": "0.15.0",
-    "fh-mbaas-express": "5.6.9",
+    "fh-mbaas-client": "0.16.5",
+    "fh-mbaas-express": "5.6.10",
-    "moment": "2.14.1",
+    "moment": "2.15.2",
-    "request": "2.74.0",
+    "request": "2.81.0",
-    "unifiedpush-node-sender": "0.12.0",
+    "unifiedpush-node-sender": "0.12.1",
```


## [6.1.7] - Wed Mar 15 14:31:38 2017 +0000
### Changed
- Fixes travis CI build dependency on docker by adding to 'services'
- updated fh-db as couldn't import a previously exported empty json collection within the Studio's Data Browser:
```git
-    "fh-db": "1.2.5",
+    "fh-db": "1.4.4", 
```


## [6.1.6] - Mon Mar 6 17:24:38 2017 +0000
### Added
- Added support for custom hashing rules for sync records

### Changed
- Integrated sync-acceptance-testing into Travis build
- Fixed bug where databrowser export doesn't work if database not upgraded


## [6.1.5] - Wed Feb 1 13:41:50 2017 +0100
### Added
- Added support for response handler (sync)
- Added test for responseInterceptor

### Changed
- updated dependency:
```git
-    "fh-mbaas-express": "5.6.8",
+    "fh-mbaas-express": "5.6.9",
```


## [6.1.4] - Thu Jan 19 10:52:27 2017 +0000
### Added
- Adds extra sync tests to 'unit' test run
- Adds note to readme re multiple sync loop caveat

### Changed
- Change in logging level (from `error` to `info`)


## [6.1.3] - Wed Jan 4 18:01:56 2017 +0000
### Changed
- version number of fhm-mbaas-api from 6.1.2 to 6.1.3 to republish to NPM


## [6.1.2] - Wed Jan 4 09:50:40 2017 +0000
### Changed
- update of fh-mbaas-express dependency to include Insecure Entropy Source fix
```git
-    "fh-mbaas-express": "5.6.4",
+    "fh-mbaas-express": "5.6.6",
```  


## [6.1.1] - Fri Dec 9 16:15:37 2016 +0000
### Added
- Adds new auth endpoint


## [6.1.0] - Sun Nov 27 20:56:21 2016 +0000
### Changed
- updated dependency:
```git
-    "fh-db": "1.2.3",
+    "fh-db": "1.2.5",
```


## [6.0.1] - Tue Nov 15 16:05:20 2016 +0000
### Changed
- version number of fhm-mbaas-api from 6.0.0 to 6.0.1 to republish to NPM


## [6.0.0] - Mon Nov 14 14:53:36 2016 +0000

_**note:**_ v6.0 of the fh-mbaas-api saw the removal of the .feed API. This was the reason for the major version bump to 6.0.0

### Added
- Adds fail fast behaviour for custom sync handlers, and tests


### Changed
- updated dependency:
```git
-    "fh-mbaas-express": "5.6.2",
+    "fh-mbaas-express": "5.6.3",
```

### Removed
- Removed .feed API


## [5.14.2] - Thu Oct 20 09:48:01 2016 +0100 (365)
### Changed
- Update to fix npm-shrinkwrap.json


## [5.14.1] - Mon Oct 3 10:41:06 2016 +0300
### Changed
- fh-db bumped to use new version:
```git
-    "fh-db": "1.2.2",
+    "fh-db": "1.2.3",
```


## [5.14.0] - Tue Sep 27 09:19:07 2016 -0500
### Changed
- bump to version 5.14.0 to update shrinkwrap


## [5.13.12] - Thu Oct 20 09:48:01 2016 +0100
### Added
- Adds grunt-cli dependency: #ADD note about any other Grunt functionality added
```git
+    "grunt-cli": "^1.2.0",
```

### Changed
- Updated .push to support creation of custom instances
- Updated Windows script
- Update to make permission map accessible
- Bump fh-db
```git
-    "fh-mbaas-express": "5.6.1",
+    "fh-mbaas-express": "5.6.2",
```


## [5.13.11] - Fri Sep 2 11:12:07 2016
### Changed
- version number of fhm-mbaas-api from 5.13.10 to 5.13.11 to republish to NPM


## [5.13.10] - Tue Aug 30 13:58:27 2016
### Changed
- fh-db bumped to use new version as was no way to delete collections or bulk delete data in Data Browser:
```git
-    "fh-db": "1.1.2",
+    "fh-db": "1.2.0",
```


## [5.13.9] - Thu Aug 25 17:09:29 2016 +0100 (388)
### Changed
- Update to lazy load aerogear (`"unifiedpush-node-sender"`)


## [5.13.8] - Wed Aug 10 13:26:07 2016 -0300
### Changed
- Changed log levels so they are configurable


## [5.13.7] - Thu Aug 11 13:51:05 2016 +0300
note: includes & merges all changes from the unmerged v5.13.6 below
### Added
- Added community info links to README.md

### Changed
- updates fh-db version:
```git
-    "fh-db": "1.1.0",
+    "fh-db": "1.1.2",
```


## [5.13.6] - Tue Aug 9 16:19:49 2016 +0300
note: never merged to master 
### Added
- Added community info links to README.md

### Changed
- updates fh-db version:
```git
-    "fh-db": "1.1.0",
+    "fh-db": "1.1.2",
```


## [5.13.5] - Fri Jul 29 12:18:34 2016 +0200
### Removed
- Removes log statements that cannot be disabled


## [5.13.4] - Thu Jul 28 20:08:45 2016 +0200
### Changed
- updates fh-db version:
```git
-    "fh-db": "1.0.4",
+    "fh-db": "1.1.0",
```


## [5.13.3] - Thu Jul 28 13:02:57 2016 +0200
### Changed
- updates request and moment dependencies:
```git
-    "moment": "2.0.0",
+    "moment": "2.14.1",
-    "request": "2.12.0",
+    "request": "2.74.0",
```


## [5.13.2] - Wed Jul 27 20:42:10 2016 +0200
### Changed
- Updates to dependency version, travis, info icons and version bumps


## [5.13.1] - Wed Jul 19 16:13:37 2016 +0200

### Changed
- Moved fh-mbaas-api to open source feedhenry/fh-mbaas-api repo
- Bumped version from 5.5.4 to 5.13.1

---

# Previous Changelog (<= 5.13.1/ 5.5.4)

# Component: fh-mbaas-api
## 5.5.4 - 2015-11-27 
* RHMAP-2841 - Fix path.join on windows

## 5.5.3 - 2015-11-16 
* RHMAP-2264 - Increase maxSockets count by default for Cloud Apps

## 5.5.2 - 2015-11-12 
* RHMAP-2841 - Add windows test scripts

## 5.5.1 - 2015-11-02
* RHMAP-2693 - Update fh-mbaas-express to v5.2.1

## 5.5.0 - 2015-11-02
* RHMAP-2693 - Update fh-mbaas-express to v5.2.0
* Added check for list property of fhdb response in doList function

## 5.4.0 - 2015-10-07
* FH-1067 - Disconnect MBaaS and Core

## 5.3.5 - 2015-10-18 
* RHMAP-796 service url caching
* Force sync list when syncRecords is invoked

## 5.3.4 - 2015-09-29
* FH-2213 - Fixed Incorrect Params For Submission Complete Event

## 5.3.3 - 2015-09-24
* FH-2103 - Stop sync on error

## 5.3.2 - 2015-10-05
* Fix $fh.service URL formatting issue

## 5.3.1 - 2015-09-11
* Bump version of grunt-fh-build, so that archive with dependencies will get built

## 5.3.0 - 2015-08-19
* FH-1760 - Adding $fh.host API for Cloud Apps to fetch their own host

## 5.2.0 - 2015-07-28
* FH-1517 - Add support for Redis from within OpenShift 3 applications

## 5.1.0 - 2015-07-28
* FH-250 - Add support for MongoDB from within OpenShift 3 applications

## 5.0.3 - 2015-07-28 
* FH-748 - fix $fh.cache to work with non-default port

## 5.0.2 - 2015-07-22
* FH-1435 - Bump fh-mbaas-client version

## 5.0.1 - 2015-07-14
* FHCLOUDSDK-14 - Fixed File Parameters For MbaaS File Upload.

## 5.0.0 - 2015-04-30
* FH-42 - Appforms Lifecycle Management Changes. Replaced fh-forms with fh-mbaas-client. Apps no longer access the domain database directly.

## 4.12.0 - 2015-07-08
* FHMAP-605 - Call core periodically to validate App API Keys (bumps fh-mbaas-express)

## 4.11.2 - 2015-06-23
* FH-164 - Build using Grunt instead of Make

## 4.11.1 - 2015-06-20
* FHCLOUDSDK-13 - $fh.service params only being sent for GET and POST

## 4.11.0 - 2015-05-05
* FHCLOUDSDK-10 - Bump fh-mbaas-express version

## 4.10.1 - 2015-04-14
* Add a shrinkwrap file for npm

## 4.10.0 - 2015-04-03
* FHCLOUDSDK-7 - New API for auth token verification

## 4.9.4 - 2015-03-26
* FHMOBSDK-56 - Fix an issue with the sync framework

## 4.9.3 - 2015-03-20 IR249

* FHCLOUDSDK-6 - Updated to fh-security@0.1.3-10 for AES 256 keygen

## 4.9.2 - 2015-03-12 IR249 

* Fixed Incorrect Forms Get Submission Parameters

## 4.9.1 - 2015-02-26 IR248 
* FHCLOUDSDK-4 - add response object to $fh.service callback

## 4.9.0 - 2015-02-25 IR247 
* 8668 - Add OpenShift stats support
* 8612 - Add OpenShift DB & Cache support

## 4.8.1 - 2015-02-17 IR247 
* 8748 - Update fh-form dependency version

## 4.8.0 - 2015-02-04 IR246 
* 8742 - Added submission events to forms.

## 4.7.1 - 2014-12-09 IR242 
* 8467 - Update fh-db version

## 4.7.0 - 2014-11-28 IR241
* 8178 - Add support for local development against local services & lifecycle for services

## 4.6.0 - 2014-11-03 IR240 
* 7890 - Bumped forms version related to adding a barcode scanner field.

## 4.5.1 - 2014-10-30 IR239 
* 8212 - Update fh-forms and fh-mbaas-express version

## 4.5.0 - 2014-09-25 IR237
* 8018 - Added additional cloud functionality.

## 4.4.1 - 2014-09-25 IR237 
* Fix an issue with the sync framework

## 4.4.0 - 2014-09-24 IR237
* 7986 - Bump forms version for field codes.

## 4.3.1 - 2014-09-19 IR236
* 7992 - Fix error when handling sync collison

## 4.3.0 - 2014-08-28 IR235

* 7822 - Added admin fields to forms. Bumped forms version.

## 4.2.0 - 2014-08-20 IR234

* 7821 Bumped forms version to allow multiple rule targets.

## 4.1.0 - 2014-08-13 IR233

* 7414 Bumped forms version related to adding new bootstrap forms template app.

## 4.0.7 - 2014-08-06 IR233

 * 7744 - Expose a shutdown API to allow fh-mbaas-api to cleanly exit

## 4.0.6 - 2014-06-25 IR232

 * 7637 - Updated fh-forms version related to ticket 7637

## 4.0.5 - 2014-06-25 IR230

* Make sure the same data format will be used when sync records endpoint is called

## 4.0.4 - 2014-06-13 IR229

* Use cuid from updates instead of the request when listing acknowledgements

## 4.0.3 - 2014-06-20 IR230 
* 7470 - Small change around how to list the sync data

## 4.0.2 - 2014-06-19 IR230
* 7470 - Fix an bug in sync framework which could cause client data lost

## 4.0.1 - 2014-06-03 IR229 
* 7363 - Sync should do global Init automatically

## 4.0.0 - 2014-06-03 IR229 
* 7364 - Make fh-mbaas-express a dependency of this module.

## 3.0.1 & 3.0.0-beta15 - 2014-06-05 IR229
* Bump fh-db version

## 3.0.0-beta14 - 2014-06-05 IR229

* 7256 - Fix app API key getting sent on outbound requests to ditch

## 3.0.0-beta10->beta13 - 

* Various IR228 form version bumps

## 3.0.0-beta9 - IR226 

- bump forms 0.5.16

## 3.0.0-beta8 - 2014-05-09 IR227 

* 7122 - 'grunt accept' not exiting cleanly if fh.db() is used
* bump fh-db 0.4.12

## 3.0.0-beta7 - 01-05-2014 - IR226 - Cbrookes

- bump forms 0.5.16

## 3.0.0-beta6 - 29-04-2014 - IR226


- bump forms 0.5.9

## 3.0.0-beta4 - 17-04-2014 - IR225 


* 6706 - Add get submission to client api

## 3.0.0 - 7-04-2014 - IR225 


* 6679 - Renaming and versioning for fh-webapp & fh-api

  NOTES:

* 6679:

fh-webapp is now called fh-mbaas-express. fh-api is now called fh-mbaas-api. Both have been changed to v3.0.0

## 0.3.0

* 6263 - Complete refactor of $fh.sync

## 0.2.8 (IR224) 31-03-2014

* 6515 expose submissions api

## 0.2.7 (IR224) 31-03-2014

* 6516 expose getPopulatedFormList

## 0.2.6 (IR223)

* 6393 - Refactored forms to use FH_WIDGET as appId.


## 0.2.5, 0.2.4, 0.2.3 & 0.2.2 - 2014-02-26 IR222

* 6059 - Send Project ID with $fh.service() calls. Thanks NPM.

## 0.2.1 - 2014-02-12 IR221

* 6018 - Add $fh.service() call to fh-api

## 0.2.0 - 03-01-2014 IR218

* 5455 - Explicitly set character encoding to utf-8

## 0.1.5 (IR216)
CHANGES
 * 6393 - Refactored forms to use FH_WIDGET as appId.

## 0.1.5 (IR216)
CHANGES
* 5258 - Resolving an issue with defaulting to the wrong port if none specified

## 0.1.4 (IR212)
CHANGES
 * Initialise logger earlier in cache.js

## 0.1.2 (IR210)
CHANGES
 * pass db per app when app is using its own db

## 0.1.1 (IR210)
CHANGES
 * add fh-db as dependency bump vers

## 0.1.0 (IR209)
CHANGES
 * Ticket 4470 Split fh-nodeapp into fh-webapp and fh-apis

NOTES
 * <none>

---
