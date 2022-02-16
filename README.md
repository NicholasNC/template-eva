# template-eva

一款快速生成模板的工具，帮助开发者更愉快地使用 Ctrl C + Ctrl V 大法

ps：目前还处于预览版阶段，功能还没进行单元测试

## 功能介绍 && 使用方法
### 根据选定的变量，插入 console.log
![](https://tva1.sinaimg.cn/large/b3cc33a0gy1gzcsfkjiqog20bi0e0wne.gif)

用法：
1. 选用待插入 console.log 的变量（可以直接选中，也可以像上图一样，将光标位置放在变量内）
2. 使用快捷键插入：
  - mac：`shift+cmd+l`
  - win: `shift+ctrl+l`

### 一键注释当前文件的所有 console
![](https://tva1.sinaimg.cn/large/b3cc33a0gy1gzf33oxsrzg20d60e0tfb.gif)

用法：
1. 在待注释的文件内执行使用快捷键
  - mac：`shift+ctrl+/`
  - win: `shift+ctrl+/`

### 一键取消当前文件的所有 console 注释
![](https://tva1.sinaimg.cn/large/b3cc33a0gy1gzf36en6ugg20d60e0gqw.gif)

用法：
1. 在待取消注释的文件内执行使用快捷键
  - mac：`shift+ctrl+alt+/`
  - win: `shift+ctrl+alt+/`

PS: 只能取消由 “一键注释当前文件的所有 console” 生成的注释（本质上是只能取消 console 的块级注释，不能取消行注释）

### 插入占位内容、占位头像、占位图片
![](https://tva1.sinaimg.cn/large/b3cc33a0gy1gzf38secz1g20nc0k24qp.gif)

用法：
1. 在待插入的位置，右键，选择需要插入的内容
  - ![](https://tva1.sinaimg.cn/large/b3cc33a0gy1gzf3aembhuj208d0etta4.jpg)

### 插入模板文件
![](https://tva1.sinaimg.cn/large/b3cc33a0gy1gzf3b4v8sbg20x00awhas.gif)

用法：
1. 在文件夹右键，选择需要插入的模板文件
  - ![](https://tva1.sinaimg.cn/large/b3cc33a0gy1gzf3cknet9j20b70g377g.jpg)

PS: 默认有微信小程序的模板文件，其它模板文件，用户可以自行配置

## 插件自身定位

## 配置
```
{
  "template-eva.fileTemplates": [
    {
      "fileName": "ttTS222.ts",
      "description": "自定义TS模板"
    },
  ]
}
```

![](https://tva1.sinaimg.cn/large/b3cc33a0gy1gzf3evp6gzj207h0ae3zk.jpg)

如上图，在项目根目录的 `.vscode` 目录下，创建 `.template-eva` 文件夹，把模板文件放在该目录，再在 `setting.json` 中配置以上内容即可


## 待办
1. 自定义模板
