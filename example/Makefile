# Utils

MUSTACHE := node_modules/.bin/mustache
ILLUMINATE := node_modules/.bin/illuminate

JS        := $(wildcard lib/*.js)
DIRS      := $(patsubst lib/%.js, doc/%, $(JS))
HTML      := $(patsubst lib/%.js, doc/%/index.html, $(JS))
READMES   := $(patsubst lib/%.js, doc/%/README.md, $(JS))
TEMPLATE  := templates/docs.mustache


###
### Targets
###

# Build all documentation
doc: $(HTML) $(READMES)

# Build README.md from .js
doc/%/README.md: lib/%.js
	mkdir -p $(DIRS)
	$(ILLUMINATE) < $< > $@

# Build index.html from .js
doc/%/index.html: lib/%.js
	mkdir -p $(DIRS)
	$(ILLUMINATE) --html --syntax --json < $< | $(MUSTACHE) - $(TEMPLATE) > $@

clean:
	rm -rf doc

.PHONY: clean