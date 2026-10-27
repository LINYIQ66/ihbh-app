# 前台链接闭环与视频专区恢复记录

日期：2026-10-25。未发布，未改正式域名，未执行评论、预约、签到、付款、转账、开播或视频上传，未读取客户私密记录。本轮只改前台接线、状态与必要交互；权限、支付和库存生产阻断见原 production-readiness.md，该记录及后端文件均未修改。

## 证据范围，不混同浏览器测试

- 用户提供的正式站浏览器核查：78个唯一内部链接逐一到达；20个 concern 参数标题正常；35个 article 深链接此前均误落社区。该结果属于用户报告，不是本轮执行的测试。
- 本轮执行：源代码链接/路由/导入关系静态遍历，35条内容映射静态断言、前端构建、修改范围业务组件 ESLint、git diff --check。
- 修复后扫描范围中注册40个路由（39个具体路径及1个通配404）；第一次最终扫描发现123处词法导航调用/属性和71个去重的路由形式字符串。它们包括动态模板与路由声明，不等于71个实际点击链接，也不能替代用户的78条首页浏览器清单。
- 该次扫描没有发现可解析内部路径缺少路由，没有字面空 href/to 或单独 # 的链接。数据驱动 URL、动态点击函数、条件渲染、远端 HTTP 状态不在此结论内；最后补正的角色/课堂目录接线不新增路由。
- 未执行浏览器、真机、视频实际播放、屏幕阅读器、登录/跨账户、真实服务、并发或生产验收测试，不将上述静态结果写成“浏览器通过”。

## 文章深链接

入口：/feed?article=<slug> → FeedRoute → JournalArticle；/feed?view=journal → 全部35篇列表；/feed 不带 article/view=journal 仍是原 Feed 社区，不修改其查询和发布逻辑。

所有35条均已有正文：journalData.js 的3个 body 数组，以及 journalMore.js 的32条原始内容经 body:[p1,p2,NOTE] 映射。两个内容源文件未修改，原标题、摘要、中英文正文全部保留，不新增医疗文章、研究或专家背书。原 ArticlePanel 有倒计时阅读奖励，本次正文页不引入该奖励动作，仅复用内容数据。

新建统一 journalEntries 映射，首页 JournalStrip 与列表/正文读取同一来源。正文页优先显示已有正文；已知条目若将来正文缺失，保留标题/摘要并显示“完整内容筹备中”；未知或空 slug 显示明确未找到，不回落无关社区。正文无须依赖社区查询。

文章关闭为真实内部链接，返回来源首页灵感区或全部文章列表；独立打开/刷新时同样可按参数解析。标题设焦点目标；返回携带文章ID，回到对应卡片并展开首页后29篇所在区域。链接使用原生键盘交互；未声称浏览器返回滚动或辅助技术已经实测。

### 35条覆盖清单（全部有原正文，全部待浏览器复测）

目标均为 /feed?article=<下列slug>，匿名可读静态内容，无真实服务依赖。

| slug | 原标题 | 原摘要 |
|---|---|---|
| ginseng | 一支山参，藏着多少自然的时间？ | 从生长环境开始，认识野山参。 |
| ritual | 把滋养，放进日常的留白里 | 好好吃饭、好好休息，是健康的起点。 |
| nutrition | 认识配方，比追逐概念更重要 | 从标签出发，理性选择营养补充品。 |
| spring-liver | 春生之季，顺势舒展 | 早睡早起，多到户外走走。 |
| summer-heart | 炎夏静心，少汗多饮 | 暑热时节，补水与午休同样重要。 |
| autumn-lung | 秋燥时节，润物无声 | 梨、百合、银耳，是秋日餐桌的常客。 |
| winter-kidney | 冬藏之道，养精蓄锐 | 早卧晚起，注意腰腹与足部保暖。 |
| nine-constitutions | 认识中医九种体质 | 了解自己，调养才有方向。 |
| qi-deficiency | 容易疲倦？说说气虚 | 说话无力、稍动即汗，可能与气虚有关。 |
| yin-deficiency | 口干手心热，留意阴虚 | 少熬夜，是养阴的第一步。 |
| damp | 身体沉重？谈谈湿气 | 新加坡湿热气候，更需留意祛湿。 |
| ginseng-types | 人参、西洋参、党参有何不同 | 三种"参"，性味各有不同。 |
| ginseng-use | 人参的几种家常吃法 | 切片含服、泡茶、炖汤，各有讲究。 |
| cordyceps | 认识冬虫夏草 | 高原上的菌与虫，珍稀而需谨慎辨别。 |
| birdnest | 燕窝的挑选与炖煮 | 泡发、挑毛、隔水炖，一样不能少。 |
| goji | 一颗枸杞的日常智慧 | 泡茶、煮粥、入汤，都很百搭。 |
| red-dates | 红枣，最家常的补益 | "一日三枣，红颜不老"的由来。 |
| chinese-yam | 山药：平和的养脾之选 | 蒸、炒、煲汤，口感各异。 |
| sleep | 子时入睡，养好一身精神 | 睡眠是最不花钱的滋补。 |
| foot-soak | 泡脚的正确打开方式 | 水温、时长与人群禁忌。 |
| baduanjin | 十分钟八段锦 | 动作舒缓，适合各个年龄。 |
| walking | 饭后百步走的学问 | 不是马上走，也不是越快越好。 |
| emotions | 七情与健康 | 怒伤肝、思伤脾，情绪也需要调养。 |
| tea-types | 六大茶类，怎么选 | 绿茶清新，红茶温暖，各有所宜。 |
| flower-tea | 一杯花草茶的温柔 | 菊花、玫瑰、桂花，各有风味。 |
| soup-basics | 广式老火汤的门道 | 时间与火候，是汤的灵魂。 |
| congee | 一碗粥的养胃智慧 | 小米、山药、南瓜，暖胃又易消化。 |
| women-care | 女性的周期调养 | 不同阶段，饮食重点不同。 |
| men-care | 忙碌男士的日常调养 | 少烟酒、多运动、睡够觉。 |
| elder-care | 乐龄生活，慢慢来 | 少量多餐、防跌倒、多社交。 |
| office-eyes | 屏幕族的护眼小习惯 | 20-20-20 法则，简单有效。 |
| digestion | 脾胃是后天之本 | 吃得规律，比吃得贵更重要。 |
| acupoints | 三个日常保健穴位 | 足三里、合谷、涌泉。 |
| tonic-mistakes | 进补的五个常见误区 | 越贵越好？越多越补？ |
| supplement-label | 读懂保健品标签 | 成分、剂量、认证，一个不少。 |

## 视频专区回归修复（本轮优先项）

历史证据：9d8884a 的 Live.jsx 同时导入 UserLiveHub、VideoLibrary、LiveHall、ShopperBanner 和多组旧视觉组件；8495221 将 Live.jsx 改为仅 LiveDiscovery，遗漏 VideoLibrary。不是视频内容实体被删除；本轮未执行任何数据删除。

现恢复 /live → Live 页面中的“直播／视频”两个清楚入口；/live 默认新版直播发现，/live?tab=videos 显示原 VideoLibrary；底部导航仍称“直播”并继续指向 /live。文章路由及既有其他修复不回滚。

分类地址：
- /live?tab=videos&category=qiao：巧掌柜
- /live?tab=videos&category=ip：达人IP
- /live?tab=videos&category=class：课堂
- /live?tab=videos&category=visit：探店

### 实际视频来源与接线

1. **原 VideoLibrary 分类库**：一直读取 VideoPost.category 与 video_url，原查询每分类取24条，本轮保持同一实体/字段/类别，改为12条游标分页及加载更多，以免超出原24条时静默遗漏。读取失败和空分类分开提示；没有根据旧“数量0”快照隐藏组件。VideoPost 的既有管理员上传仍按原权限保留，未触发上传，未改存储策略，原方式是永久公开存储。
2. **原站既有配置素材**：通过 ExistingVideoArchive 独立呈现，不伪装成某个空分类的条目，也不冒充直播/单课实录。
   - 原 MerchantVideo、QiaoZhangGui、shopperCourses 共同引用的 MOV：`https://media.base44.com/videos/public/6aa3280ca2d875c1b77cdd8e/edd93fcdf_655.mov`，以原“巧掌柜介绍视频”身份保留。shopperCourses 内常量虽名为 DEMO_VIDEO，但同一地址也是原介绍板块使用的既有素材；不把它包装成24门课程的独立录像。
   - 原 hbhMaterials.materialVideos 七条 MP4，保留原始 URL、标题及横竖屏信息，原配置文件未改：
     - 95a8af9fb_video_2.mp4：绿氧舱宣传片
     - 7135fa993_video_3.mp4：科普：为什么氧对身体很重要（横屏）
     - 1f0487671_video_4.mp4：科普：为什么氧对身体很重要（竖屏）
     - 3224f9acb_video_5.mp4：科普：如何判断身体缺氧
     - 452d50177_video_6.mp4：科普：微高压氧的意义
     - 5fa0dd5c2_video_0.mp4：智能睡眠枕介绍
     - 9600c7e86_video_1.mp4：眼部按摩仪介绍
     - 七条地址仍使用原配置的 `https://base44.app/api/apps/6aa3280ca2d875c1b77cdd8e/files/mp/public/6aa3280ca2d875c1b77cdd8e/` 前缀，不改域名、不复制或生成视频。
3. **播放组件**：RecordedVideo 使用原生 video controls、playsInline、metadata 预加载；不自动播放。无效来源显示不可用；原来源加载/解码失败明确报错，可重载同一来源；缓冲停滞提示可重载，不添加替代样片。没有伪造播放成功。
4. **不恢复**：LiveHall 静态人气、LiveChat 静态消息、假预约、返利及无视频源的 Replay 图片卡。原文件保留不删除。预录内容和实时直播分开，不把预录内容标成LIVE。
5. **未测试**：没有实际播放、远端源可达性/有效期、MOV浏览器编解码、移动全屏/音量、缓存或字幕验收，均待实测。IP与探店若实体中没有条目，不凭空制作内容或把其他素材强行归到这两个分类。

## 全站路径覆盖与访问/服务依赖

下表是代码静态判定，全部未做本轮浏览器逐页复测。前台路由守卫不等于数据库权限验证，未因此扩大权限。

| 路径或参数族 | 登录/身份要求（现状） | 内容或真实服务依赖 |
|---|---|---|
| / | 公开浏览 | Product目录查询，既有购物/积分行为另需业务核验 |
| /?concern=<20个既有key>#catalog | 公开浏览 | 原wellnessCategories映射、Product查询；用户报告旧标题正常 |
| /?q=<编码关键词>#catalog | 公开浏览 | Header/FaceReadingResult → Product筛选 |
| /?product=<id>#catalog | 仅公开已发布商品，不放宽RLS | Product详情查询；缺失/无权限/错误现在有状态及返回 |
| /game | 公开体验路由保留 | 既有体验状态/积分行为未改变，未执行 |
| /live、视频参数族 | 公开发现/预录浏览，原上传仅管理员 | LiveRoom、既有Actor观看连接、VideoPost、既有MOV/MP4 |
| /feed | 公开社区外壳，写行为依赖原身份/权限 | CommunityPost/Comment/Like/Product/MemberPromotion；未改原数据逻辑 |
| /feed?view=journal、article族 | 公开 | 静态文章映射，不调用社区查询、不发奖励 |
| /discover、section=hbh/herbal/care/ai | 公开 | 原内容、产品目录或问答入口；未知栏目有明确返回 |
| /discover?section=global | 公开 | GlobalProduct及外部Amazon；旧Product深链接重定向回正确商品目录 |
| /discover?section=local | 公开已发布商户 | LocalListing；预约/团购未接入，示例非交易 |
| /discover?section=merchants | 公开 | 既有课程配置与同一演示MOV；不是每课独立录制来源 |
| /messages | 公开入口 | 既有本机消息及customerServiceReply；模拟客服文案/自动回复未在本轮改业务逻辑 |
| /promotion/:id | 公开读受现有实体规则约束 | MemberPromotion和关联Product，服务不可读不代表不存在 |
| /crm、role=user、tab=account/members/referrals/promotions | 公开外壳，账户内容需登录 | 原会员、邀请、推广、支付入口等；本轮不操作服务 |
| /crm?role=admin、tab=products等 | 现有逻辑检查真实管理员身份，不凭参数授权 | 原管理查询/RLS；非管理员原逻辑回到会员视角，未放宽 |
| /agency | 公开 | 静态合作规则与现有入口 |
| /join | 公开 | 到现有CRM/合作入口 |
| /brand | 公开 | 原品牌内容 |
| /jiuzhentang | 公开 | 原品牌内容、宣传PDF及发现入口 |
| /seller | 公开介绍 | 原合作内容和/partner申请入口 |
| /hbh-erp | 公开展示 | 原静态ERP说明，不代表真实结算服务 |
| /me | 公开功能索引 | 按既有菜单到各页面 |
| /events | 公开浏览，原报名要求登录 | SalonEvent/Ticket，未报名、不新接真实履约 |
| /venues | 公开浏览，原预定要求登录 | Venue/Ticket，未预定、不改变库存规则 |
| /tickets | PageShell需登录 | 自己的Ticket及原权限 |
| /orders | 原体验记录展示 | ExperienceProvider本机订单，不是服务端履约保证 |
| /addresses | PageShell需登录 | 原Address创建者查询；仅补标签/删除名称 |
| /bank-cards | PageShell需登录 | 原BankCard，仅补标签/删除名称，不变更保存规则 |
| /help、#contact/#faq/#feedback/#policy | 公开内容，原反馈提交需登录 | 原Feedback；只补标签，不执行反馈 |
| /verify | 需登录，原内部逻辑限制管理员 | Ticket核销，未执行、未变更身份/权限 |
| /coupons | 公开浏览，原领取要求登录 | Coupon/Ticket，未领取 |
| /points-mall | 公开展示，原兑换要求身份 | 既有积分/Ticket逻辑，不执行、不变更 |
| /stores | 公开 | Store查询与本机选择，未执行切店 |
| /herb-tea、#about/#flow/#tech/#teas/#compliance | 公开 | 既有静态内容和同页锚点 |
| /dealer | PageShell需登录 | PurchaseOrder/ShipOrder等原业务，未采购/出货 |
| /dealer-review | 需登录，原内部管理员检查 | PurchaseOrder审批，不执行 |
| /earnings | 需登录 | Earning/Withdrawal/BankCard等，不执行提现 |
| /withdraw-review | 需登录及原内部管理员检查 | Withdrawal，不执行审批/打款 |
| /assistant | 原ProtectedRoute需登录 | 原AI agent服务；仅过滤正文链接协议，不改工具/权限 |
| /assets | 原ProtectedRoute需登录 | 自己的pointsLedger；匿名明确登录/返回，查询错误不再无限加载 |
| /partner | 原ProtectedRoute需登录 | 自己的AgentApplication/Product；明确加载、登录、失败/无权限、重试 |
| /alliance-admin | 需登录及原管理员检查 | AllianceApplication/Transaction，不执行审批/写入 |
| /login、/register、/forgot-password、/reset-password | 公共认证页 | 原平台认证；保留OTP、returnTo与重置路径，不修改认证流程 |
| 其他路径（*） | 不要求新增权限 | 中文404和返回首页；未新增路由以掩盖断链 |

## 主导航、footer与动态目标检查

- 底部：/、/messages、购物车按钮、/assistant、/live、/crm?role=user&tab=account、资料弹层。都有已有路由或已有状态处理；不将按钮误当缺href。购物、AI、资料服务仍有原生产限制，不宣称端到端通过。
- 页头：Logo回首页、搜索到 /?q=...#catalog、账户和发现/直播入口；内部链接仍相对路径。
- Footer：/join、/、/discover?section=hbh、global、merchants、/crm?role=user&tab=account、/partner、/brand、/feed、/live；#terms/#privacy/#returns 是触发 legalDocs 状态的按钮，不是失效页面锚点。未修改法律正文、域名或健康文案。
- 锚点：#catalog、#journal、#profile-details、#flow，/help 的四个锚点及 HerbTea 的五个锚点在对应组件有目标；ScrollToTop 现在包含search变化，并在带hash的POP/初始加载时尝试定位，异步目标及实际滚动待浏览器验证。
- 推广/社区商品链接：productPath 先前将iHerb来源的Product错送到GlobalProduct发现页，该页不解析此Product且没有对应目录锚点；现在所有Product走自己的 /?product=id#catalog。旧全球发现Product参数入口也转到该目标。商品详情失败/未找到不会静默只留下列表，关闭会清除product参数。
- 课堂：HbhChannels原“巧掌柜课堂”指向社区，现指向 /discover?section=merchants；QiaoZhangGui四条未绑定单课来源的入口改为视频分类目录，明确标“单课视频尚待配置”，保留原标题，不假造独立教程。
- 邀请：GamePreview的邀请好友入口改为 /crm?role=user&tab=referrals，不再传不被CRM消费的agent视角。UtilityPanel角色按钮分别去会员、/partner、/seller、管理员CRM，不授予任何权限；原CRM角色校验不改。
- 外链：Product.source_url、WellnessNews.url、AI Markdown链接增加HTTP(S)协议/凭据检查；无效来源显示不可用而非空链接，内部AI链接使用相对路由。Amazon继续使用原merchantUrl更严格白名单，不扩大外链范围。
- 其他原外链：邀请/分享使用原正式域名；宣传PDF、素材下载/签名文件、GeneCell来源、Phantom下载、tel/mailto、社交分享等保留。未网络探测这些目标，不把合法协议写成可达性证明。原Checkout预先 window.open('') 是防弹窗阻止的预开页，不是空href占位，本轮不改支付。
- 旧MerchantDetail中的无电话号码wa.me入口和旧LiveHall/Chat的模拟交互属于当前直播/本地发现入口不再导入的旧组件，记录但不恢复或删除。

## UI与匿名状态的必要修复

- /partner和/assets保留ProtectedRoute，匿名渲染中文AccessNotice，给出显式登录（保留returnTo）和返回首页，不渲染私有工作台。
- Partner读失败finally结束loading；401、403与网络失败有不同提示，不将拒绝访问写成“暂无资料”。Assets分别处理认证等待、匿名、认证失败、资料失败/无权限、资料为空，不用!data无限显示加载；余额查询缓存含用户ID，匿名不订阅账本。
- useMe仅将401作为匿名，其他错误保留为错误且不自动重试；PageShell显示账户错误/重试，登录按钮中文，返回图标有中文可访问名称；默认认证等待有中文status。
- 公共响应弹层：手机增加明确关闭按钮与Escape处理，桌面保留原Radix关闭；内容区域可滚动并预留底部安全区。未改既有弹层业务回调。
- 统一可见焦点覆盖a/button/input/select/textarea/summary/tabindex，footer深背景使用亮焦点；手机底部导航/主内容/浮动按钮增加安全区间隔，不改变桌面布局。
- 地址、银行卡、券码、帮助反馈、消息输入及发送/表情按钮补中文名称或标签；未全面重写其他旧表单。

## 仍待后续验证/处理，不能写成通过

- 35篇正文、返回焦点、刷新深链；匿名/过期登录/403/网络失败分支；视频四分类、原MOV/MP4实播、iOS全屏/音量、来源失败重试；580px附近手机底部遮挡和所有弹层键盘行为，都需要浏览器或Testing Agent验收。
- 词法扫描不是完整JSX/运行时语义分析：所有数据驱动外链、按钮业务副作用、旧动态表单标签、远端服务成功与否没有逐个执行，未声称全站无缺陷。
- 旧社区列表/评论全量请求、部分页面把读取失败与空列表混用、其他旧表单标签及错误状态、旧客服模拟承诺、课程独立录制源配对，仍是后续专项，不因本轮链接修复而声称完成。
- 原权限访问限制、MemberProfile数据隔离、审核字段保护、商户/订单隔离、服务端库存/定价、支付回调幂等和直播容量等阻断仍成立，未降低限制消除警告。

## 静态检查结果

最终代码检查：npm run build、修改范围业务组件ESLint、git diff --check已通过；ESLint有1条原有未使用参数警告（UtilityPanel奖励记录循环的i），无错误，未为消警告改动该无关逻辑。src/App.jsx、src/hooks与src/lib不在现有ESLint配置匹配范围，构建覆盖这些改动，不冒称它们通过ESLint。Browserslist数据库过旧提示保留，未更改依赖。最终静态扫描仍为40个路由、123处词法导航属性/调用、71个去重路由形式字符串，可解析字面路径没有缺失路由；这些都不是浏览器点击或视频实播测试。