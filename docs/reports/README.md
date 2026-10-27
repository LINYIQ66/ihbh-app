# iHBH App 交付资料

本目录保存本次代码审计、修复及分润核对产生的完整交付资料。

| 文件／目录 | 内容 |
| --- | --- |
| [globest-mall-audit.html](globest-mall-audit.html) | 原始代码审计报告 |
| [globest-mall-repair.html](globest-mall-repair.html) | 修复对应表与验证边界 |
| [dealer-profit-review.html](dealer-profit-review.html) | 经销商分润规则、承担方和对账示例 |
| [dealer-profit-examples.json](dealer-profit-examples.json) | 16 组计算结果 |
| [repair-validation](repair-validation) | 48 项测试及类型、Lint、构建、依赖检查记录 |
| [dealer-source](dealer-source) | 用户提供的三份规则 PDF 及核对页图像，随本公开仓库提供 |
| [github-upload-preparation.html](github-upload-preparation.html) | 原仓库自动部署检查与上传准备记录 |
| [globest-mall-repaired.zip](globest-mall-repaired.zip) | 新建仓库前的源码交付快照 |
| [globest-mall-repair.patch](globest-mall-repair.patch) | 原修复分支的提交补丁 |
| [audit-evidence.zip](audit-evidence.zip) | 原审计证据 |

JSON 文件提供对应的机器可读结果；`github-pr-draft.txt` 保留原计划的 PR 草稿。
报告中的“尚未上传”等状态是生成当时的历史记录；其检查对象是原仓库，不能用来判断新仓库的当前远端状态。
这些资料不含生产数据库导出或登录密钥。新仓库没有随上传执行真实付款、生产账目迁移或应用发布。
HTML 报告可下载后用浏览器打开，GitHub 文件页主要展示源码。当前应用源码以本仓库根目录为准，归档 ZIP／补丁用于追溯。
