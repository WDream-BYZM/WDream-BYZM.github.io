# ============================================================
# BYZM 联机后端一键部署脚本（API Token 方式）
# 用法（在你的 PowerShell 里运行，Token 只在本机，不会外传）：
#   powershell -ExecutionPolicy Bypass -File .\deploy-multi.ps1 -Token "你的API_TOKEN"
# ============================================================
param(
  [Parameter(Mandatory = $true)][string]$Token
)

$env:CLOUDFLARE_API_TOKEN = $Token
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
$env:HTTP_PROXY = "http://127.0.0.1:7890"

Set-Location "C:\Users\WHT99\Desktop\new\WDream-BYZM.github.io\worker"

Write-Host "正在部署到 Cloudflare Workers ..." -ForegroundColor Cyan
& "C:\Users\WHT99\AppData\Roaming\npm\wrangler.cmd" deploy

Write-Host ""
Write-Host "部署完成！请把上方输出的 https://byzm-multi.xxx.workers.dev 地址告诉我，" -ForegroundColor Green
Write-Host "我会帮你写进 legacy/multi/config.js。" -ForegroundColor Green
