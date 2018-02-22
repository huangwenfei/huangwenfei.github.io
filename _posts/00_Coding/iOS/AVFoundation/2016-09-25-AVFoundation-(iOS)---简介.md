---
layout: post
title:  "AVFoundation 简介"
toc: true
date:   2016-09-25 19:01
cover: "assets/images/maincontent/post/cover.jpg"
box_cover: "blogs/coding/iOS/AVFoundation/images/AVFoundation-(iOS)---简介/00 组成结构.png" # 文章的第一张图片
vfpage_collection_tags: AVFoundation
tags: AVFoundation iOS
categories: Coding iOS AVFoundation
---

### AVFoundation  学习资源列表

link:http://www.jianshu.com/p/1c51f93d54be

---

> `^ - ^` 文章内容： <br />
一、它能干嘛。 <br />
二、它里面由什么组成。 <br />
三、AVFoundation。 <br />

---

### 一、它能干嘛

官方:

1、Record, edit, and play **audio(A)**  and **video(V)**.
【录制、编辑、播放**音频**和**视频**；注，也可以拍摄图片】

2、AVFoundation is one of  **several frameworks** that you can use to play and create** time-based** audiovisual media. 
【AVFoundation 是可以播放和创建**基于时间**的视听媒体**框架集**】

结论：

AVFoundation 是针对音频和视频的处理框架集；

1、音频：录制（创建）/编辑/播放;

2、视频：录制（创建）/编辑/播放;

3、图片：拍摄（创建）;

> 注：（个人见解，不讲格式等等）视频，本质是没有声音的有序图片集】

---

### 二、它里面由什么组成

官方：（AVFoundation Programming Guide）

Link:https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/AVFoundationPG/Articles/00_Introduction.html#//apple_ref/doc/uid/TP40010188-CH1-SW3

![组成结构][img-00]
解释：

1)、先看**中间灰色圆点虚线**上层是视图层（View）的封装，简言之就是可以直接当平时用 UIKit 一样使用 AVKit；下层是真正的 AV Fonudation 底层内容，主要的学习时间都在这里；

2)、AV Fonudation 右上角有个 Audio-only classes ，它里面有很多专门处理声音的 API 知道就好了；

3)、Core Audio （以下内容，现在了解一下就可以了）

link:https://developer.apple.com/library/content/documentation/MusicAudio/Conceptual/CoreAudioOverview/Introduction/Introduction.html

![][img-01]

link:https://developer.apple.com/reference/coreaudio?language=objc

![][img-02]

4)、Core Media  

核心是学习 CMTime/CMTimeRange ，AVFoundation 是基于时间的框架，那么学习时间的处理，当然非常重要。

【它们都是一些结构体，苹果专门为了时间的处理而做的处理，以后开发中关于时间的操作都是通过这两个结构体来完成】

> 注：时间处理为什么重要，视频是以 **帧** 为单位的，**一帧就是一张图片**，25帧每秒（25/s），就是一秒内播放连续的25张图片，就是一秒的视频；那么那怕消失了一帧，对于视频而言是可怕的】

link：https://developer.apple.com/reference/coremedia?language=objc

![][img-03]

5)、Core Animation 很重要，内容的渲染者（显示）

Core Audio / Core Media 并没有提供可以显示内容的类，Core Animation 里面有 CALayer （注：1.The CALayer class manages **image-based** content and allows you to perform animations on that content. ） 可以用于图片的内容显示。当然还有更多的功能，也集中在这里。

 link:https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/CoreAnimation_guide/Introduction/Introduction.html

![][img-04]

【OpenGL 是进于图片方面的开源库， ES 是移动设备版， 进阶的时候绝对要学的;

link:https://developer.apple.com/library/content/documentation/3DDrawing/Conceptual/OpenGLES_ProgrammingGuide/Introduction/Introduction.html

![][img-05]

**【进阶的时候才会深入学习 Core Animation 所以不用太紧张，现在不用太在意它】**

---

### 三、AVFoundation

学习路径 （ ~> - ~  贵在坚持  ~ - <~）

   - 了解 （看上面两大点）;

   - 学习上层 AVKit 的使用;

   - 学习下层 AVFoundation 内容;

   - 深入学习 Core Animation / Metal / OpenGL ES / OpenCV ;


[img-00]:{{ "blogs/coding/iOS/AVFoundation/images/AVFoundation-(iOS)---简介/00 组成结构.png" | relative_url }}     
[img-01]:{{ "blogs/coding/iOS/AVFoundation/images/AVFoundation-(iOS)---简介/01 Core Audio.png" | relative_url }}  
[img-02]:{{ "blogs/coding/iOS/AVFoundation/images/AVFoundation-(iOS)---简介/02 Core Audio APIs.png" | relative_url }}  
[img-03]:{{ "blogs/coding/iOS/AVFoundation/images/AVFoundation-(iOS)---简介/03 Core Media Apis.png" | relative_url }}
[img-04]:{{ "blogs/coding/iOS/AVFoundation/images/AVFoundation-(iOS)---简介/04 Core Animation Programming Guide.png" | relative_url }}    
[img-05]:{{ "blogs/coding/iOS/AVFoundation/images/AVFoundation-(iOS)---简介/05 OpenGL ES.png" | relative_url }}  
