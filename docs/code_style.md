# 代码风格和格式化配置

本项目已配置 ESLint 和 Prettier 来自动格式化代码并统一代码风格。

## 🔧 已安装的工具

### ESLint

- **版本**: 9.30.1
- **插件**: TypeScript、React Hooks、React Refresh、Prettier 集成
- **配置文件**: `eslint.config.js`

### Prettier

- **版本**: 3.6.2
- **插件**: TailwindCSS 类名排序
- **配置文件**: `.prettierrc`
- **忽略文件**: `.prettierignore`

## 📝 代码风格规则

### Prettier 规则

- 不使用分号 (`semi: false`)
- 使用单引号 (`singleQuote: true`)
- 2 空格缩进 (`tabWidth: 2`)
- 80 字符行宽 (`printWidth: 80`)
- ES5 尾随逗号 (`trailingComma: "es5"`)
- 箭头函数避免括号 (`arrowParens: "avoid"`)
- 自动排序 TailwindCSS 类名

### ESLint 规则

- TypeScript 严格检查
- React Hooks 规则
- React Refresh 规则
- 未使用变量检查（下划线前缀变量除外）
- 禁用 `var`，推荐 `const`
- Prettier 规则集成

## 🚀 可用命令

```bash
# 检查代码风格问题
bun run lint

# 自动修复 ESLint 问题
bun run lint:fix

# 格式化所有代码
bun run format

# 检查代码格式（不修改）
bun run format:check

# 运行所有检查
bun run check

# 自动修复所有问题
bun run fix
```

## ⚙️ VSCode 集成

项目已配置 VSCode 设置（`.vscode/settings.json`）：

### 自动功能

- 保存时自动格式化 (`formatOnSave: true`)
- 粘贴时自动格式化 (`formatOnPaste: true`)
- 保存时自动修复 ESLint 问题
- 自动整理 import 语句

### 推荐扩展

安装以下 VSCode 扩展以获得最佳体验：

- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## 🎯 最佳实践

1. **提交代码前**: 运行 `bun run check` 确保代码符合规范
2. **修复问题**: 使用 `bun run fix` 自动修复大部分问题
3. **保存即格式化**: 在 VSCode 中，代码会在保存时自动格式化
4. **团队协作**: 所有团队成员应使用相同的编辑器配置

## 📋 文件说明

```
项目根目录/
├── .prettierrc              # Prettier 配置
├── .prettierignore          # Prettier 忽略文件
├── eslint.config.js         # ESLint 配置
├── .vscode/
│   ├── settings.json        # VSCode 工作区设置
│   └── extensions.json      # 推荐扩展列表
└── CODE_STYLE.md           # 本说明文档
```

## 🔄 Git Hooks（可选）

如需在提交时自动检查代码风格，可以配置 Git hooks：

```bash
# 安装 husky 和 lint-staged
bun add -D husky lint-staged

# 配置 pre-commit hook
npx husky init
echo "bunx lint-staged" > .husky/pre-commit
```

然后在 `package.json` 中添加：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

这样每次提交代码时都会自动运行格式化和检查。
