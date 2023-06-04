all: build push

build:
	docker build -t 42screensaver:latest .

run:
	docker run -it --rm 42screensaver:latest

push:
	docker tag 42screensaver:latest localhost:32000/42screensaver:latest
	docker push localhost:32000/42screensaver:latest