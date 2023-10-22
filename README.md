# XOR-MC-Archive-Decrypt
扩展章鱼电阻(eXtra Octopus Resistor, XOR in short)我的世界存档加密解密工具  
针对我的世界网易版地图加密机制开发的一款基于NodeJS的辅助工具
## 特性
+ 易于使用: 只需一个NodeJS运行环境，即可实现一键地图加解密操作
+ 可塑性强: 支持使用自定义密钥进行加解密
+ 可靠性高: 地图完整性检测、解密尝试后合理性检测，发现问题立即提示

## 功能列表
- 被动解密: 使用网易自身的密钥进行解密操作
- 被动加密: 使用网易自身的密钥进行加密操作
- 主动解密: 自定义密钥进行解密，抑或是自适应密钥
- 主动加密: 自定义密钥进行加密(敬请期待

## 使用方法
### 被动解密
切换至程序根目录，使用node运行main.js.  
```
$ node ./main.js
```
输入要解密的存档的level.dat所在的文件夹路径，如level.dat位于/sdcard/aaa/level.dat，那么输入  
```
/sdcard/aaa
```
等待完整性检测通过后，指定操作类型(当前版本仅支持被动解密)  
最后等待解密完成，程序会输出解密存档存放目录
