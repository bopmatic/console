OPENAPIGENJS=java -jar ./openapi-generator-cli.jar generate -g typescript-axios --git-host github.com --git-user-id bopmatic --git-repo-id sdk/golang --additional-properties=supportsES6=true,npmVersion=9.2.0,typescriptThreePlus=true

build: openapi-generator-cli.jar node_modules sdk src/client/api.ts src/client/signupapi.ts FORCE
	mkdir -p build
	npm run build

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

src/client/api.ts: openapi-generator-cli.jar sdk/golang/pb/sr.bopmatic.json
	$(OPENAPIGENJS) -o srapi -i sdk/golang/pb/sr.bopmatic.json
	cp ./srapi/api.ts ./src/client/
	cp ./srapi/base.ts ./src/client/
	cp ./srapi/common.ts ./src/client/
	cp ./srapi/configuration.ts ./src/client/
	cp ./srapi/index.ts ./src/client/
	rm -rf srapi

src/client/signupapi.ts: openapi-generator-cli.jar sdk/golang/pb/signup.bopmatic.json
	$(OPENAPIGENJS) -o signupapi -i sdk/golang/pb/signup.bopmatic.json
	cp ./signupapi/api.ts ./src/client/signupapi.ts
	cp ./signupapi/base.ts ./src/client/signupapibase.ts
	cp ./signupapi/common.ts ./src/client/signupcommon.ts
	cp ./signupapi/configuration.ts ./src/client/signupconfig.ts
	cp ./signupapi/index.ts ./src/client/signupindex.ts
	rm -rf signupapi

.PHONY: clean
clean:
	rm -rf build

FORCE:
