# backend_management

## 启动
```
  需要配合backend_management_api项目使用
  开发环境: npm run serve
  生存环境: npm run build
```

### 项目描述
```
基于Vue2.x开发的web后台管理项目，使用到的相关技术有Vue-cli4、Vue-router、Element-UI等，
后端接口采用node.js进行开发。
```

### 相关插件和库的使用
```
lodash，实现对对象的深拷贝以及合并对象的操作
echarts，实现了绘制的图表功能
nprogress，实现了浏览器窗口顶部的进度条功能
vue-quill-eidtor,实现文本编辑框功能
vue-table-with-tree-grid,实现了对树形数据进行处理输出的操作
```

### 项目总结
```
该项目使用了Vue + Element-UI的方式开发后台管理页面，相对于自己构建组件，Element-UI的效率可以说是非常高，
整个过程都是基于对数据库的curd操作，因此存在不少重复性业务代码。

同时vue构建的SPA项目存在SEO优化的问题，如果要兼并上线后的SEO优化，则需要采用预渲染或SSR渲染下的Nuxt去就开发应用，
这也是一个较为重要的问题。
```
