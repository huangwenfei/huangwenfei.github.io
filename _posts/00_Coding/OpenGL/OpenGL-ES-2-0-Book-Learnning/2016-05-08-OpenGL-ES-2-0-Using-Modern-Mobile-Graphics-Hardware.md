---
layout: post
title:  "OpenGL ES 2.0 Using Modern Mobile Graphics Hardware"
toc: true
date:  2016-05-08 11:24
cover: "assets/images/maincontent/post/cover.jpg"
box_cover: "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/00 例子.png" # 文章的第一张图片
vfpage_collection_tags: OpenGL
tags: OpenGL OpenGL_ES_2_0 iOS OpenGLES
categories: Coding OpenGL
---

#### 一. 3D 渲染？

对象（图像）：A graphics processing unit (GPU) is a hardware component that combines data describing geometry, colors, lights, and other information to produce an image on a screen.（首先它是一张图像，这张图像包含了几何结构、颜色、灯光等其它信息；这张图像是通过 GPU 进入计算并显示在屏幕上的。）

![例子][img-00]

> 注：光和颜色可以让一张图像产生三维的视觉效果（相当于一张绘图纸上的素描画）

渲染（Rendering）：
The generation of a 2D image from 3D data is called rendering.(从三维数据到二维图像的过程就是渲染，就是把三维信息绘制成一张二维的图像（基于像素）)

#### 二. 图像的组成是什么呢?

![像素点][img-01]

渲染出来的图像是一张 位图 ，每一个像素点都是由 RGB 光原色进行组合形成的。

> 注：Images are stored in computer memory using an array containing at least three values for each pixel.（从数据存储的角度就是，每一个点都要有三个数据（red / green / blue）才能确定,而且每一个点使用一个数组进行保存）

#### 三. 渲染的实质?

GPU 和 CPU 根据三维数据，进行计算，计算出每一个像素点的 red 、 green  、blue 值（Rendering 3D data into a 2D image typically occurs in several separate steps involving calculations to set the red, green, and blue intensities of every pixel in the image.）

渲染在硬件的角度下是：

![][img-02]

#### 四. 问题：CPU 和 GPU 的 Memory 是有数据交换的，这种交换不会出问题吗？CPU 和 GPU 的计算速度一样吗？

首先，CPU 和 GPU 的数据处理速度是不一致的，那么数据交换的时候必然会出现不同步的情况，也就是必然要有一方要等待另一方计算结束后进行计算，很明显这样的情况是不合理的。

解决方案：

OpenGL ES 使用的是 Buffers 数据缓存区处理数据交换的问题。

这个缓存区是定义在 Memory Arears 区域的，目的是让图形处理器可以对这里的数据进行控制和管理。（OpenGL ES defines the concept of buffers for exchanging data between memory areas. A buffer is a contiguous range of RAM that the graphics processor can control and manage.）

#### 五. 图像处理器请求 OpenGL ES 处理图像数据(Buffers)的过程是？

所有的数据都最终在 Buffers 内存区中保存下来，而 OpenGL ES 对这些数据进行处理的步骤有 七步（对应的 API ）：

1. 生成标记 （Generate）：图像处理器请求 OpenGL ES 为这个 Buffers 生成唯一的标识；---> `glGenBuffers()`;

2. 绑定（Bind）：图像处理器告诉 OpenGL ES 使用这个 Buffers 来进行后续的操作； ---> `glBindBuffer()`;

3. 缓存数据（Buffer Data）：图像处理器告诉 OpenGL ES 分配并初始化一块足够大、足够连续的内存； ---> `glBufferData()` or `glBufferSubData()`;

4. 使能（Enable or Disable）：图像处理器告诉 OpenGL ES 是否使用这些数据进行后续的操作；---> `glEnableVertexAttribArray()` or `glDisableVertexAttribArray()`;

5. 设置指针（Set Pointers）：图像处理器告诉 OpenGL ES Buffers 的内存类型，并且把所有数据的 内存偏移量 告诉 OpenGL ES ； ---> `glVertexAttribPointer()`;

6. 绘制（Draw）：图像处理器告诉 OpenGL ES 利用数据渲染屏幕上所有的范围，并使能 Buffers ；---> `glDrawArrays()` or `glDrawElements()`;

7. 删除（Delete）：图像处理器告诉 OpenGL ES 删除旧标记的 Buffers ，以及释放相关联的数据；---> `glDeleteBuffers()`;

> 注： 被标记的 Buffers 会被多次使用和修改

#### 六. 那么现在有个问题，渲染好的图像数据放在那里呢？

OpenGL ES 中引入，帧缓存（Frame Buffer）来进行渲染后的数据保存；

区别：

- 帧缓存和其它的缓存不一样的是，不用进行初始化，而标记、绑定等操作是一样的；

- 只有在 Bounds (显示范围) 出现的时候会被使能;

- 帧缓存分为 前帧缓存（front frame buffer） 和 后帧缓存（back frame buffer），而且它们会在屏幕显示和用户交互过程不断地交替；

- front frame buffer 控制每个像素的颜色;

请看图：

![][img-03]

#### 七. OpenGL ES 是与当前的嵌入式系统硬件系统有关系，那么如何保存当前平台下的环境，从而为渲染提供唯一的平台环境？

OpenGL ES 提供 Context（上下文环境） 变量: The information that configures OpenGL ES resides in platform-specific software data structures encapsulated within an OpenGL ES context.（context是封装保存了 OpenGL ES 特定平台环境下的软件信息结构）

#### 八. 这种 Context 信息又包含了什么？

- 特定的嵌入式系统（OpenGL ES）环境

- 特定的 GPU 硬件

- Frame Buffer 渲染通道

- 三维数据信息

- 渲染相关的信息

#### 九. Context 能有什么用？

- 可以认为程序不用关心不同平台下的具体信息（如：GPU 什么品牌，什么型号等）

- 方便 OpenGL ES 程序 移植  <br />
（ context 相当于自动配置适合当前 OpenGL ES 工作的环境 ）

#### 十. 移动设备屏幕的坐标系统和 OpenGL ES 的坐标系统是否相同？

解答：

OpenGL ES 是三维坐标系（x, y, z）,设备屏幕坐标系统是二维坐标系（x, y）
三维坐标系：

![][img-04]

向量坐标（有方向的坐标点，从什么点到什么点）：

![][img-05]

图上：(0， 0 ， 0) --> (1.5, 3.0, -2.0)

![][img-06]

> 注：任意起点都可以，如果不懂请 恶补数学；

向量坐标运算：

![][img-07]

> 注：
> ![][img-08]

三维图形：

![][img-09]

> 注：OpenGL ES 实质绘制的是三维坐标点，坐标点既是像素点，像素点既是 RGB 颜色数组；

[img-00]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/00 例子.png" | relative_url }}     
[img-01]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/01 像素点.png" | relative_url }}  
[img-02]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/02.png" | relative_url }}  
[img-03]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/03.png" | relative_url }}
[img-04]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/04.png" | relative_url }}     
[img-05]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/05.png" | relative_url }}  
[img-06]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/06.png" | relative_url }}     
[img-07]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/07.png" | relative_url }}  
[img-08]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/08.png" | relative_url }}  
[img-09]:{{ "blogs/coding/OpenGL/OpenGL-ES-2-0-Book-Learnning/images/OpenGL-ES-2-0-Using-Modern-Mobile-Graphics-Hardware/09.png" | relative_url }}
