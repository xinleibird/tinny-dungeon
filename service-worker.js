if(!self.define){const s=s=>{"require"!==s&&(s+=".js");let e=Promise.resolve();return a[s]||(e=new Promise(async e=>{if("document"in self){const a=document.createElement("script");a.src=s,document.head.appendChild(a),a.onload=e}else importScripts(s),e()})),e.then(()=>{if(!a[s])throw new Error(`Module ${s} didn’t register its module`);return a[s]})},e=(e,a)=>{Promise.all(e.map(s)).then(s=>a(1===s.length?s[0]:s))},a={require:Promise.resolve(e)};self.define=(e,i,r)=>{a[e]||(a[e]=Promise.resolve().then(()=>{let a={};const f={uri:location.origin+e.slice(1)};return Promise.all(i.map(e=>{switch(e){case"exports":return a;case"module":return f;default:return s(e)}})).then(s=>{const e=r(...s);return a.default||(a.default=e),a})}))}}define("./service-worker.js",["./workbox-d9851aed"],(function(s){"use strict";s.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"android-chrome-192x192.png",revision:"1d0916bbb96b3d72eeb645d4ce0a087f"},{url:"android-chrome-512x512.png",revision:"2ea34a835935153a8ac4b0084232098c"},{url:"apple-touch-icon.png",revision:"71d57f5136661c447d16dd4bd4155645"},{url:"assets/fonts/Covenant5x5.fnt",revision:"3400477e158ad1c397e3828fcb6b2c0a"},{url:"assets/fonts/Covenant5x5_0.png",revision:"1f636291b6ef0e4386a6f74619110afb"},{url:"assets/fonts/Pixel.fnt",revision:"cc8a35a49466782b980ee04985dc802e"},{url:"assets/fonts/Pixel_0.png",revision:"3e9d9dc721a6f9019549d5e445728684"},{url:"assets/fonts/click.fnt",revision:"06398be5b021bc44bd975b5dc3f37fe5"},{url:"assets/fonts/click_0.png",revision:"ee369d39804db2c605e8c5ce35cbe603"},{url:"assets/sounds/effects/MusMus-BGM-111.mp3",revision:"27d5b8af694e23088e40803fe812fe93"},{url:"assets/sounds/effects/punctuation.mp3",revision:"105e209ab4db1973fd201b6f846878cd"},{url:"assets/sounds/effects/sfx_coin_double3.wav",revision:"8f4c33fab1e490c5c8c9bfda49100024"},{url:"assets/sounds/effects/sfx_damage_hit1.wav",revision:"166bc899e4d4e3b50d0b30afa108027f"},{url:"assets/sounds/effects/sfx_damage_hit9.wav",revision:"e56a8f290bb82d7ce963a412aef41b3e"},{url:"assets/sounds/effects/sfx_exp_odd7.wav",revision:"ba389c89240e9d77be1588154034ff5a"},{url:"assets/sounds/effects/sfx_movement_dooropen2.wav",revision:"eee9c01e45f17ee869d4567947cb6ca6"},{url:"assets/sounds/effects/sfx_movement_footsteps1a.wav",revision:"2a8021ac65714483c80a28442350d7d9"},{url:"assets/sounds/effects/sfx_movement_footstepsloop3_fast.wav",revision:"d29a8ed2a937db5c691633f54405bfbc"},{url:"assets/sounds/effects/sfx_movement_stairs1loop.wav",revision:"df3d05147381986185a2f7a4bd3b3aaa"},{url:"assets/sounds/effects/sfx_sounds_impact9.wav",revision:"c2c8b21d99c527c68f40893d07050ea4"},{url:"assets/sounds/effects/sfx_sounds_powerup8.wav",revision:"0a9348bba27473d8aebc2308109e2da6"},{url:"assets/sounds/effects/sfx_wpn_dagger.wav",revision:"3e5e1df47f7c087bf7d81b264b1f6ad8"},{url:"assets/sounds/effects/sfx_wpn_punch1.wav",revision:"e61bc65a3c52da5d94cbb86b03bc4178"},{url:"assets/sounds/effects/sfx_wpn_sword1.wav",revision:"fde5d94931f67c11591371ac8aed2a93"},{url:"assets/sounds/effects/sfx_wpn_sword3.wav",revision:"661d05812b7054ce668f25ca153ff277"},{url:"assets/sounds/musics/MusMus-BGM-070.mp3",revision:"d5a9be2675be27fe1f76e6a64e752218"},{url:"assets/sounds/musics/MusMus-BGM-076.mp3",revision:"431e558bda9f9639d2b949c4183fad47"},{url:"assets/sprites/avatar.png",revision:"b9a6ca956a066852e2fdb1c5e9c53d37"},{url:"assets/sprites/bat.json",revision:"7441159a1665557b85e2e534f732f8b0"},{url:"assets/sprites/bat.png",revision:"6da7122a00a1a014620fd8f77985c969"},{url:"assets/sprites/knight_m.json",revision:"7482f64c706ad972745b1c66e8c49c2c"},{url:"assets/sprites/knight_m.png",revision:"dce10782a5377c6a6aa38e2e840af204"},{url:"assets/sprites/skeleton.json",revision:"0f1c4b3f8711fa4d738afbad6b41b548"},{url:"assets/sprites/skeleton.png",revision:"261e188473b2cf9a9305e650351ce3a9"},{url:"assets/sprites/title.json",revision:"f7e9dc056676c2d7e9464782c730d2b6"},{url:"assets/sprites/title.png",revision:"6a911a395060fea5e18bc16d715d7611"},{url:"assets/tiles/attachments.json",revision:"20eb458c14533e19ca7d4156f6569d50"},{url:"assets/tiles/attachments.png",revision:"af9decf8e36542abfd261e715e98af7a"},{url:"assets/tiles/doors.json",revision:"f2dec7e1362f60f8e4374dcfbe5742bd"},{url:"assets/tiles/doors.png",revision:"da31557b5c5e217dac8cc47be88b1460"},{url:"assets/tiles/floor_decorators.json",revision:"2fe3cae5a904f854de84ed6d6783b735"},{url:"assets/tiles/floor_decorators.png",revision:"51d96cf0352cc0212845d4bf4979114a"},{url:"assets/tiles/lighting_mask.json",revision:"d6671456acf3d783954ef95be614f462"},{url:"assets/tiles/lighting_mask.png",revision:"cf2af6089a2e61e4cc7bfa4da5d90061"},{url:"assets/tiles/stairs.json",revision:"37ae37d2e70db63ca82a37ced7a04448"},{url:"assets/tiles/stairs.png",revision:"287bf8e5cdcb483a5b2b7b377f6bb8ef"},{url:"assets/tiles/tileset.json",revision:"5a9afcdcef4d87c2a622ffd21aa8e45f"},{url:"assets/tiles/tileset.png",revision:"9ee53e4a14b1bd98a180733eac32558a"},{url:"assets/tiles/ui.json",revision:"b9b7800264a5062701252ef891c88916"},{url:"assets/tiles/ui.png",revision:"bb65b529a476dfd20a9d94a4247fd75c"},{url:"favicon-16x16.png",revision:"a75b59f9770bd2b6156d22a4f49cd1a3"},{url:"favicon-32x32.png",revision:"f47853ef3fd2a2b42b5a451f2457366d"},{url:"favicon.ico",revision:"6f0d34fb9642f1736e0f393e539a5820"},{url:"index.html",revision:"9ae4c54c490571530101bab71491f769"},{url:"mainea6cc23def43d5f09a41.bundle.js",revision:"64dc22ac5d1c86721256a9d2087f07d8"},{url:"manifest.json",revision:"3b5cf45f50385bb8e7e83352d5661b71"}],{})}));
//# sourceMappingURL=service-worker.js.map
