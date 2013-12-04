PACKAGE = fh-api
#
# Note: Get the Major/Release/Hotfix numbers from package.json.
# TODO: should really try use a JSON command line tool to do this,
# this could easily be done in Node but would introduce an additional
# build dependency.. 
#
PKG_VER:=$(shell grep version package.json| sed s/\"//g| sed s/version://g| sed s/-BUILD-NUMBER//g| tr -d ' '| tr -d ',') 
MAJOR:=$(shell echo $(PKG_VER)| cut -d '.' -f1)
RELEASE:=$(shell echo $(PKG_VER)| cut -d '.' -f2)
HOTFIX:=$(shell echo $(PKG_VER)| cut -d '.' -f3)

BUILD_NUMBER ?= DEV-VERSION
VERSION = $(MAJOR).$(RELEASE).$(HOTFIX)
DIST_DIR  = ./dist
OUTPUT_DIR  = ./output
MODULES = ./node_modules
COV_DIR = ./lib-cov
RELEASE_FILE = $(PACKAGE)-$(VERSION)-$(BUILD_NUMBER).tar.gz
RELEASE_DIR = $(PACKAGE)-$(VERSION)-$(BUILD_NUMBER)

all: clean npm_deps test

test: npm_deps
	npm test

npm_deps:
	npm install .

# Note we create two distributions, one with Mongo, one without.
# This is due to Mongo driver being 1.5G in size
dist: npm_deps
	rm -rf $(DIST_DIR) $(OUTPUT_DIR)
	rm -rf $(MODULES)/whiskey
	mkdir -p $(DIST_DIR) $(OUTPUT_DIR)/$(RELEASE_DIR)
	cp -r ./lib $(OUTPUT_DIR)/$(RELEASE_DIR)
	cp ./package.json $(OUTPUT_DIR)/$(RELEASE_DIR)
	echo "$(MAJOR).$(RELEASE).$(HOTFIX)-$(BUILD_NUMBER)" > $(OUTPUT_DIR)/$(RELEASE_DIR)/VERSION.txt
	sed -i -e s/BUILD-NUMBER/$(BUILD_NUMBER)/ $(OUTPUT_DIR)/$(RELEASE_DIR)/package.json
	tar -czf $(DIST_DIR)/$(RELEASE_FILE) -C $(OUTPUT_DIR) $(RELEASE_DIR)
clean:
	rm -rf $(DIST_DIR) $(OUTPUT_DIR) $(MODULES) $(COV_DIR)

.PHONY: test dist clean npm_deps
