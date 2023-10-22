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
### 被动系列
切换至程序根目录，使用node运行main.js.  
```
$ node ./main.js
```
输入要解密的存档的level.dat所在的文件夹路径，如level.dat位于/sdcard/aaa/level.dat，那么输入  
```
/sdcard/aaa
```
等待完整性检测通过后，指定操作类型  
最后等待解密完成，程序会输出解密存档存放目录
### 主动系列
资源中心地图使用此选项最佳  
初始操作同上  
指定操作类型后输入密钥，密钥限制为64bit  
若留空则程序会根据LevelDB数据库文件结构自行尝试推导密钥  
最后等待解密完成，程序会输出解密存档存放目录
## 可能的报错情况
- 出现错误：message  
为程序try-catch捕获的非常规报错，需根据具体情况查看message. 一般情况是程序运行时bug导致，可在issues中反馈
- 找到已加密文件  
程序在目录中找到了已加密文件，并认定该文件夹为已加密，不再次进行加密
- 完整性测试未通过  
待操作文件夹缺失了MCBE存档的关键文件(level.dat, db/MANIFEST-*, db/CURRENT, 甚至是缺失整个db文件夹), 一般为输入了错误的目录导致
- 魔数不对应  
大部分情况为密钥不正确导致的，若使用被动解密可切换为主动后再试. 若主动解密后报此错误则一般为存档损坏. 需要注意的是，该报错不能涵盖所有存档损坏的情况，可能存在.ldb的DataBlock损坏而未对Footer造成影响的情况，具体情况需使用国际版游戏查看能否进入解密后存档与进入后是否出现数据丢失判断. 
