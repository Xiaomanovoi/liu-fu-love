# 心动存档

一个为刘向强和付嘉颖设计的双人私密生活记录 PWA。它以移动端网页运行，也可以安装到安卓或苹果手机桌面，在普通浏览器与已安装应用之间共享同一份 Supabase 数据。

[打开心动存档](https://xiaomanovoi.github.io/liu-fu-love/)

> 这是私人生活项目。仓库中的前端代码可以公开托管，但实际记录通过登录、双人空间成员关系、行级安全策略和私有存储进行保护。

## 主要功能

### 双人共享

- 双方状态、想你信号和下次见面约定
- 共同留言、每日随机问题与情侣小纸条
- 双人任务、共同计划、学习打卡和游戏记录
- 心声语音、公共相册、照片回忆与见面记录
- 情侣成就、随机转盘和每日心动内容
- 星语瓶：双方拥有独立玻璃瓶，每天最多开启一颗对方写下的星星

### 秘密花园

- 双人照顾、成长阶段和心意值进度
- 心意种子、花期信箱、愿望花苞与双色花
- 装饰解锁、区域地图、四季年鉴和每周花园明信片
- 心意值账本、成长记录和记忆花朵

### 个人记录

- 私人日记和个人目标
- 记录对方的优点、习惯与小档案
- 体重、减脂和日常健康记录
- 付嘉颖专属的月经周期记录

个人区域按照当前登录账号隔离，不会显示在另一方的私人页面中。

## 技术结构

项目采用无框架的静态前端，尽量降低移动端加载和长期维护成本。

- HTML、CSS、原生 JavaScript：界面与交互
- Supabase Auth：邮箱链接和密码登录
- Supabase Postgres：共享数据、私人数据和数据库 RPC
- Supabase Realtime：两台设备之间的变更通知
- Supabase Storage：私有语音和媒体文件
- GitHub Pages：静态网页托管
- Web App Manifest + Service Worker：PWA 安装能力

### 核心文件

| 文件 | 用途 |
| --- | --- |
| `index.html` | 页面结构、对话框和资源版本号 |
| `styles.css` | 主界面和移动端响应式样式 |
| `app.js` | 主要功能、渲染与本地交互 |
| `sync.js` | 登录、Supabase 同步、缓存与实时更新 |
| `star-bottle.js` | 星语瓶的数据流、离线队列和绘制逻辑 |
| `star-bottle.css` | 星语瓶界面样式 |
| `questions-extra.js` | 每日随机问题题库 |
| `manifest.webmanifest` | PWA 名称、入口与图标配置 |
| `pwa.js` / `sw.js` | PWA 注册、升级与网络优先策略 |
| `recovery.html` | 数据恢复辅助页面 |
| `tests/` | 静态安全检查和双端浏览器测试 |
| `AGENTS.md` | 后续编码代理必须遵守的维护规则 |

## 本地运行

网页需要通过 HTTP 服务打开。不要直接双击 `index.html`，否则登录回调、麦克风和 Service Worker 可能无法正常工作。

在项目根目录运行任意静态服务器，例如：

```powershell
python -m http.server 4173
```

然后访问：

```text
http://localhost:4173/
```

项目本身没有运行时 npm 依赖。Node.js 主要用于构建和测试。

## Supabase 配置

完整操作说明见 [SUPABASE_SETUP.md](SUPABASE_SETUP.md)。

### 新建项目

1. 在 Supabase 创建项目。
2. 在 SQL Editor 中执行 `supabase-schema.sql`。
3. 根据说明设置 Authentication 的 Site URL 和 Redirect URL。
4. 将 Project URL 与 Publishable/anon public key 写入 `supabase-config.js`。

### 已有项目升级

- 通用历史升级使用 `supabase-upgrade-2026-08.sql`。
- 星语瓶安装及兼容升级使用 `supabase-star-bottle.sql`。
- 升级脚本应保持可重复执行，并且不得清空现有记录。
- 不要因为前端更新而重新初始化数据库。

`supabase-config.js` 只能保存浏览器可公开使用的 Project URL 和 Publishable/anon key。禁止提交以下内容：

- `service_role` 或 Secret Key
- 邮箱和账户密码
- SMTP 密码
- 数据库密码
- 私有访问令牌

## 数据与同步原则

- 共享记录只允许同一双人空间的两位成员访问。
- 私人记录只允许记录所有者访问。
- 网络慢或短暂断开时，界面优先保护正在输入的内容。
- 可重试的写入使用唯一标识，避免超时后产生重复记录。
- 删除操作需要保留跨设备同步所需的信息，避免旧设备恢复已删除内容。
- 空响应、登录过期或读取超时不能被当作“数据库里没有记录”。
- 实时通道只发送变更通知，不广播私人记录正文。

修改任何数据结构或同步逻辑前，请先阅读 [AGENTS.md](AGENTS.md)。

## PWA 安装

### 安卓

使用 Chrome 或支持 PWA 的浏览器打开在线地址，选择“安装应用”或“添加到主屏幕”。

### 苹果

使用 Safari 打开在线地址，点击分享按钮，选择“添加到主屏幕”。

安装后仍可继续使用原网页地址。两种入口使用同一账号和数据库，更新不会迁移或复制数据。

## 测试

基础检查：

```powershell
node --check app.js
node --check sync.js
node --check star-bottle.js
npm run test:pwa
npm run test:star-bottle
npm run build
git diff --check
```

具备 Playwright 环境时，还应检查苹果和安卓尺寸：

```powershell
$env:PWA_DEVICE = "iphone"
node tests/pwa-browser.mjs
node tests/star-bottle-browser.mjs

$env:PWA_DEVICE = "android"
node tests/pwa-browser.mjs
node tests/star-bottle-browser.mjs
```

浏览器测试会生成截图。完成检查后，不要提交 `dist/`、`*-test.png`、临时恢复文件或用户导出的私人数据。

## 构建

```powershell
npm run build
```

构建结果位于 `dist/`，用于备用静态或服务器打包。GitHub Pages 当前直接发布仓库中的静态文件，因此不要手工修改 `dist/`。

## 发布到 GitHub Pages

Pages 工作流采用手动触发，推送代码本身不会自动发布网页。

1. 完成本地测试并确认工作区只有本次修改。
2. 提交并推送到 `main`。
3. 在 GitHub Actions 中运行 `Deploy GitHub Pages`。
4. 等待部署完成。
5. 使用带随机查询参数的网址验证新资源已经上线。
6. 如果更新包含 SQL，前端部署完成后仍需单独在 Supabase SQL Editor 执行对应脚本。

前端发布不会自动执行数据库迁移，也不应该要求两位用户重新创建双人空间。

## 维护提醒

- 正式本地项目目录：`E:\Project\CodexProjects\liu-fu-love`
- 正式线上地址：<https://xiaomanovoi.github.io/liu-fu-love/>
- 修改 JS 或 CSS 后同步更新 `index.html` 中的资源版本号。
- 重点验证微信内置浏览器、iOS Safari、安卓浏览器和已安装 PWA。
- 长列表默认显示最新五条并允许折叠，避免记录增长后界面过长。
- 不要加入持续轮询、无限动画或高成本模糊效果。
- 数据库操作、恢复操作和线上发布都应先获得明确确认。

## 许可与隐私

本仓库目前未声明开源许可证，默认不授予复制、修改或再发布许可。项目中的私人导出数据、照片、语音和登录信息不应提交到 GitHub。

