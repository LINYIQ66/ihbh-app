import { ShoppingBag, Globe2, Leaf, Heart, ScanFace, MapPin, CalendarDays, Building2, UsersRound, Store, BookOpen, Radio, Video, Newspaper, Bot, Wallet, Gift, Gamepad2, Ticket, Coins, UserRound, ClipboardList, CreditCard, MessageSquare, Link2, Handshake, Briefcase, Boxes, TrendingUp, ShieldCheck, CircleHelp, FileText, LayoutGrid, Settings, ClipboardCheck } from 'lucide-react';

const navigationGroups = [
  { id: 'shopping', title: '商城精选', subtitle: '东方滋补，环球好物', Icon: ShoppingBag, items: /** @type {Array<[string, string, import('lucide-react').LucideIcon]>} */ ([
    ['商城首页', '/', Store], ['严选商品', '/#catalog', ShoppingBag],
    ['HBH专区', '/discover?section=hbh', Heart], ['GeneCells 系列', '/discover?section=hbh', Leaf],
    ['中药滋补', '/discover?section=herbal', Leaf], ['全球好物', '/discover?section=global', Globe2]
  ]) },
  { id: 'living', title: '生活与康养', subtitle: '照顾日常，也享受生活', Icon: Heart, items: /** @type {Array<[string, string, import('lucide-react').LucideIcon]>} */ ([
    ['本地生活', '/discover?section=local', MapPin], ['退休俱乐部', '/retirement-club', UsersRound],
    ['康养服务', '/discover?section=care', Heart], ['AI 诊疗', '/discover?section=ai', ScanFace],
    ['沙龙活动', '/events', CalendarDays], ['场地预定', '/venues', Building2],
    ['门店指南', '/stores', Store], ['Ai 凉茶铺', '/herb-tea', Leaf]
  ]) },
  { id: 'content', title: '内容与课堂', subtitle: '发现灵感，分享新知', Icon: BookOpen, items: /** @type {Array<[string, string, import('lucide-react').LucideIcon]>} */ ([
    ['巧掌柜课堂', '/discover?section=merchants', BookOpen], ['AI 问答', '/assistant', Bot],
    ['直播视频', '/live', Radio], ['视频', '/live?tab=videos', Video],
    ['种草社区', '/feed', MessageSquare], ['养生文章', '/feed?view=journal', Newspaper]
  ]) },
  { id: 'rewards', title: '会员与积分', subtitle: '会员权益，集中查看', Icon: Gift, items: /** @type {Array<[string, string, import('lucide-react').LucideIcon]>} */ ([
    ['我的中心', '/crm?role=user&tab=account', UserRound], ['会员权益', '/crm?role=user&tab=members', ShieldCheck],
    ['积分资产', '/assets', Wallet], ['积分与奖励', '/rewards', Gift],
    ['积分商城', '/points-mall', Coins], ['领券中心', '/coupons', Ticket],
    ['养参游戏', '/game', Gamepad2]
  ]) },
  { id: 'account', title: '我的与消息', subtitle: '个人事务，轻松管理', Icon: UserRound, items: /** @type {Array<[string, string, import('lucide-react').LucideIcon]>} */ ([
    ['全部功能', '/me', LayoutGrid], ['我的订单', '/orders', ClipboardList],
    ['我的票夹', '/tickets', Ticket], ['收货地址', '/addresses', MapPin],
    ['银行卡管理', '/bank-cards', CreditCard], ['消息中心', '/messages', MessageSquare],
    ['推广文章', '/crm?role=user&tab=promotions', Newspaper], ['个人资料', '/crm?role=user&tab=account', Settings]
  ]) },
  { id: 'partners', title: '合作与收益', subtitle: '连接伙伴，共创价值', Icon: Handshake, items: /** @type {Array<[string, string, import('lucide-react').LucideIcon]>} */ ([
    ['邀请分润', '/crm?role=user&tab=referrals', Link2], ['推广合作', '/agency', UsersRound],
    ['商家入驻', '/seller', Store], ['合伙人工作台', '/partner', Briefcase],
    ['全球招募', '/join', Globe2], ['经销商工作台', '/dealer', Boxes],
    ['收益明细', '/earnings', TrendingUp], ['HBH 业务系统', '/hbh-erp', LayoutGrid],
    ['门店核销', '/verify', ClipboardCheck]
  ]) },
  { id: 'help', title: '品牌与帮助', subtitle: '了解我们，找到支持', Icon: CircleHelp, items: /** @type {Array<[string, string, import('lucide-react').LucideIcon]>} */ ([
    ['九珍堂品牌', '/jiuzhentang', Leaf], ['品牌指引', '/brand', BookOpen],
    ['帮助中心', '/help', CircleHelp], ['联系我们', '/help#contact', MessageSquare],
    ['协议与隐私', '/help#policy', FileText], ['意见反馈', '/help#feedback', ClipboardList]
  ]) },
  { id: 'operations', title: '运营管理', subtitle: '管理员专属入口', Icon: ShieldCheck, adminOnly: true, items: /** @type {Array<[string, string, import('lucide-react').LucideIcon]>} */ ([
    ['运营看板', '/crm?role=admin&tab=overview', TrendingUp], ['客户管理', '/crm?role=admin&tab=customers', UsersRound],
    ['商品管理', '/crm?role=admin&tab=products', ShoppingBag], ['代理审核', '/crm?role=admin&tab=review', ClipboardCheck],
    ['联盟管理', '/alliance-admin', Handshake], ['进货订单审核', '/dealer-review', ClipboardList],
    ['提现审核', '/withdraw-review', Wallet]
  ]) }
];

export default navigationGroups;