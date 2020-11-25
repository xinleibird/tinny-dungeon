<p align="center">
  <a href="https://github.com/xinleibird/tinny-dungeon">
    <img width="256" src="https://raw.githubusercontent.com/xinleibird/tinny-dungeon/master/images/title.gif">
  </a>
</p>

<div align="center">
  <h1>Tinny Dungeon</h1>
  <h3>基于 PixiJS 的 rogue-like 游戏</h3>
  <h4>A rogue-like game based PixiJS</h3>
  <br>
  <br>
  <h3><a href="https://xinleibird.github.io/tinny-dungeon/">Online Demo</a></h3>
</div>

<br>
<br>
<br>

## 🎮 操作方法

- 键盘 <kbd>w</kbd> <kbd>a</kbd> <kbd>s</kbd> <kbd>d</kbd> 或者滑动屏幕移动。
- <kbd>space</kbd> <kbd>enter</kbd> 或者点击屏幕拾取。
  <br>
  <br>

## 📱 像原生 app 一样运行

<img width="192" src="https://raw.githubusercontent.com/xinleibird/tinny-dungeon/master/images/IMG_0232.jpg">
<img width="192" src="https://raw.githubusercontent.com/xinleibird/tinny-dungeon/master/images/IMG_0233.jpg">
<img width="192" src="https://raw.githubusercontent.com/xinleibird/tinny-dungeon/master/images/IMG_0234.jpg">
<img width="192" src="https://raw.githubusercontent.com/xinleibird/tinny-dungeon/master/images/IMG_0235.jpg">

<br>
<br>

## 👑 PixiJS

- [PixiJS][pixi] 用来制作精灵动画为基础的 2D 游戏确实非常方便，而且效率一流！测试中在做了 culling 的情况下，5000 个左右的 tile 在桌面端使用核显的情况下可维持 144 帧 (performance 性能帧，pixi 的实际渲染上限是 60 帧)。在移动端可维持在 60 帧。运行中不波动或者仅轻微波动。 WebGL 自然是好，但是如果没有 pixi 这样的基础设施，那开发难度不是个人或者小型机构可以承受的。赞美归于 [PixiJS][pixi]！

<br>
<br>

## 👑 算法基础设施

- 游戏中用到的迷宫构造算法、视线遮罩算法、寻路算法、伪随机数生成等等好用的基础工具，来自于 [rot-js][rotjs]，特别感谢！

<br>
<br>

## 🏛 版权声明

- 项目中的**知识创作内容**（包含但不仅限于可编译为二进制资源的 ts、js 源码或 html、css 等静态资源），遵循 MIT 协议，你**可以自由的修改分发**。
- 项目中的图片等**艺术创作内容**（包含但不仅限于 png 资源），遵循 [CC BY-NC 4.0][cc] 协议，使用请为我署名并且**不得用于商业内容**。
- 项目中的 autotile 算法，来自于 [node-autotile][autotile]，我觉得丑了点修改了一下，抱歉。其协议为 BSD-2-Clause。
- 项目中使用了 [Click Font][click]，其协议为 CC 0。
- 项目中使用了 [Covenant5x5][covenant]，其协议为 CC BY 4.0。
- 项目中使用了 [musmus][musmus] 的 BGM ’かぼちゃ騎士団の行進‘，'ヒーローズ'，'軋み'，其协议见 https://musmus.main.jp/info.html。
- 项目中使用了 [Juhani Junkala][junkala] 的效果音合集 'The Essential Retro Video Game Sound Effects Collection [512 sounds]'，他的协议是 CC 0。
- 创作 tile sprite 用的是 Aseprite。与 node-autotile 配合的图片分割脚本来自 [GMS2-Autotile-Converter][gms2-autotile-converter]，是 MIT 协议，但是他的脚本是为 GameMaker Studio 2 制作的。 配合 node-autotile 的方式，我 [fork 了一份][fork] 并修改了图片分割顺序，你应该使用修改的版本。推荐你给原作者一个 star。
- 其他未提及的 npm 包遵循由 npm 组织声明的 Artistic License。

<br>
<br>

## 🎨 关于作者

| <div style="display: inline-block; width: 120px" >![avater][1]</div> | JavaScript / HTML / CSS / SCSS / Node.js / React / TypeScript / webpack / Linux / Java / UI Design / Web Design ... |
| :------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------: |
|                        **辛 磊<br />Xin Lei**                        |                          `{ age: 39, background: 'Front-End Programmer', gender: 'male' }`                          |

<br>
<br>

## 📧 联系作者

xinleibird@gmail.com

[pixi]: https://www.pixijs.com/
[rotjs]: https://ondras.github.io/rot.js/hp/
[click]: https://opengameart.org/content/click-pixel-font
[covenant]: https://heraldod.itch.io/bitmap-fonts
[autotile]: https://github.com/tlhunter/node-autotile
[gms2-autotile-converter]: https://github.com/null-sharp/GMS2-Autotile-Converter
[fork]: https://github.com/xinleibird/GMS2-Autotile-Converter
[musmus]: http://musmus.main.jp
[junkala]: https://www.youtube.com/watch?v=dbACpSy9FWY
[cc]: https://creativecommons.org/licenses/by-nc/4.0/
[1]: https://raw.githubusercontent.com/xinleibird/bird-ui/master/public/avatar.png
