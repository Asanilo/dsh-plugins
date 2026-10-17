# dsh-plugins

DSH（DeepSeek Harness）插件工作区：存放为 Web 版 DSH 自己调试的界面/功能插件。

每个子目录是一个独立、可安装的 bundle 包（`package.json` 里声明 `dsh.bundle.patch` 与 `dsh.client`），可以单独安装、单独禁用，互不依赖。

仓库地址：<https://github.com/Asanilo/dsh-plugins>

## 目录约定

```
dsh-plugins/
└── <plugin-name>/          # 一个插件一个目录，目录名 = 包名（scope 除外）
    ├── package.json        # dsh.bundle.patch + dsh.client 声明
    ├── cordis.patch.yml    # 插入/覆盖 Loader 行
    ├── index.js            # Host 半边（可空）
    ├── client.js           # Web 客户端半边（__ModuleLoader__ 工厂）
    ├── locale/{zh,en}.json # 插件列表里的标题/描述
    └── icon.svg            # 插件列表图标
```

## 已收录插件

| 插件 | 作用 |
| --- | --- |
| [`dsh-settings-footer`](dsh-settings-footer/) | 把 dsh 0.2.1 侧边栏底部的账号「⋯ 更多」二级菜单还原成旧版的单行「⚙ 设置」按钮。 |

## 安装 / 更新

在 DSH 会话里让 agent 执行：

```
plugin_manager  action: install_bundle
                target: <本仓库的绝对路径>/<plugin-name>
```

或命令行等价方式（会写 web profile）：`dsh plugin --profile web add <本仓库的绝对路径>/<plugin-name>`。

安装后 Host 行写入 `~/.dsh/profiles/web/cordis.patch.yml` 的 bundle 层，浏览器侧通过 HMR 生效。

- **首次安装**：通常无需重启，当前页面会直接应用。
- **修改插件里的 JS 后**：需要重启 `dsh web`（置换已安装包会加载新的 JS 模块代际）；只改 CSS/文案一般也可重启验证。
- **卸载**：`plugin_manager action: remove_bundle target: <包名>`，或关闭对应 bundle。

## 注意

- 这些包是 **link 安装**：profile 里的 `node_modules` 直接指向本目录，所以**别删除/移动本仓库里的插件目录**，否则对应插件失效。
- 提交前确认没有把 `node_modules`、`.npm-cache`、临时产物带进 git。
