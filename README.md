fh-api is part two of a two-part replacement for fh-nodeapp. fh-api is the "fhserver" or $fh part of fh-nodeapp, which exposes the $fh cloud JavaScript API. The functions contained in fh-api are as before, with some deprecated functions listed below.

##Usage
Add the following to the 'dependencies' section of your **'cloud/package.json'** file:

    "fh-api" : "*"
    
##Documentation
Documentation for the $fh cloud API is maintained at the [FeedHenry API Docs.](http://docs.feedhenry.com/v2/api_cloud_apis.html)
    
##Deprecated
Our Rhino Backwards Compatability functions have been deprecated. These are listed below - with their replacements **in bold**. All replacements listed but '$fh.web' have drop-in replacements available.  

* $fh.web -> **[request](https://github.com/mikeal/request)**
* $fh.log -> **console.log**
* $fh.parse -> **JSON.parse**
* $fh.stringify  **JSON.stringify**