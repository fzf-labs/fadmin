SHELL := /bin/bash
BASEDIR = $(shell pwd)

gitBranch = $(shell git rev-parse --abbrev-ref HEAD)
gitCommit = $(shell git rev-parse HEAD)
buildTime = $(shell TZ=Asia/Shanghai date +%Y%m%d%H%M%S)
ldflags="-w -X ${versionDir}.buildTime=${buildTime} -X ${versionDir}.gitCommit=${gitCommit} -X ${versionDir}.gitBranch=${gitBranch}"


.PHONY: git-clean
# make git-clean  git clean
git-clean:
	#清除开始
	@git checkout --orphan latest_branch
	@git add -A
	@git commit -am "clean"
	@git branch -D ${gitBranch}
	@git branch -m ${gitBranch}
	@git push -f origin ${gitBranch}
	#清除结束


# show help
help:
	@echo ''
	@echo 'Usage:'
	@echo ' make [target]'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
	helpMessage = match(lastLine, /^# (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 2, RLENGTH); \
			printf "\033[36m%-22s\033[0m %s\n", helpCommand,helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

