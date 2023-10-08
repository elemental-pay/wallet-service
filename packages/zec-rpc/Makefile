build:
	docker build -t 1337bytes/zeclight-rpc .

run:
	docker run -it --name zec-api-server-test -v /var/run/docker.sock:/var/run/docker.sock -v ./data:/usr/src/app/data --env-file .env --rm 1337bytes/zeclight-rpc
