.DEFAULT_GOAL :=

NODE_MODULES := ./node_modules/

BEM := $(NODE_MODULES).bin/bem
NPM := npm

ifneq (,$(findstring B,$(MAKEFLAGS)))
	BEM_FLAGS := --force
endif

all:: $(BEM) server

%:: $(BEM)
	$(if $(findstring GNUmakefile,$@),,$(BEM) make $@ $(BEM_FLAGS))

.PHONY: server
server:: $(BEM)
	@$(BEM) server

$(BEM):: $(NODE_MODULES)

$(NODE_MODULES)::
	$(debug ---> Updating npm dependencies)
	@$(NPM) install

.PHONY: python-server
python-server:: 
	python -m SimpleHTTPServer 8000

.PHONY: production
production:: clean
	env YENV=production bem make
	cp -r desktop.bundles production/desktop.bundles
	cp -r i production/i
	cp data.json production/

.PHONY: clean
clean::
	rm -rf production/*
	$(BEM) make -m clean
