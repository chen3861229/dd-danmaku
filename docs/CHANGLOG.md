#### 1.48 待发布

#### 1.47
fix: 修复播放页高能进度条和时钟永久开问题
fix: 修复轴偏秒设置失效
feat: 添加两个调试开关，顶底弹幕滚动，在任意处测试弹幕
fix: 优化和修正合并新特性
feat: 提取标题的时候，额外提取季度集数作为入参进行检索，提高准确度. by @l429609201 in #85
feat: 增加智能匹配功能. by @l429609201 in #85
feat: 增加自定义弹幕API. by @l429609201 in #85
feat: 为官方API添加match接口支持. by @l429609201 in #85
feat: 多季度播放的时候检索内容优化. by @l429609201 in #85
feat: 将官方API和自定义API缓存区分化. by @l429609201 in #85
feat: 添加播放时弹幕推理匹配的功能（基于dandanplay epid连续的特性）. by @l429609201 in #85
feat: 合并搜索结果，同时展示官方API和自定义API搜索结果. by @l429609201 in #85
feat: 修复worker端无法传递match请求头的问题. by @l429609201 in #85

#### 1.46
fix: 修复 Windows UWP 版的首次播放弹幕不加载问题
fix: 懒加载 queryLocalFonts 以优化 UWP 版每次的权限弹窗
fix: 修复推送 bangumi 条目未收藏问题
fix: 修复 fontStyle 值问题
docs: 归档测试代码

#### 1.45
feat: 设置项更名,弹幕高能进度条,提供免过滤,颗粒度调整
feat: 新增查看视频适配器情况调试项
fix: 修复上个版本引入的 embySlider 重载弹幕问题
fix: 修复安卓上小概率弹幕容器初次加载失败问题
fix: 修复事件监听重复问题
fix: 修复推送 bangumi 为跳过更新已看条目
refactor: 拆分出播放界面设置

#### 1.44
feat: 合并相似弹幕设置项
feat: 播放界面头中显示时钟设置项
feat: 自动过滤弹幕数阈值设置项
fix: 修复 useFetchPluginXml
fix: 修复多季下的 putBangumiEpStatus
fix: 优化部分元素间距
fix: 加载时检测媒体分类
chore: 升级 danmaku 上游依赖版本
refactor: 移动 buildDanmuPluginDiv UI
refactor: 简化 embySlider,增强 waitForElement

#### 1.43
feat: 简易实现加载媒体服务端xml弹幕
fix: 再次修复附加第三方弹幕源错误

#### 1.42
fix: 对接弹弹 play OpenAPI 认证
feat: 新增过滤 emoji 设置项
feat: 新增窗口化弹窗和弹窗靠右布局设置项
fix: 优化 AndroidTV 下的一些样式
fix: 优化 AndroidTV 下的 quickDebug
fix: 移除 Object.entries 以提升兼容性

#### 1.41
feat: 提供弹幕字体设置
fix: 修复推送 bangumi 部分失败问题
fix: 同步 dom textShadow 适配透明度
fix: 修复弹幕斜体修改不生效
fix: 正确按章节隔离附加弹幕
fix: 按 cid 简易去重附加弹幕
fix: 尽量适配 TV 布局的控件焦点高亮
fix: 降低为 ES9 等级以适配部分 AndroidTV
fix: 修复 AndroidTV 上弹幕按钮位置错误
fix: 修复 embySlider embySelect 适配 TV 布局

#### 1.40

#### 2024-11-16
feat: 新增屏蔽滚动弹幕

#### 2024-11-11
feat: 新增弹幕粗细,弹幕斜体设置

#### 1.39

#### 2024-11-08
fix: 优化自动匹配,同剧集手动匹配后的自动匹配更加精确
fix: 修复 Cloudflare Pages 部署的 js 中文乱码
fix: 修复 IOS 端长按事件

#### 2024-10-30
feat: 添加进度条上显示弹幕每秒内数量折线图开关
fix: 修复弹幕图遮挡进度条操作问题

#### 1.38

#### 2024-10-26
fix: 修复附加第三方弹幕源错误
fix: 避免重复添加emby小秘版toast样式

#### 2024-10-23
fix: 修复小秘客户端播放过程中 toast 消息提示框不显示问题

#### 1.37

#### 2024-10-20

fix: 修复 web 端自动播放下一集时的错误
(https://github.com/chen3861229/dd-danmaku/issues/14)

fix: 修复小秘客户端的首次播放弹幕不加载问题

#### 1.36

#### 2024-10-16
refactor: 折叠不常用功能

fix: 精确 match 范围
(https://github.com/chen3861229/dd-danmaku/issues/12)

fix: 缩小部分不合理的数值范围

#### 1.35

#### 2024-10-15
fix: 修复 IOS 端兼容引起的新问题

#### 2024-10-14
fix: 修复 IOS 端弹幕不显示问题

refator: 优化提交 Bangumi 的提示信息

#### 1.34

#### 2024-10-13
fix: 修复弹幕显示区域调节不生效问题

#### 2024-10-12
fix: 更换上游依赖 CDN 地址修复移动宽带下的加载失败
(https://github.com/chen3861229/dd-danmaku/issues/5)
(https://github.com/9channel/dd-danmaku/pull/60#issuecomment-2354555162)

fix: 修复初始化的重复触发
(https://github.com/chen3861229/dd-danmaku/issues/8)

feat: 添加自定义接口地址功能
(https://github.com/chen3861229/dd-danmaku/issues/7)

feat: 新增几个调试选项

refator: 抽取 classes styles

fix: 修正平滑处理定时器在暂停时依旧运行，导致恢复播放触发seeking事件而刷新弹幕问题

#### 2024-10-11
fix: 修正客户端弹幕从右边平滑显示出来

fix: 修正客户端更改播放进度反复触发事件问题

refator: 调整高级设置、关于的高度

#### 2024-10-10
refator: 合并部分 tab 的设置项,并优化部分设置项样式

feat: 持久化所有的调试开关

#### 2024-09-30
refator: 优化手动匹配

fix: 修复 bangumi 推送异常

fix: 桌面客户端更改播放进度弹幕消失问题

feat: 播放控制界面添加弹幕信息

#### 2024-09-26
feat: 实验性新增 Bangumi 设置

feat: 媒体信息标签新增 Bangumi 剧集角色信息

feat: 新增几个调试选项

fix: 优化部分功能体验

#### 1.33

#### 2024-05-24 以来

1.合并参照了 PR,感谢他们,

https://github.com/9channel/dd-danmaku/pull/53
https://github.com/9channel/dd-danmaku/pull/55
https://github.com/9channel/dd-danmaku/pull/62

2.移除了初始化阶段的~~所有~~部分轮询等待,改用 embyCustomEvent 提升性能,这个是 2017 年很老的 api 了,属于 Emby 还未分家,所以 Jellyfin 也是可以使用的

3.弹幕大小初始化计算的时候改为客户端本身计算后的播放界面媒体 h3 次标题名称大小

4.移除了最外层的特定 emby 版本和品牌判断方法

5.兼容特殊情况的依赖加载,例如其他类型的脚本加载器[CustomCssJS](https://github.com/Shurelol/Emby.CustomCssJS)会使用 eval 执行代码,不会报错但会导致后续 emby 自己的代码加载失败

6.精确化弹幕按钮容器定位的目标并删除了 getElementsByInnerText 函数

~~7.添加了 getEmbyItemInfo from pluginManager null 情况的补偿措施,后发现安卓为 NativePlayer ,故此措施治标不治本但留作 failback 使用~~

7.验证 getEmbyItemInfo from pluginManager null 是预期情况,已还原更改

~~8.添加了对 JellyfinWeb 的支持(只测试了 10.8.3 和 10.9.6),不完美的地方有必须点进一次详情页才能获取到 itemId ,还有是图标为方块,不清楚图标该如何更改,改完才发现历史 issus 中有其他人维护的 fork , 但因为只改了几个元素选择器,变化不大,所以还是提交了~~

8.移除了过时的 Jellyfin 兼容实现,未换用新设置弹框 UI 之前本身存在上述不完美地方,新 UI 中存在部分 emby 特有的由 ../web/modules/alameda/alameda.js 暴露至 window 全局对象中的 require 方法,故已无法兼容 Jellyfin,且有 @Izumiko 维护的更完美分支,
https://github.com/Izumiko/jellyfin-danmaku

~~9.使用篡改猴环境发现弹幕被砍头了,但 CustomCssJS 环境和服务端引入环境是没问题的,这个 bug 在 8 和 3 的修改前貌似就存在了,因后端对 css 不太在行,暂时不知道如何修复~~
![2a0e3fbe03a3e99468b1cab7036b4877](https://github.com/9channel/dd-danmaku/assets/42368856/7d26ab96-e4b5-43cf-b85f-cf418fe0e96f)

9.升级内置依赖的 1.3.6 版本之前的到最新的 2.0.6,解决弹幕行高显示 bug 出现被砍头现象,参考来源,
https://github.com/weizhenye/Danmaku/issues/29
,可关闭 [#61](https://github.com/9channel/dd-danmaku/issues/61)

10.兼容了魔改版客户端的 NativePlayer 播放形式,使用 initH5VideoAdapter 适配器转换至虚拟video标签行为和事件,此行为仅在非 web 客户端的非video标签播放形式下工作,其余与之前相同,
不确定能否关闭,https://github.com/9channel/dd-danmaku/issues/23

https://github.com/9channel/dd-danmaku/pull/60/commits/ab17598591ac228e9a7febd2839f4e9d2e14a6a6
https://github.com/9channel/dd-danmaku/pull/60/commits/8f278e0c0def1807a7f07b1ef67ac748506d0b80

10.1 更改了 5 中默认的相对路径依赖地址改为 jsdelivr 网络 CDN 地址,以实现该特性,假如长时间后该地址访问不佳,可将依赖文件放置在 emby 服务的 /system/dashboard-ui/ 下,变量地址填写前缀为 https://your-emby-domain/web/

10.2 更改了 getEmbyItemInfo 中默认的 pluginManager 为通用性更强的 playbackManager,原因为 pluginManager 众多第三方魔改版不统一,已知有 htmlvideoplayer, exoplayer, mpvvideoplayer... 所有 pluginPlayer 都要统一对接 playbackManager

~~10.3 已知 bug,小概率下记忆进度开始播放的,弹幕时间轴错乱,需要手动暂停再播放,Emby Theater 魔改版内置的 libmpv 没有实现跳转进度的标准事件通知,所以同样需要手动暂停再播放~~

10.4 此处记录下仅测试过的客户端类型,Emby Web 三种加载模式都通过,index.html 服务端引入或浏览器篡改猴拓展或CustomCssJS,Emby Theater 和 Emby for Android 仅测试了第三方客户端内置的 CustomCssJS,没问题,服务端版本为最新稳定版 4.8.8.0

~~10.5 已知 bug, Emby Theater 的 Electron 不支持 prompt 原生的对话框,所以手动搜索功能是废的,有其它合作者在进行修复中,Emby for Android 可以用 prompt 对话框就很离谱~~

10.5 已有合作者通过 embyDialog 修复实现,后续一些设置项可以新增到弹框中比较灵活
https://github.com/9channel/dd-danmaku/pull/60/commits/ea75168afd31ddde986f4b2c1b093fce7fccff9d

~~10.6 NativePlayer 下,存在一个性能问题,因 timeupdate 事件是每秒进行汇报同步,目前夏天导致带壳手机发热相比之前更大,可选优化空间感觉只有增大 video.currentTime 的同步赋值间隔,例如提供一个非 UI 更改的内部设置变量,currentTimeSyncInterval = 5000 来降低负载,但可能会导致弹幕时间轴与实际 NativePlayer 的差异变大,暂未对比测试~~

~~10.6 经过分析,拉长同步 video.currentTime 间隔并不能减少回调次数,反而会多出 if 逻辑判断增大负担,再次可选优化方向为妥协方案,仅在暂停播放后同步一次~~

10.6 为解决虚拟适配器下`播放进度`不够精确的问题,之前为秒级回调,导致了初始处弹幕存在闪现问题,且`播放倍率`无法同步,在 https://github.com/9channel/dd-danmaku/pull/60/commits/ce8bf6260a30af570e3007a199a5e24cceb185cd,
中通过本地定时器模拟补全秒级中空缺间隔的百毫秒级精度同步,经过分析,仅同步变量值不会带来明显性能增加,设备发热大端在客户端本身的视频解码上,故不用再纠结发热问题

11.交换了弹幕开关图标的顺序以更符合直觉

12.重命名原始功能过滤等级的描述以更贴合实际含义

13.新增弹幕基准速度调整,时间轴偏移秒数调整

14.重构抽取部分重复性代码,可关闭 https://github.com/9channel/dd-danmaku/issues/22
,这个在之前别人的 PR 中已经有,不过位于 develop 分支中,https://github.com/9channel/dd-danmaku/pull/47

15.在搜索图标点击后弹框中添加了当前弹幕信息展示以应对安卓环境的兼容

16.在弹框中添加了过滤弹幕类型选项['底部弹幕', '顶部弹幕', '从左至右', '彩色弹幕'],
可以关闭,https://github.com/9channel/dd-danmaku/issues/58

17.在弹框中添加了切换弹幕引擎设置['canvas', 'dom']

18.修复返回再播放的弹幕按钮消失 bug,
https://github.com/9channel/dd-danmaku/pull/60#issuecomment-2255005780

19.恢复 initUI 的延时处理,改为 setTimeout 一次性行为,~~移除了 initListener 方法,以解决 viewshow 监听会导致弹幕下载接口请求两次的 bug~~,
恢复 initListener 方法以修复新引发的播放界面切换集数没重载弹幕的 bug,注释初始化阶段的 loadDanmaku(LOAD_TYPE.INIT); ,全部由 initListener 进行触发,
目前减少为一次,添加 beforeDestroy 进行一些简单的事后清理工作

20.添加一个 embyToast 简单封装,为避免过度打扰用户,暂时只加了几处消息提醒,经测试,Emby Theater 和 Emby for Android 在  NativePlayer 播放器环境下不会显示此提醒,疑似被播放画面遮挡或魔改客户端禁用了 Toast 层,服务端的设备控制中的通知消息也是无法在 NativePlayer 播放页面中显示

21.添加一个剧集自动匹配失败转为使用原标题搜索弹幕的处理,并修复自动匹配失败报错导致的 VM 停止问题,出处:
https://github.com/Izumiko/jellyfin-danmaku/blob/jellyfin/ede.js#L886

22.添加弹幕高度比例调整,参考自 @Izumiko ,感谢

23.添加弹幕来源显示和过滤,添加两处作品图片信息

24.由合作者 @ykchenc 实现 feat: 添加屏蔽关键词过滤弹幕,https://github.com/9channel/dd-danmaku/pull/60/commits/ff357e3d98ed3ec1c430fe91c828fb804c850083
,目前为文本域输入可填关键词和正则,~~只支持过滤弹幕正文内容,~~
已支持过滤`弹幕正文`,`来源cid`,`来源平台`,`来源平台用户id`,
根据 https://github.com/9channel/dd-danmaku/issues/13 ,可选优化方向为 HTTP 方式的文本内容下载和上传,不太建议文件方式导入屏蔽列表,可能存在 Emby Theater 或 TV 客户端弹不出文件选取框的问题,故优先考虑 HTTP 方式存取来实现比较合适

24.1 测试发现弹弹Play平台或源弹幕平台存在一个云端过滤的行为,但是存在一定时间的延迟,例如 B站 刚更新的有 6K+ 弹幕,但是其中 2K+ 甚至更多为开始和结尾的打卡重复弹幕,此时会遮盖所有显示画面,需手动结合屏蔽设置,第二天就只剩下 1700 多条了,可酌情手动关闭部分屏蔽设置

24.2 屏蔽关键词添加一个特定单行注释的兼容,必须以`双斜杠和一个空格开头`,例如: `// 以下按用户id过滤`

25.添加简单弹幕列表展示,添加简版设置手动备份(复制/粘贴 JSON 文本)

26.New UI 添加 AppLogAspect 展示控制台日志,包含 emby 自身打印的日志 + 脚本打印的日志 + 未捕获处理的 error,
起始切点位于播放页面开始,离开播放页销毁切面,即清空了日志,因日志文本太长,故不做持久化处理,仅供调试信息使用,调用 window.ede.appLogAspect.on 日志变更监听回调的,禁止在回调中使用原始的 `console.log` 和 `console.error` 再次打印日志,因切面重写了这两个方法,回调中使用会`死循环`,回调中会检测这种并抛出异常,正确打印方式为调用 `window.ede.appLogAspect.originalLog` 和 `window.ede.appLogAspect.originalError`

27.关于 tab 中添加几个简单的调试选项,这类选项不重要,所以不做持久化增添复杂度了,调整完弹幕容器大小,切换 tab 后发现显示`按钮容器边界`重回未勾选状态属于正常行为,重新开关即可

New UI Web 端示意图:
![image](https://github.com/user-attachments/assets/b9d875b1-9d37-4188-8939-319c1336848a)
![image](https://github.com/user-attachments/assets/64fd5108-ba88-4611-bdea-3de0de83627c)
![image](https://github.com/user-attachments/assets/4c133f68-4fd5-4fa0-9153-9cb8f60b7c9f)
![image](https://github.com/user-attachments/assets/d0a8a516-7cbc-4ffe-b03d-bfca788e1730)

