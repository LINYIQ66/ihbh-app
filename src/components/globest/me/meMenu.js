// Every module from the HBH-APP spec, mapped to a page in this app.
export const meMenu = /** @type {Array<[string, Array<Array<string>>]>} */ ([
  ['首页推荐', [['推荐商品 / 分类 / 搜索', '/'], ['商品评论 · 种草', '/feed'], ['文章阅读 · 内容聚合', '/discover'], ['沙龙活动 · 报名', '/events'], ['场地预定', '/venues'], ['养生课堂', '/live'], ['推荐异业 · 领券', '/discover?section=local']]],
  ['经销合作', [['经销商等级 · 折扣与权益', '/crm?role=user&tab=dealers'], ['推广合作 · 加入流程', '/agency'], ['账户信息 · 会员等级', '/crm?role=user&tab=account'], ['服务码 · 邀请码', '/crm?role=user&tab=account'], ['进货 · 库存 · 出货', '/dealer'], ['主理人订单审核', '/dealer-review'], ['客群名单', '/crm'], ['权益 · 升级', '/crm?role=user&tab=members'], ['结算及收益 · 提现', '/earnings'], ['提现审核 · 录入结算', '/withdraw-review']]],
  ['我的', [['票夹：服务 · 卡券 · 票', '/tickets'], ['订单记录 · 售后', '/orders'], ['账户 · 积分资产 · 转让', '/assets'], ['银行卡', '/bank-cards'], ['地址管理', '/addresses'], ['个人设置', '/crm?role=user&tab=account']]],
  ['种草 · 积分商城', [['种草内容 · 发布 · 互动', '/feed'], ['签到打卡 · 种草游戏', '/game'], ['积分商城 · 兑换', '/points-mall'], ['领券中心', '/coupons']]],
  ['门店 · 商家', [['切换门店', '/stores'], ['商家入驻', '/seller'], ['全球招募', '/join'], ['门店核销 / 异业核销', '/verify'], ['异业联盟后台', '/alliance-admin'], ['合伙人工作台', '/partner']]],
  ['消息 · 设置', [['消息中心', '/messages'], ['常见问题', '/help#faq'], ['联系我们', '/help#contact'], ['协议政策', '/help#policy'], ['问题反馈', '/help#feedback'], ['关于我们', '/jiuzhentang']]],
]);