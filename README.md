# iHBH App · 健康、美丽、快乐

iHBH App 是面向会员、消费者、商家及经销商的健康生活服务应用，汇集 HBH 产品专区、商城购物、会员服务、社区内容与经销商经营管理。

本仓库保存 iHBH App 的 Web 应用代码，基于 React 与 Base44 开发。本仓库独立保存基于原 `globest-mall` 项目完成的修复版本。现有商城页面及部分代码沿用 **Globest Mall／九珍堂商城** 名称，业务组件主要位于 `src/components/globest/`。

## 应用功能

| 模块 | 功能 |
| --- | --- |
| 商城与 HBH 专区 | 商品分类与搜索、商品详情、购物车、优惠券及订单管理 |
| 会员中心 | 会员资料、收货地址、会员权益、积分与账单 |
| 经销商中心 | 合伙人、官方、总代账户，采购入库、销售出库、库存成本、分润及提现申请 |
| 社区与内容 | 社区动态、文章、视频与直播 |
| 活动与本地生活 | 活动报名、票券核销、场地预约及商家展示 |
| CRM 管理后台 | 商品维护、订单处理、经销商审核、财务核对及经营数据查看 |
| AI 服务 | 客服问答及图片分析相关入口，依赖服务端配置 |

各模块是否可用取决于账户权限、商品数据及所连接 Base44 应用的服务配置。

## 经销商与分润规则

iHBH 经销商体系包含 **合伙人、官方、总代** 三个等级。采购采用商品配置的对应等级拿货价，销售订单保存实际采购批次成本与结算快照。

- 一次性介绍奖励按被介绍经销商**首笔有实收的完成销售金额 × 8%**计算，由总部／HBH 单店承担。
- 同级介绍奖励最多支付最近三级，分别为实收的 **5%、3%、2%**；适用的收益项目叠加。
- 官方的同级介绍奖励由成交官方的直属合伙人承担；总代的同级介绍奖励由成交总代的直属官方承担。
- 合伙人的同级介绍奖励支持“总部承担”与“指定上级合伙人承担”两种模式，**仅指定超级管理员可以设置**。
- GeneCells 不计全业返利及渠道份额；无实收的库存领用不产生销售奖励。
- 金额按整数分计算，每位收款人分别四舍五入；承担方支出等于实际奖励入账之和。切换配置不会改写历史订单快照。

完整计算依据、对账示例及异常恢复流程见 [财务规则与运维说明](docs/FINANCE_OPERATIONS.md)。

## 技术结构

- 前端：React 18、Vite、React Router、Tailwind CSS、Radix UI、TanStack Query。
- 后端：Base44 身份认证、实体数据、服务端函数与 Actor。
- 支付相关：Stripe Checkout 与服务端 Webhook 校验；商城另有现有 HBH 支付流程。
- 验证：Node.js 自动化测试、TypeScript `checkJs`、ESLint 与 Vite 构建。

```text
src/
  api/                    # Base44 客户端与业务接口
  pages/                  # 应用页面与管理入口
  components/globest/     # iHBH 商城、会员、经销商等业务组件
  components/ui/          # 通用界面组件
base44/
  entities/               # 数据实体与访问权限
  functions/              # 服务端业务函数
  shared/                 # 分润、库存、支付及财务处理逻辑
  actors/                 # 直播等实时交互
  config.jsonc            # 本地运行与构建配置
tests/                    # 自动化验证
docs/                     # 财务运维与发布说明
```

## 本地开发

使用 Node.js **22.18 或更高版本**；本次验证环境为 Node.js 24.13.0。运行 Base44 本地后端还需要 Base44 CLI 和 Deno。

```bash
git clone https://github.com/LINYIQ66/ihbh-app.git
cd ihbh-app
npm ci
npm install -g base44@latest
base44 login
base44 link
base44 dev
```

安装 Deno 的步骤见 [Deno 官方文档](https://docs.deno.com/runtime/getting_started/installation/)。关联应用时请选择专用测试应用。每次新克隆都需要执行 `base44 link`，生成的 `base44/.app.jsonc` 仅保留在本地。

`base44 dev` 会按项目配置同时启动本地后端与前端，访问终端输出的地址。本地实体数据保存在内存中，重启后清空；Core 集成和 OAuth 等部分服务仍可能访问已关联应用。应用需至少发布过一次，前端才能取得所需的应用设置。

仅需前端连接已托管后端时，可以使用 `base44 dev --remote`。**该模式会访问关联应用的真实数据**，开发前应确认目标是测试应用。

## 环境与权限配置

前端读取 `VITE_BASE44_APP_ID`、`VITE_BASE44_APP_BASE_URL` 和 `VITE_BASE44_FUNCTIONS_VERSION`。这些用于确定所连接的应用；服务端密钥不能放入任何 `VITE_` 变量。

在 Base44 服务端配置以下项目：

| 配置 | 用途 |
| --- | --- |
| `BASE44_APP_ID` | 支付校验所使用的应用身份 |
| `APP_PUBLIC_ORIGIN` | 支付完成后的可信回跳地址，应显式配置对应环境 |
| `STRIPE_SECRET_KEY` | 对应环境的 Stripe 服务端密钥 |
| `STRIPE_WEBHOOK_SECRET` | Stripe 回调签名验证 |
| `KOPI_API_KEY` | 图片分析集成凭证 |
| `SUPER_ADMIN_USER_ID` | 有权修改合伙人奖励承担方式的管理员 User ID |

超级管理员账户同时需要 Base44 内置 `admin` 角色。普通管理员只能查看分润模式；未设置模式或缺少有效承担方时，相关结算会被阻止。还需为真实商品配置各经销等级的拿货价与产品结算类别。

不要提交 `.env*`、应用绑定文件、支付密钥、登录凭证或生产数据。

## 开发验证

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm audit
```

2026-10-27 的修复版本通过 **48 项自动化测试**、前端类型检查、ESLint 和生产构建。测试覆盖财务权限、并发与重试、分润计算、库存批次、支付验证等；其中 Base44 使用模拟数据层，不能替代真实平台联调。

## GitHub 与发布

这是独立的 iHBH App 私有仓库，完整修复版本保存在 `main`。新建仓库本身不会连接原 Base44 应用，本次上传也不包含原应用的发布或数据迁移操作。

后续开发应建立功能分支，通过 PR 审查后合并。需要运行或发布时，先在独立 Base44 测试应用中配置环境与商品数据，并完成权限、支付、分润、提现和恢复流程的真实平台验收。

正式上线前备份并核对历史账目，配置超级管理员、各等级拿货价及环境密钥。前端、实体权限、函数、共享模块与 Actor 必须配套发布；通过验证后再选择并确认正式应用的发布方式。

新仓库与原仓库的关系见 [仓库与发布说明](docs/GITHUB_RELEASE.md)。本次制作的审计报告、分润示例、验证日志、源码交付包、补丁以及规则参考 PDF 均保存在 [交付资料目录](docs/reports/README.md)。其中报告记录的是生成当时的检查结果，不代表已在生产环境完成验收。

## 相关文档

- [Base44 GitHub 同步与发布](https://docs.base44.com/developers/app-code/local-development/github)
- [Base44 本地开发](https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview)
- [Base44 CLI](https://docs.base44.com/developers/references/cli/get-started/overview.md)
