# 微服务秒杀系统-后台管理前端 

<p align="center"> 
 <img src="https://img.shields.io/badge/Vue%20-2.6.10-green.svg" alt="vue"/>
 <img src="https://img.shields.io/badge/Element%20Ui%20-2.13.2-blue.svg" alt="elementui"/>
 <img src="https://img.shields.io/badge/Vue%20Router%20-3.0.6-blue.svg" alt="vue-router"/>
 <img src="https://img.shields.io/badge/Vuex-3.1.0-green.svg" alt="vuex">
 <img src="https://img.shields.io/badge/Axios-0.18.1-blue.svg" alt="axios">
</p>

## 简介

微服务秒杀系统采用了前后端分离的模式，前端采用了Vue全家桶 + Element-Ui组件，后端采用Spring Cloud全家桶开发而成。此项目是本秒杀系统的后台管理前端。

后台管理主要是使用了vue-admin-template进行二次开发。

## 项目链接

- [用户秒杀前端](https://github.com/ChoyRunYu/secondkill-vue)
- [微服务秒杀系统后端](https://github.com/ChoyRunYu/secondkill)

## 相关技术

| 技术       | 版本号 |
| ---------- | :----: |
| vue        | 2.6.10 |
| vuex       | 3.1.0  |
| vue-router | 3.0.6  |
| axios      | 0.18.1 |
| element-ui | 2.13.2 |

## 目录结构

```
├── build						构建目录
├── mock						mock目录
├── public						公共目录
│  ├── favicon.ico					favicon图标
│  └── index.html					首页入口文件
├── src							源代码目录
│  ├── api							api请求接口目录
│  ├── assets						静态文件目录
│  ├── components					组件目录
│  ├── layout						组件布局目录
│  ├── router						路由目录
│  ├── store						Vuex目录
│  ├── styles						样式目录
│  ├── utils						工具类目录
│  ├── views						主要页面目录
│  ├── App.vue						项目入口文件
│  ├── main.js						项目核心文件
│  ├── permission.js				项目权限文件
│  └── setting.js					项目配置文件
├── test						测试目录
├── .env.production				生产环境
├── .env.development			开发环境
├── .eslistignore
├── .eslistrc.js
├── .editorconfig
├── .travis.yml
├── jest.config.js
├── jsconfig.json
├── bable.config.js
├── postcss.config.js
├── package.json
├── README.md
└── vue.config.js
```

## 跑起来

```
# 克隆代码
git clont https://github.com/ChoyRunYu/secondkill-admin

# 进入目录
cd secondkill-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 运行
npm run dev
```

## Docker部署

```
# 克隆代码
git clont https://github.com/ChoyRunYu/secondkill-admin
 
# 进入目录
cd secondkill-admin

# 安装依赖、启动
npm install && cd docker && docker-compost up -d
```

## 发布

```
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其他

```
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## 系统截图

![image-20210725141507339](https://choyblog.oss-cn-shenzhen.aliyuncs.com/img/image-20210725141507339.png)

![image-20210725141527793](https://choyblog.oss-cn-shenzhen.aliyuncs.com/img/image-20210725141527793.png)

![image-20210725141558355](https://choyblog.oss-cn-shenzhen.aliyuncs.com/img/image-20210725141558355.png)
