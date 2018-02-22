---
layout: post
title:  "OpenGL ES 2.0 (iOS) 笔记大纲"
toc: true
date:  2017-01-01 11:53
cover: "assets/images/maincontent/post/cover.jpg"
box_cover: "blogs/coding/OpenGL/OpenGL-ES-2-0-笔记/images/OpenGL-ES-2-0-(iOS)-笔记大纲/00.png" # 文章的第一张图片
vfpage_collection_tags: OpenGL
tags: OpenGL OpenGL_ES_2_0 iOS OpenGLES
categories: Coding OpenGL
---

这里包含了所有，我已经学习或者将要学习的 OpenGL ES 2 内容，所以它是笔记，描述的是学习心得，不是一本教科书。

记录它们的原因很简单，希望想了解和学习 OpenGL ES 2 的人，可以更轻松地进入这个世界，也算了(liao)了(le)自己的一个小心愿——我要学习 OpenGL ES 2 ，你只要告诉我它是什么，它能干嘛，其它的细节我会自己去想去找去完成，请不要废话。

**OpenGL 只是 3D 世界的工具，不是目的，它背后的世界才是目的地。**

入门：
[OpenGL ES 2.0 (iOS)[01]： 一步从一个小三角开始](http://www.jianshu.com/p/d22cf555de47)

![][img-00]

这是一篇，**讲述整个渲染管线流程的文章**，只是告诉你应该从那里开始，从那里结束，里面的细节更多地要你自己去发现，因为我告诉你的只是我的，只有你去发现了它们，它们才是你的。

疑问：
[OpenGL ES 2.0 (iOS)[02]：修复三角形的显示](http://www.jianshu.com/p/6be48aa6376f)

![问题与目标][img-01]

这是一篇，**图形显示有问题【出现拉伸】，而引发的一次思考，从而编写完成的文章**；当然按照正常的管线流程，这篇文章应该不用出现，但是你在这条路向前行走着的时候，你就要思考，为什么是对的，又为什么是错的。

熟悉 2D 图形绘制：
[OpenGL ES 2.0 (iOS)[03]：熟练图元绘制，玩转二维图形](http://www.jianshu.com/p/c7b58b9cc3be)

![Geometries][img-02]

这是一篇，**专门用来练习渲染管线中 数据 【数据计算】 + 数据绑定 + 2D 绘制 的文章**，它的目的是让你熟悉渲染管线的设置，以及如何做到 所想变成所绘。

 解决 3D 视觉问题 :
[OpenGL ES 2.0 (iOS)[04]：坐标空间 与 OpenGL ES 2 3D空间](http://www.jianshu.com/p/e6999f19affd)

![][img-03]

这是一篇，真正意义上解决 [02] 中出现的，三角形拉抻问题的文章，也是真正认识 OpenGL ES 2 是如何把 3D 图形正确渲染出来的 **【3D 变换】**。

开始进入 3D 世界 ：
[OpenGL ES 2.0 (iOS)[05-1]：进入 3D 世界，从正方体开始](http://www.jianshu.com/p/dc4d34b1c979)

![正方体][img-04]

这是 3D 世界的开篇，也是增加新知识的开始【Depth Render Buffer】。前面的知识都是 2D 思维的，从这里开始就要用 3D 的空间思维了【引入 Z 坐标】。

任意 3D 模型的渲染： <br />
《OpenGL ES 2.0 (iOS)[05-1]：任意 3D 模型的渲染》【未写】

纹理 ： <br />
《OpenGL ES 2.0 (iOS)[06-1]：纹理初识》【未写】

后面还有很多未写的，慢慢来吧......

[img-00]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-笔记/images/OpenGL-ES-2-0-(iOS)-笔记大纲/00.png" | relative_url }}     
[img-01]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-笔记/images/OpenGL-ES-2-0-(iOS)-笔记大纲/01 问题与目标.png" | relative_url }}  
[img-02]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-笔记/images/OpenGL-ES-2-0-(iOS)-笔记大纲/02 Geometries.png" | relative_url }}  
[img-03]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-笔记/images/OpenGL-ES-2-0-(iOS)-笔记大纲/03.png" | relative_url }}
[img-04]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-笔记/images/OpenGL-ES-2-0-(iOS)-笔记大纲/04 正方体.gif" | relative_url }}
