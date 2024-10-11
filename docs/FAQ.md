#### 1.为何新版 Emby 客户端的 index.html 引入失效了?

记录下最新官方安卓 app 的重大变更,`emby-android-google-arm64-v8a-release-3.4.20.apk`开始貌似修改`index.html`方式失效了,区别在于之前的版本客户端是不会请求`Emby 服务端`的任何代码上的静态资源,如`html` `js` , 除服务端的自定义 Css 以外的任何`css`文件,官方为了分担服务端压力,之前除`Web`端以外的任何客户端都是安装包中内置了前端代码,而目前客户端版本,服务端竟然发现也有来自安卓客户端的`index.html`请求,我的 emby 加了 nginx 反代,access.log 如下

```js
192.168.31.1 - - [25/Aug/2024:02:35:10 +0800] "GET /emby/system/info/public?format=json HTTP/2.0" 200 127 "-" "okhttp/4.11.0" "-"
192.168.31.1 - - [25/Aug/2024:02:35:10 +0800] "GET /emby/Sync/Items/Ready?TargetId=71c169d19a95c29b HTTP/2.0" 200 2 "-" "okhttp/4.11.0" "-"
192.168.31.1 - - [25/Aug/2024:02:35:10 +0800] "POST /emby/Sync/data HTTP/2.0" 200 22 "-" "okhttp/4.11.0" "-"
192.168.31.1 - - [25/Aug/2024:02:35:11 +0800] "GET /emby/system/info/public HTTP/2.0" 200 127 "-" "Mozilla/5.0 (Linux; Android 14; 2311DRK48C Build/UP1A.230905.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36" "-"
192.168.31.1 - - [25/Aug/2024:02:35:11 +0800] "GET /emby/web/manifest.json HTTP/2.0" 200 341 "-" "Mozilla/5.0 (Linux; Android 14; 2311DRK48C Build/UP1A.230905.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36" "-"
192.168.31.1 - - [25/Aug/2024:02:35:11 +0800] "GET /emby/web/strings/en-US.json HTTP/2.0" 200 15989 "-" "Mozilla/5.0 (Linux; Android 14; 2311DRK48C Build/UP1A.230905.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36" "-"
192.168.31.1 - - [25/Aug/2024:02:35:11 +0800] "GET /emby/web/index.html HTTP/2.0" 200 3542 "-" "Mozilla/5.0 (Linux; Android 14; 2311DRK48C Build/UP1A.230905.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36" "-"
192.168.31.1 - - [25/Aug/2024:02:35:11 +0800] "GET /emby/System/Info?api_key=xxx HTTP/2.0" 200 787 "-" "Mozilla/5.0 (Linux; Android 14; 2311DRK48C Build/UP1A.230905.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36" "-"
192.168.31.1 - - [25/Aug/2024:02:35:11 +0800] "GET /emby/DisplayPreferences/usersettings?userId=ac0d220d548f43bbb73cf9b44b2ddf0e&client=emby&X-Emby-Client=Emby+for+Android&X-Emby-Device-Name=2311DRK48C&X-Emby-Device-Id=71c169d19a95c29b&X-Emby-Client-Version=3.4.20&X-Emby-Token=xxx&X-Emby-Language=zh-cn HTTP/2.0" 200 1126 "-" "Mozilla/5.0 (Linux; Android 14; 2311DRK48C Build/UP1A.230905.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36" "-"
```

根据此日志,可能会认为需要修改服务端`index.html`,但是实测结果为,同时修改了安卓客户端和服务端的`index.html`均无用,
这里猜测可能是`index.html`中原本的`<script src="apploader.js" defer></script>`行为发生了变化,在之前的版本中如果我没记错的话,这一行是动态渲染内容,加载时会替换为一大堆的`html`标签,从而覆盖掉了自定义添加的代码,时间有些久远了,不确实是覆盖之前还是之后的来着,反正目前通过实测结果,前后都没用,

```js
...
    <script src="apploader.js" defer></script>
    <script src="https://cdn.jsdelivr.net/gh/chen3861229/dd-danmaku@new-ui/ede.js" defer></script>
</body>
```
```js
...
    <script src="https://cdn.jsdelivr.net/gh/chen3861229/dd-danmaku@new-ui/ede.js" defer></script>
    <script src="apploader.js" defer></script>
</body>
```

因首先测试过了,[CustomCssJS](https://github.com/Shurelol/Emby.CustomCssJS) 加载的方式是没问题的,偷个小懒,暂时不研究原始的这种方式引入了,因为感觉引入此用户脚本加载器更加优雅和易用

这里分享下修改版的文件,

1.官方原版,`3.4.20`
https://github.com/MediaBrowser/Emby.Releases/raw/master/android/emby-android-google-arm64-v8a-release.apk

2.[OneDrive](https://1drv.ms/f/s!Av7h6c_xLEsg0ogfmU2UsZUZa59uvQ?e=l9UP7R),基于官方原版的[CustomCssJS](https://github.com/Shurelol/Emby.CustomCssJS) 集成,解包修改自签名:`emby-android-google-arm64-v8a-release-3.4.20-CustomCssJSv23.6.14-MTself-sign.apk`,解包修改未签名: `emby-android-google-arm64-v8a-release-3.4.20-CustomCssJSv23.6.14-unsigned.apk`

3.基于官方原版的仅添加,如上说明,这个版本无法使用
```js
...
    <script src="apploader.js" defer></script>
    <script src="https://cdn.jsdelivr.net/gh/chen3861229/dd-danmaku@new-ui/ede.js" defer></script>
</body>
```
`emby-android-google-arm64-v8a-release-3.4.20-emby-danmaku-MTself-sign.apk`, `emby-android-google-arm64-v8a-release-3.4.20-emby-danmaku-unsigned.apk`

4.未签名版是无法安装的,仅供`MT管理器`自签名后分享无法安装使用的这种可能,然后自己用未签名版本想办法自签名安装到自己的设备中

这里再记录下解包和打包命令,解包中的`-s`跳过了`DEX`的处理,会快很多,因为本次用不着修改这部分源代码
```
java -jar -Duser.language=zh_cn -Dfile.encoding=UTF-8 apktool_2.9.3.jar d -s c:\Users\XXX\Downloads\Compressed\emby-android-google-arm64-v8a-release-3.4.20.apk
```
```
java -jar -Duser.language=zh_cn -Dfile.encoding=UTF-8 apktool_2.9.3.jar b c:\Users\XXX\Downloads\Compressed\emby-android-google-arm64-v8a-release-3.4.20 -o emby-android-google-arm64-v8a-release-3.4.20-unsigned.apk
```

`3.4.20` 与老版本一些 NewUI 的小差异截图,因为弹窗`dialog`用的 emby 的样式,所以形式具体取决于客户端版本了
![IMG_20240825_040505](https://github.com/user-attachments/assets/132be6b9-e9bc-42f7-bb4a-738d9c44dd27)

![Screenshot_2024-08-25-03-43-51-654_com mb android](https://github.com/user-attachments/assets/f38003b7-0bca-4b7a-adc6-a71d45f84afb)

![Screenshot_2024-08-25-03-44-08-805_com mb android](https://github.com/user-attachments/assets/bd299bb2-6dc8-430d-b30f-f89f66cd5c86)

![Screenshot_2024-08-25-03-44-43-855_com mb android](https://github.com/user-attachments/assets/a578aedf-9f34-47da-9811-ad5cb8c03761)

![Screenshot_2024-08-25-03-45-06-515_com mb android](https://github.com/user-attachments/assets/12d158fb-f283-4f44-affe-efabeff7c5fb)