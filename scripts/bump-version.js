// 版本号自动递增脚本：每次 +0.0.1
// 用法：npm run version:bump
const fs = require('fs')
const path = require('path')

const pkgPath = path.resolve(__dirname, '..', 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

const parts = String(pkg.version || '1.0.0').split('.').map((n) => parseInt(n, 10) || 0)
parts[2] += 1 // 递增补丁号
pkg.version = parts.join('.')

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
console.log('✅ 版本号已更新为 v' + pkg.version)
