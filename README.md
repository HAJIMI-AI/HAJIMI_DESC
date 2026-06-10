# 开发模版

补全 claude.env

执行 `npm run claude`

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```



## Preload / eventCenter API 使用说明（渲染进程可调用）

本项目通过 Electron preload 在所有窗口注入 `window.eventCenter`，用于从渲染进程安全地调用主进程能力（IPC）。本节是“使用说明”风格的文档：你可以直接照着示例写业务代码。

登录注册当前版本禁用。

### 1）在哪里能用？

- 主窗口（React/Vite 渲染页）可用
- 通过 `apps.open / openAppPopup / replaceWithAppPopup` 打开的应用窗口也可用（同样注入 preload）

### 2）错误与登录失效处理

- 所有方法失败都会 `throw Error`，建议统一 `try/catch` 处理
- 如果主进程返回 `authInvalid`，preload 会触发浏览器事件 `eventCenter:authInvalid`（用于自动退出到登录页）

```ts
window.addEventListener("eventCenter:authInvalid", async () => {
  // 这里按你的路由/状态管理做“强制退出到登录页”
})

async function safeCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (e) {
    console.error(e)
    return null
  }
}
```

### 3）两种调用方式：推荐直接方法 / 通用 invoke

#### 3.1 推荐：直接方法（更像 SDK）

直接调用 `window.eventCenter.xxx()`，不需要关心 service/method 的名字。

#### 3.2 通用：invoke(service, method, args?)

当你需要调用未封装的能力，使用：

```ts
await window.eventCenter.invoke("apps", "list", [])
await window.eventCenter.invoke("modules", "listModels", [])
```

### 4）API 速查（preload 直接暴露）

> 说明：入参写成 `{ ... }` 表示对象；`pathSuffix | path` 两者任选其一即可。

| 方法 | 用途 | 入参 | 返回 |
|---|---|---|---|
| `getClientConfig()` | 获取本机配置（登录态、环境模式、设备码等） | - | `{ mode, userKey, userNickname, deviceCode, mqtt, setupCompleted, mqttEnabled, mqttDisabledReason }` |
| `getDeviceCode()` | 获取/生成 deviceCode | - | `string` |
| `getUserKey()` | 获取当前 userKey | - | `string \| null` |
| `setUserKey(userKey)` | 设置当前 userKey（影响本地数据隔离：应用列表、模型列表、KV 等） | `string` | `{ userKey: string \| null }` |
| `getEventMode()` | 获取事件模式 | - | `ipc \| mqtt \| both` |
| `setEventMode({ mode, mqtt? })` | 设置事件模式（mqtt/both 时需要 mqtt 配置） | `{ mode: "ipc" \| "mqtt" \| "both", mqtt?: { url, username?, password? } }` | `{ eventMode: string }` |
| `getMqttConfig()` | 读取 MQTT 配置（当前 userKey 作用域） | - | `{ url, username?, password? } \| null` |
| `setMqttConfig(mqtt)` | 保存 MQTT 配置（当前 userKey 作用域） | `{ url, username?, password? }` | `{ url, username?, password?, ... }` |
| `pickDirectory()` | 打开目录选择器（用于应用管理/应用内选择路径等） | - | `{ directory: string \| null }` |
| `storageGet({ appId, key })` | 应用 KV：读取 | `{ appId, key }` | `{ exists: boolean, value: any }` |
| `storageSet({ appId, key, value })` | 应用 KV：写入 | `{ appId, key, value }` | `{ ok: true }` |
| `storageRemove({ appId, key })` | 应用 KV：删除 | `{ appId, key }` | `{ ok: true }` |
| `storageList({ appId, prefix? })` | 应用 KV：列出（可按前缀筛选） | `{ appId, prefix? }` | `{ items: Array<{ key, value }> }` |
| `getAppDetail({ appId })` | 根据 appId 获取应用详情（alias、目录、hsq.config.json 信息等） | `{ appId }` | `{ app }` |
| `openAppPopup({ appId, pathSuffix })` | 打开新的弹窗（注入 preload），URL=应用入口+pathSuffix | `{ appId, pathSuffix \| path }` | `{ ok: true, winId: string }` |
| `replaceWithAppPopup({ appId, pathSuffix })` | 关闭当前窗口并打开新的弹窗（同上逻辑） | `{ appId, pathSuffix \| path }` | `{ ok: true, winId: string }` |
| `closeCurrentWindow()` | 关闭当前窗口（调用方所在窗口） | - | `{ ok: true, closed: boolean }` |
| `writeTextFile({ appId, path, content })` | 保存/修改文本文件（相对应用目录） | `{ appId, path, content, encoding?, overwrite?, mkdirp? }` | `{ ok: true, path: string }` |
| `readTextFile({ appId, path })` | 读取文本文件（相对应用目录） | `{ appId, path, encoding? }` | `{ ok: true, path: string, content: string }` |
| `deletePath({ appId, path })` | 删除文件/目录（相对应用目录） | `{ appId, path, recursive? }` | `{ ok: true, deleted: boolean }` |
| `copyPath({ appId, from, to })` | 复制文件（相对应用目录） | `{ appId, from, to, overwrite?, mkdirp? }` | `{ ok: true, from: string, to: string }` |
| `movePath({ appId, from, to })` | 移动/重命名文件（相对应用目录） | `{ appId, from, to, overwrite?, mkdirp? }` | `{ ok: true, from: string, to: string }` |
| `createCaptcha({ scene })` | 获取图形验证码（base64） | `{ scene: string }` | `{ captchaBase64: string }` |
| `refreshCaptcha({ scene })` | 刷新图形验证码 | `{ scene: string }` | `{ captchaBase64: string }` |
| `login({ username, password })` | 登录 | `{ username, password }` | `{ userKey, token, tokenExpired }` |
| `register({ username, password, captcha, nickname? })` | 注册（含验证码） | `{ username, password, captcha, nickname? }` | `{ userKey, token \| null, tokenExpired }` |
| `getAccountInfo()` | 获取账户信息（昵称） | - | `{ nickname: string \| null }` |
| `updatePassword({ oldPassword, newPassword })` | 修改密码 | `{ oldPassword, newPassword }` | `{ ok: true }` |
| `logout()` | 退出登录（清理本地登录信息） | - | `{ ok: true }` |
| `getSelectedModel()` | 获取当前选中的默认模型 | - | `ManagedModelItem \| null` |
| `setSelectedModel(id)` | 设置默认模型 | `string \| null` | `{ selectedModelId: string \| null }` |
| `listModels()` | 列出所有模型配置 | - | `ManagedModelItem[]` |
| `pickFiles(input?)` | 打开文件选择器（支持多选） | `{ filters?: Array<{ name, extensions }>, multi?: boolean }` | `{ files: string[] }` |
| `pickWorkingDirectory()` | 打开目录选择器（用于绑定 agent 运行目录） | - | `{ directory: string \| null }` |
| `readAbsoluteText(input)` | 读取任意路径的文本文件（绝对路径） | `{ path: string, encoding?: string }` | `{ ok: true, path, content, size, name, ext }` |
| `readImageAsBase64(input)` | 读取本地图片并转为 base64 data URL（支持 PNG/JPG/WebP/GIF/SVG/BMP，最大 20MB，可选缩放） | `{ path, maxWidth?, maxHeight?, quality? }` | `{ ok, path, base64, mimeType, width, height, sizeBytes }` |
| `previewFile(input)` | 自动识别文件类型并返回预览内容（图片→base64，文本→content+language，二进制→type='binary'） | `{ path, maxTextBytes?, maxImageDim? }` | `FilePreviewResult` |
| `previewFileDialog(input)` | 打开独立窗口预览文件（自动识别类型渲染） | `{ filePath, title? }` | `{ ok: true }` |
| `focusOrOpenPopup(input)` | 打开应用弹窗（如已打开则聚焦切换） | `{ appId, pathSuffix? }` | `{ ok, winId, existing }` |
| `showItemInFolder(input)` | 在系统文件管理器（Finder/资源管理器）中定位并高亮文件 | `{ path }` | `{ ok: true }` |
| `openExternalApp(input)` | 用系统默认程序打开文件/目录 | `{ path }` | `{ ok: true }` |
| `openExternalAppByName(input)` | 按应用名称启动应用（macOS/Windows） | `{ name }` | `{ ok: true, path? }` |
| `openInBrowser(input)` | 在系统默认浏览器中打开 URL | `{ url }` | `{ ok: true }` |
| `writeImageBase64(input)` | 将 base64 图片写入应用目录 | `{ appId?, path, base64, overwrite?, mkdirp? }` | `{ ok, path, sizeBytes }` |
| `getAppId()` | 获取当前窗口的 appId（子应用窗口返回 appId，主窗口返回 null） | - | `string \| null` |
| `getAppWorkdir(appId?)` | 获取应用工作目录（子应用默认 `{userData}/appData/{appId}`） | `string?` | `{ workdir, isDefault }` |
| `setAppWorkdir({ appId?, directory })` | 设置应用工作目录（空字符串重置为默认） | `{ appId?, directory }` | `{ workdir }` |
| `runAgentWithModel(input)` | 调用 agent（自动注入模型信息 + 子应用自动注入 cwd） | `{ agentName, prompt, sessionId?, modelId?, cwd?, allowTools?, collectMessages?, permissionMode?, images?, plugins? }` | `AgentRunResult` |
| `listSkills(input?)` | 列出可用技能（子应用自动按 scope 过滤） | `{ }` | `SkillItem[]` |
| `uploadSkill(input)` | 上传技能（复制目录到 userData） | `{ name?, sourceDirectory }` | `{ skill: SkillItem }` |
| `updateSkill(input)` | 修改技能显示名称 | `{ id, name }` | `SkillItem` |
| `deleteSkill(input)` | 删除技能及其文件 | `{ id }` | `{ ok: true }` |
| `getSkillPluginPath(id)` | 获取技能的插件路径（可直传 `plugins`） | `string` | `{ path: string }` |
| `listPluginPacks(input?)` | 列出插件包（子应用自动按 scope 过滤） | `{ }` | `PluginPackItem[]` |
| `createPluginPack(input)` | 创建插件包（组装多技能 + MCP，自动设置 scope） | `{ name, description?, skillIds, mcpConfig? }` | `{ pack: PluginPackItem }` |
| `updatePluginPack(input)` | 更新插件包（重建目录） | `{ id, name?, description?, skillIds?, mcpConfig? }` | `{ pack: PluginPackItem }` |
| `deletePluginPack(input)` | 删除插件包及其文件 | `{ id }` | `{ ok: true }` |
| `getPackPluginPath(id)` | 获取插件包的插件路径（可直传 `plugins`） | `string` | `{ path: string }` |

### 5）常见使用场景（直接复制即可）

#### 5.1 登录 / 注册（含验证码）

```ts
// 1) 获取验证码
const { captchaBase64 } = await window.eventCenter.createCaptcha({ scene: "register" })

// 2) 注册（captcha 为用户输入的验证码文本）
await window.eventCenter.register({
  username: "test_user",
  password: "123456",
  captcha: "a1b2",
  nickname: "张三"
})

// 3) 登录
await window.eventCenter.login({ username: "test_user", password: "123456" })
```

#### 5.2 应用管理：启动、查详情

```ts
// 启动应用（同一个 appId 只会存在一个窗口；重复启动会切换到已打开窗口）
await window.eventCenter.invoke("apps", "open", [{ id: "<managedAppId>" }])

// 通过 appId 获取该应用的管理信息
const { app } = await window.eventCenter.getAppDetail({ appId: "demo_app" })
console.log(app.alias, app.hsq.appName, app.hsq.appVersion)
```

#### 5.3 打开弹窗（把后缀直接拼在应用入口后面）

```ts
// 推荐用 hash / query 作为后缀（对远端/本地都通用）
await window.eventCenter.openAppPopup({ appId: "demo_app", pathSuffix: "#/settings" })
await window.eventCenter.openAppPopup({ appId: "demo_app", pathSuffix: "?tab=logs" })

// pathSuffix 也支持传 path
await window.eventCenter.openAppPopup({ appId: "demo_app", path: "#/profile" })

// 关闭当前窗口并打开新弹窗（例如：强制跳登录页）
await window.eventCenter.replaceWithAppPopup({ appId: "demo_app", pathSuffix: "#/login" })

// 仅关闭当前窗口（例如：弹窗点“关闭”）
await window.eventCenter.closeCurrentWindow()
```

#### 5.4 文件操作（限定在应用目录内）

所有文件路径均为“相对应用目录”的相对路径，不允许传绝对路径，也不允许 `../` 越界到应用目录之外。

```ts
// 保存/覆盖（会自动创建父目录）
await window.eventCenter.writeTextFile({
  appId: "demo_app",
  path: "data/settings.json",
  content: JSON.stringify({ theme: "dark" }, null, 2),
  mkdirp: true
})

// 读取
const file = await window.eventCenter.readTextFile({ appId: "demo_app", path: "data/settings.json" })
console.log(file.content)

// 复制
await window.eventCenter.copyPath({ appId: "demo_app", from: "data/settings.json", to: "data/settings.bak.json" })

// 移动/重命名
await window.eventCenter.movePath({ appId: "demo_app", from: "data/settings.bak.json", to: "data/archive/settings.bak.json" })

// 删除文件
await window.eventCenter.deletePath({ appId: "demo_app", path: "data/settings.json" })

// 删除目录（需要 recursive=true）
await window.eventCenter.deletePath({ appId: "demo_app", path: "data/archive", recursive: true })
```

拼接规则：
- `pathSuffix` 以 `?` 或 `#` 开头：直接拼接
- 其它情况：自动补 `/` 再拼接（例如 `sub/page`）

#### 5.5 应用 KV 存储（按 userKey + appId 隔离）

```ts
await window.eventCenter.storageSet({ appId: "demo_app", key: "profile", value: { theme: "dark" } })
const res = await window.eventCenter.storageGet({ appId: "demo_app", key: "profile" })
if (res.exists) console.log(res.value)

await window.eventCenter.storageRemove({ appId: "demo_app", key: "profile" })
```

#### 5.6 模型管理

推荐使用 preload 直接暴露的便捷方法：

```ts
// 列出所有模型
const models = await window.eventCenter.listModels()

// 获取/设置默认模型
const selected = await window.eventCenter.getSelectedModel()
await window.eventCenter.setSelectedModel(models[0].id)

// 新增（仍通过 invoke）
await window.eventCenter.invoke("modules", "createModel", [
  { alias: "Claude", name: "claude-3-7-sonnet-latest", api_url: "https://api.anthropic.com", api_token: "..." }
])

// 编辑
await window.eventCenter.invoke("modules", "updateModel", [
  modelId,
  { alias: "Claude Pro", name: "claude-opus-4-8", api_url: "https://api.anthropic.com", api_token: "..." }
])

// 删除
await window.eventCenter.invoke("modules", "deleteModel", [modelId])

// 连接测试（只测试可达性/状态码）
const test = await window.eventCenter.invoke("modules", "testModelConnection", [
  { api_url: "https://api.anthropic.com", api_token: "...", timeoutMs: 6000 }
])
console.log(test.ok, test.latencyMs, test.statusCode, test.error)
```

#### 5.7 调用 Agent（带模型信息）

使用 `runAgentWithModel` 自动注入模型配置，无需手动传 `api_token`：

```ts
// 基础调用：自动使用默认模型的 api_url / api_token / model 名
const result = await window.eventCenter.runAgentWithModel({
  agentName: 'claude',
  prompt: '帮我分析这段代码的性能问题...'
})
console.log(result.sessionId, result.result, result.totalCostUsd)

// 指定模型 + 指定运行目录 + 会话续接 + 插件
const result2 = await window.eventCenter.runAgentWithModel({
  agentName: 'claude',
  prompt: '继续上一个问题...',
  modelId: 'some-model-id',       // 可选：指定模型，不传则用默认模型
  sessionId: result.sessionId,     // 可选：续接会话
  cwd: '/path/to/project',         // 可选：agent 运行目录（文件读写等操作的根目录）
  allowTools: true,                // 可选：是否允许 agent 使用工具（默认 false）
  collectMessages: true,           // 可选：是否收集中间消息流
  plugins: [                       // 可选：本地插件列表
    { type: 'local', path: '/path/to/my-plugin' }
  ]
})

// 返回类型 AgentRunResult：
// { sessionId, messageId, ok, result, stopReason, usage, totalCostUsd, messages }
```

**注意：** `runAgentWithModel` 会优先使用 `modelId` 指定的模型；若 `modelId` 为空则回退到默认模型（`getSelectedModel`）。模型信息（`model.name`、`api_token`、`api_url`）会自动合并到调用参数中，无需手动传入。

**插件（plugins）：** 支持传入本地插件列表，格式为 `{ type: 'local', path: string }[]`。目前仅支持 `type: 'local'`，`path` 为插件的绝对路径。插件会由 Claude Agent SDK 加载并在 Agent 运行时生效。

> 💡 **推荐：** 使用技能管理功能上传技能或创建插件包，然后通过 `getSkillPluginPath()` / `getPackPluginPath()` 获取路径并传入 `plugins`。详见 5.14 节。

#### 5.8 文件选择与绝对路径读取

新增的文件选择与绝对路径读取能力，不限定在应用目录内：

```ts
// 打开文件选择器（支持多选）
const { files } = await window.eventCenter.pickFiles({
  multi: true,                              // 是否多选，默认 true
  filters: [                                // 可选：文件类型过滤
    { name: 'Text Files', extensions: ['txt', 'md', 'json'] },
    { name: 'All Files', extensions: ['*'] }
  ]
})
console.log(files)  // string[] — 所选文件的绝对路径列表

// 读取任意绝对路径的文件内容
const file = await window.eventCenter.readAbsoluteText({
  path: files[0],
  encoding: 'utf8'  // 可选，默认 'utf8'
})
console.log(file.name, file.ext, file.size, file.content)
// file: { ok: true, path, content, size, name, ext }

// 打开目录选择器（用于绑定 agent 工作目录）
const { directory } = await window.eventCenter.pickWorkingDirectory()
console.log(directory)  // string | null
```

**提示：** 文件选择 + `readAbsoluteText` + `runAgentWithModel({ cwd })` 组合使用，可实现"选择文件发给 agent 分析，并指定工作目录"的完整工作流。详见 5.9 节完整示例。

#### 5.9 模型调试工作流完整示例

```ts
// 1. 选择工作目录
const { directory } = await window.eventCenter.pickWorkingDirectory()

// 2. 选择文件作为上下文
const { files } = await window.eventCenter.pickFiles({ multi: true })

// 3. 读取文件内容
const fileContents = await Promise.all(
  files.map(path => window.eventCenter.readAbsoluteText({ path }))
)

// 4. 构造 prompt（将文件内容注入上下文）
const fileContext = fileContents
  .map(f => `--- FILE: ${f.name} ---\n${f.content}\n--- END ---`)
  .join('\n')
const prompt = `[CONTEXT FILES]\n${fileContext}\n\n[USER MESSAGE]\n请分析这些文件的代码结构`

// 5. 调用 agent
const result = await window.eventCenter.runAgentWithModel({
  agentName: 'claude',
  prompt,
  cwd: directory,
  allowTools: true
})

console.log(result.result)
```

#### 5.10 图片读取 + Vision 工作流

```ts
// 1. 读取本地设计图（自动缩放至 2048px，0.85 质量）
const img = await window.eventCenter.readImageAsBase64({
  path: '/path/to/design.png',
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 0.85
})
console.log(img.mimeType, img.width, img.height, img.sizeBytes)
// img.base64 → "data:image/png;base64,iVBORw0KGgo..."

// 2. 将图片传给 Agent 做视觉分析 / 代码生成
const result = await window.eventCenter.runAgentWithModel({
  agentName: 'claude',
  prompt: '请根据这张设计图生成对应的 React 组件代码',
  images: [
    { base64: img.base64, detail: 'high' }   // detail: 'auto' | 'low' | 'high'
  ],
  allowTools: true,
  permissionMode: 'bypassPermissions'
})

// 3. Agent 生成代码后，将关联图片资源保存到应用目录
await window.eventCenter.writeImageBase64({
  path: 'assets/generated-icon.png',
  base64: generatedImageBase64,
  mkdirp: true
})
```

**Vision 要点：**
- `readImageAsBase64` 自动检测格式，支持 PNG/JPG/WebP/GIF/SVG/BMP
- 文件大小上限 20MB，超限会抛错
- `maxWidth/maxHeight` 等比缩放，避免大图导致 token 爆炸
- `quality` 仅对 JPG/WebP 生效（0-1）
- `images` 支持同时传入多张图片（多页设计稿）
- `detail: 'auto'` 让模型自动选择分辨率；`'low'` 低分辨率省钱；`'high'` 高清
- `writeImageBase64` 路径限定在应用目录内（安全约束，与 `writeTextFile` 一致）

#### 5.11 文件预览（自动识别类型）

`previewFile` 自动检测文件类型并返回适合前端渲染的预览数据：

```ts
// 任意文件路径，自动识别类型
const preview = await window.eventCenter.previewFile({
  path: '/path/to/any-file',
  maxTextBytes: 256 * 1024,   // 文本最大字节数（默认 512KB，上限 2MB）
  maxImageDim: 1400           // 图片最大尺寸（超限等比缩放）
})

switch (preview.type) {
  case 'image':
    // { type:'image', name, ext, sizeBytes, base64, mimeType, width, height }
    console.log(preview.base64)  // data:image/png;base64,...
    break
  case 'text':
    // { type:'text', name, ext, sizeBytes, content, language, truncated }
    console.log(preview.content)   // 文本内容
    console.log(preview.language)  // typescript | json | markdown | python | ...
    console.log(preview.truncated) // 内容是否被截断
    break
  case 'binary':
    // { type:'binary', name, ext, sizeBytes } — 无法预览的二进制文件
    break
}
```

**类型识别规则：**
| 类别 | 扩展名 | 返回 |
|------|--------|------|
| 图片 | .png .jpg .webp .gif .bmp .svg | `type:'image'` + base64 + 尺寸 |
| 文本/代码 | .js .ts .json .md .py .go .rs 等 40+ 种 | `type:'text'` + content + language |
| 二进制 | 含 null 字节的文件 | `type:'binary'` |

#### 5.12 弹窗预览 + 文件定位

`previewFileDialog` 打开独立 Electron 窗口预览文件，`showItemInFolder` 在系统文件管理器中定位：

```ts
// 打开独立窗口预览文件（自动识别图片/文本/代码，带完整 UI）
await window.eventCenter.previewFileDialog({
  filePath: '/path/to/report.pdf',
  title: '可选标题'           // 默认取文件名
})

// 在 Finder / 资源管理器中定位并高亮文件
await window.eventCenter.showItemInFolder({ path: '/path/to/report.pdf' })
```

**预览弹窗行为：**
| 文件类型 | 展示方式 |
|---------|---------|
| 图片 | 全窗口铺满，显示尺寸和 MIME 类型 |
| 文本/代码 | 等宽字体渲染，标注语言类型 |
| 二进制/不支持 | 显示文件名 + 完整路径 +「打开文件目录」按钮 |

**`previewFile` vs `previewFileDialog`：**

| | `previewFile` | `previewFileDialog` |
|------|------|------|
| 类型 | 纯数据 API，无 UI | 打开独立 Electron 窗口 |
| 适用场景 | 子应用拿数据自己渲染 | 快速预览，无需写 UI 代码 |
| 二进制处理 | 返回 `type:'binary'`，调用方自行处理 | 弹窗内显示路径 + 打开目录按钮 |

#### 5.13 打开外部应用与浏览器

`openExternalApp` 用系统默认程序打开文件或目录，`openExternalAppByName` 按应用名启动，`openInBrowser` 打开 URL：

```ts
// 用系统默认程序打开文件（PDF → 预览，图片 → 预览，目录 → Finder）
await window.eventCenter.openExternalApp({ path: '/path/to/report.pdf' })
await window.eventCenter.openExternalApp({ path: '/path/to/project-folder' })

// 按应用名称打开（跨平台：macOS/Windows）
await window.eventCenter.openExternalAppByName({ name: '微信' })
await window.eventCenter.openExternalAppByName({ name: 'WeChat' })
await window.eventCenter.openExternalAppByName({ name: 'Calculator' })

// 在默认浏览器中打开 URL
await window.eventCenter.openInBrowser({ url: 'https://github.com' })
```

**`openExternalAppByName` 平台行为：**

| 平台 | 查找策略 | 示例 |
|------|---------|------|
| macOS | 先搜 `/Applications/<name>.app`（精确+模糊匹配），失败则 `open -a "name"` | `'微信'` → `/Applications/WeChat.app` |
| Windows | 调用 `start "" "name"`（需在 PATH 或已注册） | `'微信'` → 启动微信 |
| Linux | 不保证可用 | — |

**安全约束：**
- `openInBrowser` 仅接受 `http://` 和 `https://` 协议
- `openExternalApp` 要求目标路径必须存在
- `openExternalAppByName` 仅允许指定应用名，不做命令注入（输入会自动转义双引号）

#### 5.14 技能管理（上传 + 调用）

技能是包含 `SKILL.md` 的目录，上传后自动变为 Claude 插件可直接传入 Agent：

```ts
// 1. 上传技能 —— 选择包含 SKILL.md 的目录
const { skill } = await window.eventCenter.uploadSkill({
  name: '我的前端规范',            // 可选，不填则使用目录名
  sourceDirectory: '/path/to/skill-dir'
})
console.log(skill.id, skill.name, skill.scope)  // scope: 'shared' 或 appId

// 2. 列出技能（子应用自动过滤：共享 + 自己的）
const skills = await window.eventCenter.listSkills({})

// 3. 将技能作为插件传给 Agent
const { path } = await window.eventCenter.getSkillPluginPath(skill.id)
const result = await window.eventCenter.runAgentWithModel({
  agentName: 'claude',
  prompt: '帮我写代码，遵循前端规范',
  plugins: [{ type: 'local', path }]   // 技能目录 = 插件路径
})

// 4. 删除技能
await window.eventCenter.deleteSkill({ id: skill.id })
```

**作用域规则：**
| 调用方 | 上传的 scope | 可见范围 |
|--------|-------------|---------|
| 主应用窗口 | `shared` | 全部技能 |
| 子应用窗口 | 自己的 appId | `shared` + 自己的 appId |

子应用窗口的 `appId` 自动注入，无需手动传。

#### 5.15 插件包管理（多技能组装 + MCP）

插件包可以选中多个技能组装成一个新的插件目录，支持配置 `mcp.json`，作用域规则与技能一致：

```ts
// 1. 创建插件包 —— 选择多个技能 + 可选 MCP 配置
const { pack } = await window.eventCenter.createPluginPack({
  name: '前端开发工具包',
  description: '含代码规范 + UI 组件库技能',
  skillIds: ['skill-id-1', 'skill-id-2'],
  mcpConfig: {
    mcpServers: {
      'figma': {
        command: 'npx',
        args: ['@anthropic/figma-mcp-server']
      }
    }
  }
})
console.log(pack.id, pack.skillIds.length, pack.scope, pack.hasMcp)
// scope: 'shared'（主应用创建）或 appId（子应用创建）

// 2. 列出插件包（子应用自动过滤：共享 + 自己的）
const packs = await window.eventCenter.listPluginPacks({})

// 3. 将插件包作为插件传给 Agent（加载包内所有技能 + MCP）
const { path } = await window.eventCenter.getPackPluginPath(pack.id)
const result = await window.eventCenter.runAgentWithModel({
  agentName: 'claude',
  prompt: '根据设计稿生成页面',
  plugins: [{ type: 'local', path }]
})

// 4. 更新插件包（重建目录，技能文件重新复制）
await window.eventCenter.updatePluginPack({
  id: pack.id,
  skillIds: ['skill-id-1', 'skill-id-2', 'skill-id-3'],  // 新增一个技能
  mcpConfig: { mcpServers: { /* 更新后的 MCP 配置 */ } }
})

// 5. 删除插件包
await window.eventCenter.deletePluginPack({ id: pack.id })
```

**作用域规则：** 与技能一致，主应用创建的为 `shared`，子应用创建的为 `appId`，子应用只能看到共享的 + 自己的。

**插件包目录结构**（自动生成在 `{userData}/plugin-packs/{id}/`）：
```
{packId}/
├── mcp.json              # 可选：MCP 服务配置
└── skills/
    ├── 前端规范/
    │   ├── SKILL.md
    │   └── ...
    └── UI组件库/
        ├── SKILL.md
        └── ...
```

### 6）可通过 invoke() 调用的服务（更完整的入口）

你可以用 `eventCenter.listServices` 查看当前注册的所有服务与方法：

```ts
const services = await window.eventCenter.invoke("eventCenter", "listServices", [])
console.log(services)
```

以下是常用服务：

#### eventCenter（配置/环境/连接测试）

- `invoke("eventCenter","getClientConfig",[])`
- `invoke("eventCenter","getUserKey",[])` / `invoke("eventCenter","setUserKey",[userKey])`
- `invoke("eventCenter","getEventMode",[])` / `invoke("eventCenter","setEventMode",[input])`
- `invoke("eventCenter","getMqttConfig",[])` / `invoke("eventCenter","setMqttConfig",[mqtt])`
- `invoke("eventCenter","testMqttConnection",[input])`

#### apps（应用 CRUD / 启动 / 弹窗）

- `invoke("apps","list",[])`
- `invoke("apps","create",[ { alias, directory } ])`
- `invoke("apps","update",[ { id, alias?, directory? } ])`
- `invoke("apps","remove",[ { id } ])`
- `invoke("apps","open",[ { id } ])`（同一个 appId 单实例窗口）
- `invoke("apps","getByAppId",[ { appId } ])`
- `invoke("apps","openPopup",[ { appId, pathSuffix } ])`
- `invoke("apps","replaceWithPopup",[ { appId, pathSuffix } ])`
- `invoke("apps","getAppWorkdir",[ appId ])` — 获取应用工作目录
- `invoke("apps","setAppWorkdir",[ { appId, directory } ])` — 设置应用工作目录
- `invoke("app","previewFileDialog",[ { filePath, title? } ])` — 打开独立预览窗口
- `invoke("app","openInBrowser",[ { url } ])` — 在默认浏览器打开 URL
- `invoke("app","openExternalApp",[ { path } ])` — 以默认程序打开文件/目录
- `invoke("app","openExternalAppByName",[ { name } ])` — 按应用名称启动应用

#### appStorage（应用 KV）

- `invoke("appStorage","get",[ { appId, key } ])`
- `invoke("appStorage","set",[ { appId, key, value } ])`
- `invoke("appStorage","remove",[ { appId, key } ])`
- `invoke("appStorage","list",[ { appId, prefix? } ])`

#### modules（模型管理）

- `invoke("modules","listModels",[])`
- `invoke("modules","getModel",[id])`
- `invoke("modules","createModel",[ { alias, name, api_url, api_token } ])`
- `invoke("modules","updateModel",[ id, { alias, name, api_url, api_token } ])`
- `invoke("modules","deleteModel",[ id ])`
- `invoke("modules","testModelConnection",[ { api_url, api_token, timeoutMs? } ])`
- `invoke("modules","setSelectedModel",[ id ])` — 设置默认模型
- `invoke("modules","getSelectedModelId",[])` — 获取默认模型 ID
- `invoke("modules","getSelectedModel",[])` — 获取默认模型完整信息

#### agent（调用 AI Agent）

- `invoke("agent","listAgents",[])` — 列出可用 agent（目前仅 claude）
- `invoke("agent","runAgent",[ { agentName, prompt, sessionId?, model?, api_token?, api_url?, cwd?, allowTools?, collectMessages?, permissionMode?, images?, plugins? } ])` — 直接调用 agent（支持 vision + 插件）
- **推荐使用 preload 便捷方法** `runAgentWithModel(input)` 自动注入模型信息

#### skills（技能管理）

- `invoke("skills","listSkills",[ { appId? } ])` — 列出技能（子应用自动过滤：shared + 自己的）
- `invoke("skills","uploadSkill",[ { appId?, name?, sourceDirectory } ])` — 上传技能（复制目录到 userData/skills/）
- `invoke("skills","updateSkill",[ { id, name } ])` — 修改技能显示名称
- `invoke("skills","deleteSkill",[ { id } ])` — 删除技能及文件
- `invoke("skills","getPluginPath",[ { id } ])` — 获取技能插件路径，返回 `{ path }`

#### pluginPacks（插件包管理）

- `invoke("pluginPacks","listPluginPacks",[ { appId? } ])` — 列出插件包（子应用自动过滤：shared + 自己的）
- `invoke("pluginPacks","createPluginPack",[ { name, description?, skillIds, mcpConfig?, appId? } ])` — 创建插件包（自动设置 scope 为 shared 或 appId，复制技能 + 写 mcp.json）
- `invoke("pluginPacks","updatePluginPack",[ { id, name?, description?, skillIds?, mcpConfig? } ])` — 更新插件包（重建目录）
- `invoke("pluginPacks","deletePluginPack",[ { id } ])` — 删除插件包及文件
- `invoke("pluginPacks","getPluginPath",[ { id } ])` — 获取插件包路径，返回 `{ path }`

#### files（文件操作：任意路径读取 + 选择器）

- `invoke("files","pickFiles",[ { filters?, multi? } ])` — 打开文件选择器
- `invoke("files","pickWorkingDirectory",[])` — 打开目录选择器
- `invoke("files","readAbsoluteText",[ { path, encoding? } ])` — 读取任意绝对路径文件
- `invoke("files","readImageAsBase64",[ { path, maxWidth?, maxHeight?, quality? } ])` — 读取图片转 base64
- `invoke("files","previewFile",[ { path, maxTextBytes?, maxImageDim? } ])` — 自动检测类型预览文件
- `invoke("files","showItemInFolder",[ { path } ])` — 系统文件管理器中定位文件
- `invoke("files","writeImageBase64",[ { appId, path, base64, overwrite?, mkdirp? } ])` — 写入 base64 图片
- `invoke("files","writeText",[ { appId, path, content, encoding?, overwrite?, mkdirp? } ])` — 写入文件（限定应用目录）
- `invoke("files","readText",[ { appId, path, encoding? } ])` — 读取文件（限定应用目录）
- `invoke("files","delete",[ { appId, path, recursive? } ])` — 删除文件/目录（限定应用目录）
- `invoke("files","copy",[ { appId, from, to, overwrite?, mkdirp? } ])` — 复制文件（限定应用目录）
- `invoke("files","move",[ { appId, from, to, overwrite?, mkdirp? } ])` — 移动/重命名（限定应用目录）

### 7）appId 自动注入（子应用窗口）

通过 `apps.open / openAppPopup / replaceWithAppPopup` 打开的子应用窗口，会携带 `--hsqAppId=<appId>`。

**所有 preload 暴露的方法**（除 `auth` 和 `eventCenter` 服务外），在子应用窗口调用时都会自动注入 `appId`。你无需在子应用代码中显式传递 `appId`：

```ts
// 子应用窗口中，以下调用无需手动传 appId（自动注入）

// KV 存储
await window.eventCenter.storageSet({ key: 'theme', value: 'dark' })
// 等价于: invoke('appStorage', 'set', [{ appId: 'auto', key: 'theme', value: 'dark' }])

// 文件操作
await window.eventCenter.writeTextFile({ path: 'data.json', content: '...' })
await window.eventCenter.readTextFile({ path: 'data.json' })

// Agent 调用
await window.eventCenter.runAgentWithModel({ agentName: 'claude', prompt: '...' })
```

如果显式传入 `appId`，则以传入的为准。

### 7.1）子应用工作目录

每个子应用有独立的工作目录，默认为 `{userData}/appData/{appId}`（自动创建）：

```ts
// 获取当前工作目录
const { workdir, isDefault } = await window.eventCenter.getAppWorkdir()
console.log(workdir)   // e.g. /Users/xxx/Library/.../appData/demo_app
console.log(isDefault) // true = 使用默认目录

// 修改工作目录（持久化）
await window.eventCenter.setAppWorkdir({ directory: '/path/to/custom/dir' })

// 重置为默认目录
await window.eventCenter.setAppWorkdir({ directory: '' })
```

**Agent 自动使用工作目录：** 在子应用窗口中调用 `runAgentWithModel` 时，若未显式传 `cwd`，会自动使用该应用的工作目录作为 Agent 运行根目录。主应用窗口无效（需手动传 `cwd`）。

### 8）窗口行为说明（避免踩坑）

- `apps.open`：同一个 `appId` 只允许一个主窗口；重复调用会切换到已存在窗口（不会新开）
- `openAppPopup`：每次都会新开一个弹窗（允许同一 appId 多个弹窗）
- `openAppPopup` 默认会把“当前窗口”作为 parent（弹窗跟随当前窗口层级显示）；如果你希望弹窗独立存在，可改用 `invoke("apps","openPopup",[ { appId, pathSuffix, attachParent: false } ])`
- `replaceWithAppPopup`：会关闭调用方所在窗口，再打开新弹窗（常用于“当前页面需要被替换”这类场景）

### 9）安全注意事项

- 不要在渲染进程把 `api_token`、密码、验证码文本打印到控制台或上报日志
- `storageSet` 允许写入任意 JSON 值；建议对 key 做命名空间（例如 `settings.*`、`cache.*`），避免冲突
