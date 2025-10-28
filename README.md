# emby-danmaku

## Emby danmaku extension
![截图](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/newui01.png)

## 安装

任选以下一种方式安装即可

### 一.浏览器插件(不太推荐,作用范围太窄,仅做调试使用)

1. [Tampermonkey](https://www.tampermonkey.net/)
2. [添加脚本](https://greasyfork.org/zh-CN/scripts/512140-emby-danmaku-extension)

### 二.修改服务端(依旧不太推荐,比浏览器插件稍微广一点,但不做用于非 Web 客户端,仅做调试使用)

修改文件 /system/dashboard-ui/index.html (Docker版,其他类似),在`</body>`前添加如下标签,多选一

1. 直接下载`ede.js`到 index.html 同级目录下,优先使用本地文件较为稳定
```js
// <script src="ede.js" charset="utf-8" defer></script>
<script src="ede.js" charset="utf-8"></script>
```

2. 使用 jsdelivr CDN 网络地址
```js
// <script src="https://cdn.jsdelivr.net/gh/chen3861229/dd-danmaku@gh-pages/ede.user.js" charset="utf-8" defer></script>
<script src="https://cdn.jsdelivr.net/gh/chen3861229/dd-danmaku@gh-pages/ede.user.js" charset="utf-8"></script>
```
或
```js
// <script src="https://cdn.jsdelivr.net/gh/chen3861229/dd-danmaku@gh-pages/ede.min.js" charset="utf-8" defer></script>
<script src="https://cdn.jsdelivr.net/gh/chen3861229/dd-danmaku@gh-pages/ede.min.js" charset="utf-8"></script>
```

3. 不建议再使用`Cloudflare Pages`托管的`js`文件,被强制隐去了`Content-Length`响应头会导致客户端开屏闪退
~~3. 使用 Cloudflare Pages 网络地址,等同 main 分支,中国移动网络此 cf 地址~~

该方式安装与浏览器插件安装**可同时使用不冲突**

### 三.修改客户端(可能不太推荐,虽做用于非 Web 客户端,但修改错误将导致卡 logo,且客户端版本不同,可能会有兼容性问题)

#### 为什么需要修改客户端?

因为 Emby 除了 Web 端是从服务端加载的前端界面,其余所有端都是使用的客户端本地代码文件,因此需要修改客户端才能使用本插件,
**[注意](./docs/FAQ.md#1为何新版-emby-客户端的-indexhtml-引入失效了)**

1. 类似服务端方式,安卓解包后修改`/assets/www/index.html`再重新打包即可,
具体细节请 Google 解决,对客户端不是太熟,这里仅提供一个简单参考,
windows 下载 JDK 可使用[Apktool](https://apktool.org) 进行解包和打包,
建议打包名加上 **-unsigned** 后缀标明为未签名版本,传到手机中使用 **MT管理器**
进行一键默认自签名,然后安装即可,若出现安装包解析失败或 PackageInfo is null 的自行 Google 解决

2. IOS 需要通过类似 AltStore 方式自签,请自行 Google 解决,这里也提供一个简单参考,访问[decrypt.day](https://decrypt.day/)这样的第三方 IPA 下载网站,下载离线安装包得到`com.emby.mobile_xxx.ipa`,直接使用`7zip`等解压软件解压,修改`/Payload/Emby.app/www/index.html`文件,**重点注意删除原安装包的签名文件**,`PlugIns`,`SC_Info`,否则使用`爱思助手自签`将报错`AppexBundleIdNotPrefixed`无法安装,然后将`Payload`压缩为`zip`文件,手动改后缀为`ipa`,使用`爱思助手自签`并手动安装即可,**注意自签包只能在绑定的设备上安装**

[FAQ](docs/FAQ.md)

#### 哪些客户端可以修改?

1. 只有 Emby for Android, Emby for iOS, Emby Theater(Windows and MacOS), Emby UWP 这几个官方客户端存在 Web 环境才可以修改

2. 老 TV 客户端 Emby for Android TV_XXXg 以版本号以 g 结尾的无法修改,是原生 Kotlin 代码,不存在 web 环境,包括其他第三方播放器客户端更加没办法修改了

### 四.使用第三方用户脚本加载器(推荐)

优点为属于 emby 插件,也可添加其它类型脚本并快捷管理,但同样需要服务端与客户端配合使用[CustomCssJS](https://github.com/Shurelol/Emby.CustomCssJS),服务端改一次,客户端修改集成可手动参考三,不想自己改的可直接使用第三方魔改增强版已内置 **CustomCssJS** 集成的即可,缺点为无 iOS 端的已修改版,注意**Emby UWP**暂不兼容

## 界面

**请注意Readme上方截图可能与最新版存在差异,请以实际版本与说明为准**

播放界面进度条下方新增如下按钮,若按钮透明度与"暂停"等其他原始按钮存在差异,说明插件正在进行加载

- 弹幕开关: 切换弹幕显示/隐藏状态

- 弹幕设置: 打开弹幕设置弹窗
    * 弹幕设置: 弹幕开关、简繁转换、弹幕引擎、弹幕样式（大小|透明度|速度|粗细|斜体|轴偏秒）、配置项
    * 手动匹配: 输入影视名称匹配弹幕，默认影视名称，可选择切换原标题
    * 弹幕信息: 当前匹配弹幕信息与弹幕列表
    * 弹幕屏蔽: 屏蔽类型、屏蔽来源平台、显示每条来源、密度等级、高度比例、屏蔽关键词
    * 关于: 控制台日志、开发者选项
        
        **密度等级越高强度越大，除0级外均带有每3秒6条的垂直方向弹幕密度限制,高于该限制密度的顶部/底部弹幕将会被转为普通弹幕*

## 效果预览

### Windows 端

![截图](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/newui02.png)
![截图](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/newui03.png)
![截图](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/newui04.png)
![截图](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/newui05.png)
![截图](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/newui06.png)

### Android 端

<details>
<summary>截图</summary>

`3.4.20` 与老版本一些 NewUI 的小差异截图,因为弹窗`dialog`用的`Emby`的样式,所以形式具体取决于客户端版本了

![](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/android-01.jpg)

![](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/android-02.jpg)

![](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/android-03.jpg)

![](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/android-04.jpg)

![](https://raw.githubusercontent.com/chen3861229/dd-danmaku/main/img/android-05.jpg)

</details>

### IOS 端,Mac,Windows,Web,基本一样,这里就不截图了

## 弹幕

弹幕来源为 [弹弹 play](https://www.dandanplay.com/) ,已开启弹幕聚合(A/B/C/... 站等网站弹幕聚合)

## 数据

匹配完成后对应关系会保存在**浏览器(或客户端)本地存储**中,后续播放(包括同季的其他集)会优先按照保存的匹配记录载入弹幕

## 常见弹幕加载错误/失败原因

1. 译名导致的异常: 如『よふかしのうた』 Emby 识别为《彻夜之歌》后因为弹弹 play 中为《夜曲》导致无法匹配
2. 存在多季/剧场版/OVA 等导致的异常: 如『OVERLORD』第四季若使用S[N]格式归档(如 OVERLORD/S4E1.mkv 或 OVERLORD/S4/E1.mkv),可能出现匹配失败/错误等现象
3. 其他加载BUG: ~~鉴定为后端程序猿不会前端还要硬写JS~~,有BUG麻烦 [开个issue](https://github.com/chen3861229/dd-danmaku/issues/new/choose) THX
4. NewUI 以来的一些更改和注意事项, [CHANGLOG](docs/CHANGLOG.md) 或 [PR#60](https://github.com/9channel/dd-danmaku/pull/60)

**首次播放时请检查当前弹幕信息是否正确匹配,若匹配错误请尝试手动匹配**
