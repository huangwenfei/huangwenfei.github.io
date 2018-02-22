---
layout: post
title:  "OpenGL ES 2.0 (iOS)[04]：坐标空间 与 OpenGL ES 2 3D空间"
toc: true
date:  2016-12-10 22:15
cover: "assets/images/maincontent/post/cover.jpg"
box_cover: "assets/images/maincontent/post/default.jpg" # 文章的第一张图片
vfpage_collection_tags: OpenGL
tags: OpenGL OpenGL_ES_2_0 iOS OpenGLES
categories: Coding OpenGL
---

### 一、多坐标系

#### 1.  世界坐标系

- **即物体存在的空间，以此空间某点为原点，建立的坐标系**

- 世界坐标系是最大的坐标系，世界坐标系不一定是指“世界”，准确来说是一个空间或者区域，就是足以描述区域内所有物体的最大空间坐标，是我们关心的最大坐标空间；

- 例子

  - **ep1:** <br /><br />
比如我现在身处广州，要描述我现在所在的空间，对我而言最有意义就是，我身处广州的那里，而此时的广州就是我关心的“世界坐标系”，而不用描述我现在的经纬坐标是多少，不需要知道我身处地球的那个经纬位置。
<br /><br />
**这个例子是以物体的方向思考的最合适世界坐标系；（当然是排除我要与广州以外的区域进行行为交互的情况咯！）**
<br /><br />
  - **ep2:** <br /><br />
如果现在要描述广州城的全貌，那么对于我们而言，最大的坐标系是不是就是广州这个世界坐标系，也就是所谓的我们最关心的坐标系；
<br /><br />
**这个例子是以全局的方向思考的最合适世界坐标系；**
<br /><br />
- **世界坐标系主要研究的问题：**
1) 每个物体的位置和方向
2) 摄像机的位置和方向
3) 世界的环境（如：地形）
4) 物体的运动（从哪到哪）

#### 2.  物体（模型）坐标系

- **模型自身的坐标系，坐标原点在模型的某一点上，一般是几何中心位置为原点**

-  模型坐标系是会跟随模型的运动而运动，因为它是模型本身的 “一部分” ；
-  模型内部的构件都是以模型坐标系为参考进而描述的；

- ep: <br />
比如有一架飞机，机翼位于飞机的两侧，那么描述机翼最合适的坐标系，当然是相对于飞机本身，机翼位于那里；飞机在飞行的时候，飞机本身的坐标系是不是在跟随运动，机翼是不是在飞机的坐标中同时运动着。

#### 3.  摄像机坐标系

- **摄像机坐标系就是以摄像机本身为原点建立的坐标系，摄像机本身并不可见，它表示的是有多少区域可以被显示（渲染）**

- 白色线所围成的空间，就是摄像机所能捕捉到的最大空间，而物体则位于空间内部；
- 位于摄像机捕捉空间外的图形会直接被剔除掉；

#### 4.  惯性坐标系

- **它的 X 轴与世界坐标系的 X 轴平行且方向相同，Y 轴亦然，它的原点与模型坐标系相同**

- 它的存在的核心价值是，简化坐标系的转换，即简化模型坐标系到世界坐标系的转换；

---

### 二、坐标空间

 **坐标空间就是坐标系形成的空间**

#### 1.  世界空间

世界坐标系形成的空间，光线计算一般是在此空间统一进行；

#### 2.  模型空间

模型坐标系形成的空间，这里主要包含模型顶点坐标和表面法向量的信息；

***
第一次变换 <br /><br />
**模型变换（Model Transforms）：就是指从模型空间转换到世界空间的过程**
***

#### 3.  摄像机空间

![摄像机空间](http://upload-images.jianshu.io/upload_images/1411747-6ec1f9787acec794.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

摄像机空间，就是黄色区域所包围的空间；

摄像机空间在这里就是透视投影，透视投影用于 3D 图形显示，反映真实世界的物体状态；

> 透视知识扩展 [《透视》](http://meishu.bixueke.com/sumiaorumen/toushi.html)

***
第二次变换 <br /><br />
**视变换（View Transforms）：就是指从世界空间转换到摄像机空间的过程**
***

- 摄像机空间，也被称为眼睛空间，即可视区域；
- 其中，LookAt（摄像机的位置） 和 Perspective（摄像机的空间） 都是在调整摄像空间；

#### 4.  裁剪空间

**图形属于裁剪空间则保留，图形在裁剪空间外，则剔除（Culled）**

![摄像机 带注解](http://upload-images.jianshu.io/upload_images/1411747-5d9002d40be63922.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

标号（3）[视景体] ，所指的空间即为裁剪空间，这个空间就由 Left、Right、Top、Bottom、Near、Far 六个面组成的四棱台，即视景体。

![视景体](http://upload-images.jianshu.io/upload_images/1411747-0575931e2cbfeae2.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

图中紫色区域为视场角 <br />
![fov & zoom](http://upload-images.jianshu.io/upload_images/1411747-0264d246aac1c5e4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

从而引出，视场缩放为： <br />
![zoom](http://upload-images.jianshu.io/upload_images/1411747-83db85e630be709e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](http://upload-images.jianshu.io/upload_images/1411747-1a5addf0c8d77e91.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 其次，顶点是用齐次坐标表示{x, y, z, w}, 3D 坐标则为{x/w, y/w, z/w}而 w 就是判断图形是否属于裁剪空间的关键:

  锥面|关系
  :-:|:-:
  Near| z < -w
  Far| z > w
  Bottom| y < -w
  Top| y > w
  Left| x < -w
  Right| x > w

  即坐标值，不符合这个范围的，都会被裁剪掉

  坐标|值范围
  :-:|:-:
  x | [-w , w]
  y | [-w,  w]
  z | [-w,  w]

***
第三次变换 <br /><br />
**投影变换（Projection Transforms）: 当然包括正交、透视投影了，就是指从摄影机空间到视景体空间的变换过程**
***

#### 5.  屏幕空间

**它就是显示设备的物理屏幕所在的坐标系形成的空间，它是 2D 的且以像素为单位，原点在屏幕的几何中心点**

![屏幕坐标空间.jpg](http://upload-images.jianshu.io/upload_images/1411747-306227414da16ebc.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

***
第四次变换（最后一次） <br /><br />
**视口变换（ViewPort Transforms）: 指从裁剪空间到屏幕空间的过程，即从 3D 到 2D**
***

这里主要是关注像素的分布，即像素纵横比；因为图形要从裁剪空间投影映射到屏幕空间中，需要知道真实的环境的像素分布情况，不然图形就会出现变形；

> [《OpenGL ES 2.0 (iOS)[02]：修复三角形的显示》](http://www.jianshu.com/p/6be48aa6376f)这篇文章就是为了修复屏幕像素比例不是 1 : 1 引起的拉伸问题，而它也就是视中变换中的一个组成部分。

- 像素纵横比计算公式

![像素缩放比](http://upload-images.jianshu.io/upload_images/1411747-d5f527828fdcc951.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 三、OpenGL ES 2 3D 空间

#### 1.  变换发生的过程

![OpenGL ES 2 变换流程图](http://upload-images.jianshu.io/upload_images/1411747-0ae909f8df1ef69c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 这个过程表明的是 GPU 处理过程（渲染管线）；

- 变换过程发生在，顶点着色与光栅化之间，即图元装配阶段；

- 编写程序的时候，变换的操作是放在顶点着色器中进行处理；

- 右下角写明了，总共就是四个变换过程：模型变换、视变换、投影变换、视口变换，经过这四个变换后，图形的点就可以正确并如愿地显示在用户屏幕上了；

- **侧面反应，要正确地渲染图形，就要掌握这四种变换；**

#### 2.  各个变换流程分解简述

- **阶段一：追加 w 分量为 1.0**  （第一个蓝框）

  **这个阶段不需要程序员操作**

  这里的原因是，OpenGL 需要利用齐次坐标去进行矩阵的运算，核心原因当然就是方便矩阵做乘法咯（R(4x4) 点乘 R(4x1) 嘛）！

- **阶段二：用户变换**  （第二个蓝框）

  **这个阶段需要程序员操作，在 Vertex Shader Code 中进行操作**

  这个阶段主要是把模型正确地通过 3D 变换(旋转、缩放、平移)放置于摄像机的可视区域（视景体）中，包括处理摄像机的位置、摄像机的可视区域占整个摄像机空间的大小。

  **这个阶段过后，w 就不在是 1.0 了**

- **阶段三：重新把齐次坐标转换成 3D 坐标**  （第三个蓝框）

  **这个阶段不需要程序员操作**

  要重新转换回来的原因，也很简单 ---- 齐次坐标只是为了方便做矩阵运算而引入的，而 3D 坐标点才是模型真正需要的点位置信息。

  这个阶段过后，所有的点坐标都会标准化（所谓标准化，就是单位为1），x 和 y 值范围均在 [-1.0, 1.0 ]之间，z 就在 [ 0.0, 1.0 ] 之间；

  x 和 y 值范围均在 [-1.0, 1.0 ]之间，才能正确显示，原因是 OpenGL 的正方体值范围就是 [ -1.0, 1.0 ] 不存在其它范围的值；而 z 的值范围是由摄像机决定的，摄像机所处的位置就是 z = 0，的位置，所以 0 是指无限近，摄像机可视区的最远处就是 z = 1， 所以 1 是指无限远；

- **阶段四：重新把齐次坐标转换成 3D 坐标**  （第四个蓝框）

  **这个阶段需要程序员操作，在图形渲染前要进行操作，即在 `gldraw*` 前**

  这个阶段核心的就是 ViewPort 和 DepthRange 两个，前者是指视口，后者是深度，分别对应的 OpenGL ES 2 的 API 是：

  函数|描述
  :-:|:-:
  glViewport | 调整视窗位置和尺寸
  glDepthRange | 调整视景体的 near 和 far 两个面的位置 （z）

  glViewport ||
  :-|:-
  void **glViewport**(**GLint** x, **GLint** y, **GLsizei** w, **GLsizei** h)|
  **x, y** *以渲染的屏幕坐标系为参考的视口原点坐标值（如：苹果的移动设备都是是以左上角为坐标原点）* |
  **w, h** *要渲染的视口尺寸，单位是像素* |

  glDepthRange||
  :-|:-
  void **glDepthRange**(**GLclampf** n, **GLclampf** f)|
  **n, f** *n, f 分别指视景体的 near 和 far ，前者的默认值为 0 ，后者的默认值为 1.0， 它们的值范围均为 [ 0.0, 1.0 ], 其实就是 z 值* |

#### 3. 四次变换与编程应用

- **下面这两张图片就是 Vertex Shader Code 中的最终代码**

  ```
  #version 100

  attribute vec4 v_Position;
  uniform mat4 v_Projection, v_ModelView;

  attribute vec4 v_Color;
  varying mediump vec4 f_color;

  void main(void) {
      f_color = v_Color;
      gl_Position  = v_Projection * v_ModelView * v_Position;
  }
  ```

  v_Projection 表示投影变换；v_ModelView 表示模型变换和视变换；
<br /><br />

- **第一次变换：模型变换，模型空间到世界空间**  （ 1 -> 2 ）

  请看[《OpenGL ES 2.0 (iOS)[02]：修复三角形的显示》](http://www.jianshu.com/p/6be48aa6376f) 这篇文章，专门讲模型变换的。

- 余下的几次变换，都是和摄像机模型在打交道
摄像机里面的模型
<br /><br />
![Camera Model](http://upload-images.jianshu.io/upload_images/1411747-941bcfa26c2529ee.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<br /><br />
    要完成摄像机正确地显示模型，要设置摄像机位置、摄像机的焦距：
  1. 设置摄像机的位置、方向 --> (视变换) gluLookAt (ES 没有这个函数)，使要渲染的模型位于摄像机可视区域中；【完成图中 1 和 2】

  2. 选择摄像机的焦距去适应整个可视区域 --> (投影变换)  glFrustum（视景体的六个面）、gluPerspective（透视） 、glOrtho（正交）（ ES 没有这三个函数) 【完成图中 3】

  3. 设置图形的视图区域，对于 3D 图形还可以设置 depth- range --> glViewport 、glDepthRange

- **第二次变换：视变换，世界空间到摄像机空间**  （ 2 -> 3 ）
<br /><br />
  上面提到， ES 版本没有 gluLookAt 这个函数，但是我们知道，这里做的都是矩阵运算，所以可以自己写一个功能一样的矩阵函数即可；
<br />
     ```
    // 我不想写，所以可以用 GLKit 提供给我们的函数
    /*
     Equivalent to gluLookAt.
     */
    GLK_INLINE GLKMatrix4 GLKMatrix4MakeLookAt(float eyeX, float eyeY, float eyeZ,
                                                      float centerX, float centerY, float centerZ,
                                                      float upX, float upY, float upZ);
    ```

  ![Frustum](http://upload-images.jianshu.io/upload_images/1411747-685255ae0fa64805.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<br /><br />
 函数的 eye x、y、z 就是对应图片中的 Eye at ，即摄像机的位置；
<br /><br />
 函数的 center x、y、z 就是对应图片中的 z-axis 可视区域的中心点；
<br /><br />
 函数的 up x、y、z 就是对应图片中的 up 指摄像机上下的位置（就是角度）；

- **第三次变换：投影变换，摄像机空间到裁剪空间**  （ 3 -> 4 ）
<br /><br />
![view frustum](http://upload-images.jianshu.io/upload_images/1411747-0494b95670a091db.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<br /><br />
当模型处于视景体外时会被剔除掉，如果模型有一部分在视景体内时，模型的点信息只会剩下在视景体内的，其它的点信息不渲染；
<br />
  ```
  /*
   Equivalent to glFrustum.
   */
  GLK_INLINE GLKMatrix4 GLKMatrix4MakeFrustum(float left, float right,
                                              float bottom, float top,
                                              float nearZ, float farZ);
  ```
  这个是设置视景体六个面的大小的；
<br /><br />
  - 透视投影
<br />
![透视投影](http://upload-images.jianshu.io/upload_images/1411747-b6e383cf50b8e144.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<br /><br />
  对应的投影公式 ：
<br /><br />
![完整的透视投影公式](http://upload-images.jianshu.io/upload_images/1411747-58d34c2b0b47d5c0.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<br /><br />
  使用 GLKit 提供的函数：
<br />
    ```
    /*
     Equivalent to gluPerspective.
     */
    GLK_INLINE GLKMatrix4 GLKMatrix4MakePerspective(float fovyRadians, // 视场角
                                                        float aspect,  // 屏幕像素纵横比
                                                        float nearZ, // 近平面距摄像机位置的距离
                                                        float farZ); // 远平面摄像机位的距离
    ```

- 正交投影
<br />
![Orthographic projection](http://upload-images.jianshu.io/upload_images/1411747-a6f562e4273c4b06.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<br /><br />
  对应的投影公式 ：
<br /><br />
![完整的正交投影公式](http://upload-images.jianshu.io/upload_images/1411747-2e427ef3c7124e01.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<br />
  ```
  /*
   Equivalent to glOrtho.
   */
  GLK_INLINE GLKMatrix4 GLKMatrix4MakeOrtho(float left, float right,
                                            float bottom, float top,
                                            float nearZ, float farZ);
  ```

- **第四次变换：视口变换，裁剪空间到屏幕空间**  （ 4 -> 5 ）
<br /><br />
这里就是设置 glViewPort 和 glDepthRange 当然 2D 图形不用设置 glDepthRange ；

-  **实际编程过程中的使用过程**

- 第一步，如果是 3D 图形的渲染，那么要绑定深度渲染缓存（DepthRenderBuffer），若是 2D 可以跳过，因为它的顶点信息中没有 z 信息 （ z 就是顶点坐标的深度信息 ）；
<br />
  1. Generate ，请求 depth buffer ，生成相应的内存标识符;
  2. Bind，绑定申请的内存标识符;
  3. Configure Storage，配置储存 depth buffer 的尺寸;
  4. Attach，装载 depth buffer 到 Frame Buffer 中;<br /><br />

  具体的程序代码：
![](http://upload-images.jianshu.io/upload_images/1411747-36a8c1e2ddff843c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 第二步，缩写 Vertex Shader Code
<br />
  ```
  #version 100

  attribute vec4 v_Position;
  uniform mat4 v_Projection, v_ModelView; // 投影变换、模型视图变换

  attribute vec4 v_Color;
  varying mediump vec4 f_color;

  void main(void) {
       f_color = v_Color;
       gl_Position = v_Projection * v_ModelView * v_Position;
  }
  ```

一般是把四次变换写成这两个，当然也可以写成一个；因为它们是一矩阵，等同于一个常量，所以使用的是 uniform 变量，变量类型就是 mat4 四乘四方阵（齐次矩阵）；

- 第三步，就是外部程序赋值这两个变量
<br /><br />
**注意，要在 glUseProgram 函数后，再使用 `glUniform*` 函数来赋值变量，不然是无效的；**
<br /><br />
依次完成 模型变换、视变换、投影变换，即可；它们两两用矩阵乘法进行连接即可；
<br /><br />
如：modelMatrix 点乘 viewMatrix , 它们的结果再与 projectionMatrix 点乘，即为 ModelViewMatrix ；
<br />
  > GLKit 点乘函数，
  `GLK_INLINE GLKMatrix4 GLKMatrix4Multiply(GLKMatrix4 matrixLeft, GLKMatrix4 matrixRight);`

- 第四步，如果是 3D 图形，有 depth buffer ，那么要清除深度渲染缓存
<br /><br />
使用 glClear(GL_DEPTH_BUFFER_BIT); 进行清除，当然之后就是要使能深度测试 glEnable(GL_DEPTH_TEST); 不然图形会变形；
<br /><br />
最好，也使能 glEnable(GL_CULL_FACE); 这里的意思就是，把在屏幕后面的点剔除掉，就是不渲染；判断是前还是后，是利用提供的模型顶点信息中点与点依次连接形成的基本图元的时钟方向进行判断的，这个 OpenGL 会自行判断；
<br /><br />
![ClockWise & Counterclockwise](http://upload-images.jianshu.io/upload_images/1411747-3c5e3f0ad15b990c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<br /><br />
左为顺时针，右为逆时针；

- 第五步，设置 glViewPort 和 glDepthRange
<br /><br />
使用 OpenGL ES 提供的 glViewPort  和  glDepthRange 函数即可；

---

### 四、工程例子

Github: [《DrawSquare_3DFix》](https://github.com/huangwenfei/OpenGLES2Learning/tree/master/04-Draw3DGeometries/DrawSquare_3DFix)

---

五、参考书籍

《OpenGL ES 2.0 Programming Guide》 <br />
《OpenGL Programming Guide 8th》 <br />
《3D 数学基础：图形与游戏开发》 <br />
《OpenGL 超级宝典 第五版》 <br />
《Learning OpenGL ES For iOS》
