OPENAPIGENJS=java -jar ./openapi-generator-cli.jar generate -g typescript-axios --git-host github.com --git-user-id bopmatic --git-repo-id sdk/golang --additional-properties=supportsES6=true,npmVersion=9.2.0,typescriptThreePlus=true

build: openapi-generator-cli.jar node_modules sdk bopapi FORCE
	mkdir -p build

.PHONY: deps
deps: FORCE
	rm -rf openapi-generator-cli.jar
	rm -rf node_modules
	rm -rf sdk

openapi-generator-cli.jar:
	curl -L https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/7.8.0/openapi-generator-cli-7.8.0.jar --output openapi-generator-cli.jar

node_modules: package.json
	npm install

sdk:
	git clone https://github.com/bopmatic/sdk.git
	rm -rf ./sdk/.git

bopapi: openapi-generator-cli.jar sdk/golang/pb/sr.bopmatic.json
	$(OPENAPIGENJS) -o bopapi -i sdk/golang/pb/sr.bopmatic.json
	cp ./bopapi/api.ts ./src/client/
	cp ./bopapi/base.ts ./src/client/
	cp ./bopapi/common.ts ./src/client/
	cp ./bopapi/configuration.ts ./src/client/
	cp ./bopapi/index.ts ./src/client/

.PHONY: clean
clean:
	rm -rf build

FORCE:
