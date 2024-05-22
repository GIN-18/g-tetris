# vue-tetris

## 部署到自己的服务器

### 依赖

服务器需要安装以下依赖。

* docker

* docker-compose

### 部署

1. 修改 `/frontend/src/assets/js/socket.js` 中的 `url`。

```javascript
// 修改 http://localhost:3000 为自己的服务器地址
export const socket = io("http://localhost:3000");
```

2. 下载代码到自己的服务器。

```bash
git clone https://github.com/gin-18/vue-tetris.git && cd vue-tetris
```

3. 启动容器。

```bash
docker-compose up -d
```
