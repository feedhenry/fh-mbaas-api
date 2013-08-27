PACKAGE = fh-api

all : test

test:
	@echo TESTS
	@env npm test

.PHONY: test
