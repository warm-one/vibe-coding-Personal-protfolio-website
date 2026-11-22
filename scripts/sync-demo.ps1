# 重新构建 Markdown 演示，并把产物同步到本站 public/demos/markdown/
#
# 演示源码不在本仓库里（保持两个项目独立），所以改动演示后要跑一次这个脚本。
#
# 用法:
#   powershell -ExecutionPolicy Bypass -File scripts/sync-demo.ps1
#   powershell -ExecutionPolicy Bypass -File scripts/sync-demo.ps1 -AppDir "D:\别的路径\markdown"

param(
  [string]$AppDir = 'D:\vibecoding-shizhan\markdown',
  [string]$Base = '/demos/markdown/'
)

$ErrorActionPreference = 'Stop'

$siteRoot = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $siteRoot 'public\demos\markdown'

if (-not (Test-Path $AppDir)) {
  throw "找不到演示源码目录: $AppDir"
}

Push-Location $AppDir
try {
  Write-Host "· 类型检查" -ForegroundColor Cyan
  npx tsc --noEmit

  Write-Host "· 构建 (base=$Base)" -ForegroundColor Cyan
  npx vite build --base=$Base
}
finally {
  Pop-Location
}

$dist = Join-Path $AppDir 'dist'
if (-not (Test-Path $dist)) {
  throw "构建产物不存在: $dist"
}

if (Test-Path $dest) {
  Remove-Item $dest -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item (Join-Path $dist '*') -Destination $dest -Recurse -Force

Write-Host "✓ 已同步到 $dest" -ForegroundColor Green
