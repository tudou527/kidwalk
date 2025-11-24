## Docker
```
// 本地构建镜像
docker build -t web .
// 运行镜像
docker run -it web sh

// 查看日志
docker service logs srv-captain--tts --since 60m --follow

// 登录服务器镜像
docker exec -it $(docker ps --filter name=srv-captain--tts -q) /bin/sh
```