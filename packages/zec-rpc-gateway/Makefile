python.freeze:
	pipenv run pip freeze > requirements.txt

run:
	docker run -it --name zec-api-server-test -v /var/run/docker.sock:/var/run/docker.sock --env-file .env --network elemental_net --rm 1337bytes/zeclight-api-server
# docker run -it --name zec-api-server-test --network elemental_net -v /var/run/docker.sock:/var/run/docker.sock --env-file .env --rm 1337bytes/zeclight-api-server
build:
	docker build -t 1337bytes/zeclight-api-server .
