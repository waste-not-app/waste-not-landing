SHELL := /bin/sh
.DEFAULT_GOAL := help

IMAGE ?= wastenot-landing
TAG   ?= local

.PHONY: help
help: ## Show available targets
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z0-9_-]+:.*## / {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

node_modules: package-lock.json
	npm ci
	@touch node_modules

.PHONY: install
install: node_modules ## Install locked dependencies

.PHONY: dev
dev: node_modules ## Start the Vite dev server
	npm run dev

.PHONY: build
build: node_modules ## Type-check and build into dist/
	npm run build

.PHONY: preview
preview: build ## Serve the production build locally
	npm run preview

.PHONY: fmt
fmt: node_modules ## Format with Prettier
	npm run format

.PHONY: fmt-check
fmt-check: node_modules ## Fail when files are not formatted
	npm run format:check

.PHONY: lint
lint: node_modules ## Lint with ESLint
	npm run lint

.PHONY: audit
audit: node_modules ## Fail on high or critical npm advisories
	npm audit --audit-level=high

.PHONY: check
check: node_modules audit ## Run the full quality gate (format, lint, audit, build)
	npm run check

.PHONY: docker-build
docker-build: ## Build the nginx image
	docker build -t $(IMAGE):$(TAG) .

.PHONY: up
up: ## Serve the production image at 127.0.0.1:8081
	docker compose up -d --build

.PHONY: down
down: ## Stop the preview container
	docker compose down
