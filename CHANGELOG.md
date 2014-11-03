# Component: fh-mbaas-api

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
