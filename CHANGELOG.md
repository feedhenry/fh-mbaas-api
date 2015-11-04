# Component: fh-mbaas-api

## 5.6.0 - 2015-11-04 - David Martin
* RHMAP-2774 - Add backwards compatible support for JDG to fh.cache API

## 5.5.0 - 2015-11-02 - Wei Li
* RHMAP-2693 - Update fh-mbaas-express to v5.2.0
* Added check for list property of fhdb response in doList function

## 5.4.0 - 2015-10-07 - Graham Hillis
* FH-1067 - Disconnect MBaaS and Core

## 5.3.5 - 2015-10-18 - Craig Brookes, Wei Li
* RHMAP-796 service url caching
* Force sync list when syncRecords is invoked

## 5.3.4 - 2015-09-29 - Niall Donnelly
* FH-2213 - Fixed Incorrect Params For Submission Complete Event

## 5.3.3 - 2015-09-24 - Shannon Poole
* FH-2103 - Stop sync on error

## 5.3.2 - 2015-10-05 - Evan Shortiss
* Fix $fh.service URL formatting issue

## 5.3.1 - 2015-09-11 - Gerard Ryan
* Bump version of grunt-fh-build, so that archive with dependencies will get built

## 5.3.0 - 2015-08-19 - Jason Madigan
* FH-1760 - Adding $fh.host API for Cloud Apps to fetch their own host

## 5.2.0 - 2015-07-28 - Cian Clarke
* FH-1517 - Add support for Redis from within OpenShift 3 applications

## 5.1.0 - 2015-07-28 - Cian Clarke
* FH-250 - Add support for MongoDB from within OpenShift 3 applications

## 5.0.3 - 2015-07-28 - Martin Murphy
* FH-748 - fix $fh.cache to work with non-default port

## 5.0.2 - 2015-07-22 - Niall Donnelly
* FH-1435 - Bump fh-mbaas-client version

## 5.0.1 - 2015-07-14 - Niall Donnelly
* FHCLOUDSDK-14 - Fixed File Parameters For MbaaS File Upload.

## 5.0.0 - 2015-04-30 - Niall Donnelly
* FH-42 - Appforms Lifecycle Management Changes. Replaced fh-forms with fh-mbaas-client. Apps no longer access the domain database directly.

## 4.12.0 - 2015-07-08 - Jason Madigan
* FHMAP-605 - Call core periodically to validate App API Keys (bumps fh-mbaas-express)

## 4.11.2 - 2015-06-23 - Gerard Ryan
* FH-164 - Build using Grunt instead of Make

## 4.11.1 - 2015-06-20 - John Frizelle
* FHCLOUDSDK-13 - $fh.service params only being sent for GET and POST

## 4.11.0 - 2015-05-05 - Wei Li
* FHCLOUDSDK-10 - Bump fh-mbaas-express version

## 4.10.1 - 2015-04-14 - Gerard Ryan
* Add a shrinkwrap file for npm

## 4.10.0 - 2015-04-03 - Wei Li
* FHCLOUDSDK-7 - New API for auth token verification

## 4.9.4 - 2015-03-26 - Wei Li
* FHMOBSDK-56 - Fix an issue with the sync framework

## 4.9.3 - 2015-03-20 IR249 - Martin Murphy

* FHCLOUDSDK-6 - Updated to fh-security@0.1.3-10 for AES 256 keygen

## 4.9.2 - 2015-03-12 IR249 - Niall Donnelly

* Fixed Incorrect Forms Get Submission Parameters

## 4.9.1 - 2015-02-26 IR248 - Martin Murphy
* FHCLOUDSDK-4 - add response object to $fh.service callback

## 4.9.0 - 2015-02-25 IR247 - Cian Clarke
* 8668 - Add OpenShift stats support
* 8612 - Add OpenShift DB & Cache support

## 4.8.1 - 2015-02-17 IR247 - Wei Li
* 8748 - Update fh-form dependency version

## 4.8.0 - 2015-02-04 IR246 - Niall Donnelly
* 8742 - Added submission events to forms.

## 4.7.1 - 2014-12-09 IR242 - Wei Li
* 8467 - Update fh-db version

## 4.7.0 - 2014-11-28 IR241 - John Frizelle
* 8178 - Add support for local development against local services & lifecycle for services

## 4.6.0 - 2014-11-03 IR240 - Niall Donnelly
* 7890 - Bumped forms version related to adding a barcode scanner field.

## 4.5.1 - 2014-10-30 IR239 - Wei Li
* 8212 - Update fh-forms and fh-mbaas-express version

## 4.5.0 - 2014-09-25 IR237 - Niall Donnelly
* 8018 - Added additional cloud functionality.

## 4.4.1 - 2014-09-25 IR237 - Eoin Crosbie, Wei Li
* Fix an issue with the sync framework

## 4.4.0 - 2014-09-24 IR237 - Niall Donnelly
* 7986 - Bump forms version for field codes.

## 4.3.1 - 2014-09-19 IR236 - Wei Li
* 7992 - Fix error when handling sync collison

## 4.3.0 - 2014-08-28 IR235 - Niall Donnelly

* 7822 - Added admin fields to forms. Bumped forms version.

## 4.2.0 - 2014-08-20 IR234 - Niall Donnelly

* 7821 Bumped forms version to allow multiple rule targets.

## 4.1.0 - 2014-08-13 IR233 - Niall Donnelly

* 7414 Bumped forms version related to adding new bootstrap forms template app.

## 4.0.7 - 2014-08-06 IR233 - John Frizelle

 * 7744 - Expose a shutdown API to allow fh-mbaas-api to cleanly exit

## 4.0.6 - 2014-06-25 IR232 - Niall Donnelly

 * 7637 - Updated fh-forms version related to ticket 7637

## 4.0.5 - 2014-06-25 IR230 - Wei Li

* Make sure the same data format will be used when sync records endpoint is called

## 4.0.4 - 2014-06-13 IR229 - Niall Donnelly

* Use cuid from updates instead of the request when listing acknowledgements

## 4.0.3 - 2014-06-20 IR230 - Wei Li
* 7470 - Small change around how to list the sync data

## 4.0.2 - 2014-06-19 IR230 - Wei Li
* 7470 - Fix an bug in sync framework which could cause client data lost

## 4.0.1 - 2014-06-03 IR229 - John Frizelle
* 7363 - Sync should do global Init automatically

## 4.0.0 - 2014-06-03 IR229 - John Frizelle
* 7364 - Make fh-mbaas-express a dependency of this module.

## 3.0.1 & 3.0.0-beta15 - 2014-06-05 IR229 - Cian Clarke
* Bump fh-db version

## 3.0.0-beta14 - 2014-06-05 IR229 - Cian Clarke

* 7256 - Fix app API key getting sent on outbound requests to ditch

## 3.0.0-beta10->beta13 - various

* Various IR228 form version bumps

## 3.0.0-beta9 - IR226 - niall donnelly

- bump forms 0.5.16

## 3.0.0-beta8 - 2014-05-09 IR227 - Damian Beresford

* 7122 - 'grunt accept' not exiting cleanly if fh.db() is used
* bump fh-db 0.4.12

## 3.0.0-beta7 - 01-05-2014 - IR226 - Cbrookes

- bump forms 0.5.16

## 3.0.0-beta6 - 29-04-2014 - IR226 - Cbrookes


- bump forms 0.5.9

## 3.0.0-beta4 - 17-04-2014 - IR225 - Niall Donnelly


* 6706 - Add get submission to client api

## 3.0.0 - 7-04-2014 - IR225 - Damian Beresford


* 6679 - Renaming and versioning for fh-webapp & fh-api

  NOTES:

* 6679:

fh-webapp is now called fh-mbaas-express. fh-api is now called fh-mbaas-api. Both have been changed to v3.0.0

## 0.3.0

* 6263 - Complete refactor of $fh.sync

## 0.2.8 (IR224) cbrookes 31-03-2014

* 6515 expose submissions api

## 0.2.7 (IR224) cbrookes 31-03-2014

* 6516 expose getPopulatedFormList

## 0.2.6 (IR223) Niall Donnelly

* 6393 - Refactored forms to use FH_WIDGET as appId.


## 0.2.5, 0.2.4, 0.2.3 & 0.2.2 - 2014-02-26 IR222 - Jason Madigan

* 6059 - Send Project ID with $fh.service() calls. Thanks NPM.

## 0.2.1 - 2014-02-12 IR221 - Damian Beresford

* 6018 - Add $fh.service() call to fh-api

## 0.2.0 - 03-01-2014 IR218 - John Frizelle

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
