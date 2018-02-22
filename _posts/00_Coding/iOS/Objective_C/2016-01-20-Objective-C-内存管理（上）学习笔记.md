---
layout: post
title:  "Objective-C-内存管理（上）学习笔记"
toc: true
date:   2016-01-20 15:41
cover: "assets/images/maincontent/post/cover.jpg"
box_cover: "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/00 NSAutoreleasePool.png" # 文章的第一张图片
vfpage_collection_tags: Objective_C
tags: Objective_C iOS MRC ARC 内存管理
categories: Coding iOS Objective_C
---

## 一.开篇之初

1.  内存管理解决的问题就是：  

      1）防止野指针的生成
（野指针：指向变量的指针还存在，但是所指向的内存已经被释放，此时的指针就变成了野指针 -- 没有指向 *“ 内容 ”* 的指针）

      2）防止出现内存泄漏
（内存泄漏：指向内存空间的指针已经被释放，但是该指针指向的内存空间还在内存中存在（被占用） -- 没有 *“ 地址 ”* 的内存）

      3）合理使用内存，防止有限内存的大量消耗

2.  Objective-C 的内存管理有三种，其中 iOS 中能用的，就是 MRC（手动引用计数）和 ARC（自动引用计数，官方推荐使用）；而另外一个垃圾回收机制，只能用在 OS X 系统中。

3.  内存管理管理的范围是，Objective-C 对象（基本数据类型由系统自动管理）。

4.  MRC 是基于引用计数的内存管理，是否释放内存取决于引用计数是否为 0；但注意，真正要研究并不是引用计数，而是对象是否被持有的问题。

5.  ARC 是基于自动引用计数的内存管理，是否释放内存取决于对象是否还有强引用指向；真正研究的是，对象的所有权问题。（所有权的概念是 ARC 中引入的）

---

## 二.内存管理的思考方式

> 引自：《Objective-C高级编程 iOS与OS X多线程和内存管理》

- 自己生成的对象，自己所持有
- 非自己生成的对象，自己也能持有
- 自己持有的对象不再需要时释放
- 非自己持有的对象无法释放

#### 换个方式来解读：

- 自己申请的内存，自己所掌管（拥有）
- 不是自己申请的内存，自己也可以掌管（拥有）
- 自己掌管（拥有）的内存不再需要时就释放（free）
- 不是自己掌管（拥有）的内存，无法释放(free)

---

## 三.MRC（Manual Reference Counting）内存管理

### --> 小小结 <--

- MRC模式下对象什么时候被销毁？引用计数值为0的时候。

- MRC使用的管理内存的基本方法和属性：
  -  四个方法 --> retain/release/dealloc/autorelease/
  - 一个属性 --> retainCount（记录引用计数值）

**<----均定义在 NSObject.h 中---->**

```
//define OBJC_ARC_UNAVAILABLE __attribute__((unavailable("not available in automatic reference counting mode")))
- (instancetype)retain OBJC_ARC_UNAVAILABLE;
- (oneway void)release OBJC_ARC_UNAVAILABLE;
- (instancetype)autorelease OBJC_ARC_UNAVAILABLE;
- (NSUInteger)retainCount OBJC_ARC_UNAVAILABLE;
- (struct _NSZone *)zone OBJC_ARC_UNAVAILABLE;
```

- 谁 retain，谁 release
- retain 既是把 retainCount 值加 1； release 既是把 retainCount 值减 1
- dealloc 只有在 retainCount = 0 的时候，由系统自动调用
- autorelease 是把对象加进自动释放池中，由系统自动为池中的对象发送 release 消息

---

- 问题 1：什么是引用计数（Reference Counting）？

- 引用计数 ?

这里的“计数”表明必然会有一个东西（变量）来记录引用的变化，而在 OC 里这个变量就是 retainCount；那么还有一个问题就是通过什么方式来操作这个变量，OC 里就是 retain（引用次数加 1），release（引用计数减 1 ）方法。

- 引用计数：就是分配的 **内存区块** 被 **多少个** OC对象所持有（掌管；保持且拥有），间接表示就是retainCount值的大小。

> 注：对象，指人可以识别的东西，具备属性、收发信息、处理信息；而从系统的角度看，操作对象就是操作一块内存。（可能不是很准确......）

- 问题 2 ：引用计数如何管理OC对象？

- 首先明确，引用计数的变化是被持有者的变化。

- 那么问题就是怎样持有对象（持有内存）?

- 持有：就是可以访问内存，且可以进行读写操作，而一般是通过内存的首地址进行内存的访问，就是指针访问。

- 而OC中一般用来分配内存的的函数是`alloc/new/copy/mutablecopy`(当然还有`clloc...`等等)，它们返回的都是指针，就是使用他们来 **生成对象并持有对象的**。

- 问题 3：持有？释放？销毁？对象... , 请看下表：

| OC操作方法 | 对象的操作 |retainCount|
| -----|----|:----:|
| alloc/new/copy/mutablecopy 等 | 生成并持有对象 |1？|
| retain | 持有对象 |+1|
| release | 释放对象 |-1|
|dealloc|销毁对象|此时该值没有意义|
|autorelease|在自动释放池结束时，为里面的对象发送一条 release 消息| (all object) -1|

上面涉及的方法定义如下（NSOject.h）：

```
//define OBJC_SWIFT_UNAVAILABLE(_msg) __attribute__((availability(swift, unavailable, message=_msg)))
+ (instancetype)new OBJC_SWIFT_UNAVAILABLE("use object initializers instead");
+ (instancetype)alloc OBJC_SWIFT_UNAVAILABLE("use object initializers instead");
- (void)dealloc OBJC_SWIFT_UNAVAILABLE("use 'deinit' to define a de-initializer");

- (id)copy;
- (id)mutableCopy;
```

- 问题 4：什么是自动释放池？

- 自动释放池：在自动释放池结束时，系统自动为里面的对象发送一条 release 消息（when the pool itself is drained）
- 要使用自动释放池就要使用 NSAutoreleasePool 对象

![NSAutoreleasePool][img-00]

- NSAutoreleasePool 它的方法

![][img-01]

- 使用方法：
- 创建一个NSAutoreleasePool对象 <br />
`NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];`
- 添加要释放的对象进NSAutoreleasePool对象中<br />
`id obj = [NSString alloc] initWithstring:@"objective-c pool"];` <br />
`[obj autorelease];`或`[pool addObject:obj];`  --- 1

- 释放NSAutoreleasePool对象 <br />
`[pool drain];`等同于`[pool release];`  --- 2

> **注意：** <br />
> 1 --> 建议使用autorelease方法，因为后面的方法会导致同一个对象被多次加入自动释放池中。 <br />
> ![addObject:方法][img-02] <br />
>
> 2 --> 虽然两个方法效果等同，但还是建议使用自动释放池专门的drain方法。 <br />
> ![drain方法][img-03] <br />
>
> 补充autorelease方法: <br />
> ![autorelease方法][img-04]

- 问题 5：MRC下如何防止野指针访问?

- 野指针访问：指向的内存空间已经被释放了，但是指针还指向着已经被释放的内存，此时的指针就是野指针。

- 访问了不存在的内存，当然会引起程序崩溃

- 修改Xcode工程为MRC模式

![][img-05]

- 开启对应 targets 的僵尸对象检测，详细步骤如下：<br />
![选择Edit Scheme][img-06]

![勾选僵尸对象检测][img-07]

- 情况 1：过快释放了对象（不要理retaiinCount把注意力放在对象被持有的个数上）

- retainCount 的补充：<br />
![只能用在调试阶段，值是不可靠的][img-08]

- 程序代码和运行结果

![tesh.m][img-09]

![main.m][img-10]

![指向异常的代码][img-11]

- 问题 6：MRC 下如何防止内存泄漏？

- 自己生成的对象，自己所持有

- 非自己生成的对象，自己也能持有

- 自己持有的对象不再需要时释放

- 非自己持有的对象无法释放

补充：

![持有对象][img-12]

![运行结果][img-13]

疑问：mArrayCopy的retainCount是2 ?被持有者有两个？

![再来一次release][img-14]

从这里就可以证明了，cope出来的新对象只是被mArrayCopy自己所持有而已，所以当release一次的时候对象已经被释放了，如果再release就是野指针访问了（注：直接看持有者有多少）。

代码：

```
    /**
     *  alloc就是分配内存的意思，返回了一个指向内存首地址的指针
     */
    NSMutableArray *mArrayAlloc = [[NSMutableArray alloc] init];  // mArrayAlloc 持有对象
    /**
     *  new 就相当于alloc+init,但是new有可能会返回同一个对象，所以并不建议使用
     */
    NSMutableArray *mArrayNew = [NSMutableArray new];   // mArrayNew 持有对象

    /**
     *  copy是一个实例方法，具体如下：
     *  - (id)copy
     *  Returns the object returned by copyWithZone:.
     *  - (id)copyWithZone:(NSZone *)zone
     *  Returns a new instance that’s a copy of the receiver.
     *  ---new instance 就表明了创建了一个新的内存，并返回首地址（id 相当于 void *）
     */
    NSMutableArray *mArrayCopy = [mArrayAlloc copy];   //mArrayCopy 持有了对象

    /**
     *  Returns the object returned by mutableCopyWithZone:.
     *  - (id)mutableCopy
     *  - (id)mutableCopyWithZone:(NSZone *)zone
     *  Returns a new instance that’s a mutable copy of the receiver.
     *  ---new instance 就表明了创建了一个新的内存，并返回首地址（id 相当于 void *）
     */
    NSMutableArray *mArrayMutablecopy = [mArrayNew mutableCopy];//mArrayMutablecopy 持有了对象
```

- 持有对象

![源代码][img-15]

![运行结果][img-16]

![明显的野指针访问了][img-17]

- 使用copy来独立管理内存

![使用copy源代码][img-18]

![内容没有改变][img-19]

- 如果内存还在使用的话，当然不要把对象赋值为nil

- 对象之间相互持有的情况

- 程序代码

![Apple.h][img-20]

![Apple.m][img-21]

![Girl.h][img-22]

![Girl.m][img-23]

![main.m][img-24]

如果要达到目的，apple让girl 也持有，就要在 girl 得到 apple 的时候持有一下，而可以做持有操作的是 retain，来看看：

![内存泄漏][img-25]

我们知道对象在最后销毁的时候是调用了 dealloc 方法的，那么 girl 既然持有了 apple 那么在销毁自己的时候是不是应该把自己持有的东西给交出来（释放掉），已死的对象不可能持有东西了吧，所以在 girl 的 dealloc 方法中加上 apple 释放的代码：

![][img-26]

虽然上面的方法是可以的，但是有问题，问题如下：

![retain][img-27]

apple 再持有一下 [[Apple alloc] init] ，再给 girl，直接翻译都是问题，而且从封装性来看，girl 要持有 apple 应该是自己去持有，也就是要自己进行 retain，而不是要 apple先 retain 再给 girl.

代码优化：

![retain去掉][img-28]

![set方法中进行retain][img-29]

还有，如果我们从现实生活中考虑问题（面向对象是现实世界的抽象），girl会不会只要一次apple呢？多要几个~~

![][img-30]

为了防止内存泄漏，我得这么干，估计你看到这就想呵呵了：

![][img-31]

![正常释放][img-32]

再次优化代码，目的是只要girl再次要一个新的apple就给它持有，如果是拿原来的apple当然不再次持有咯：

![做if判断][img-33]

![正常释放][img-34]

代码修改成下面这样就是真正的，girl直接的持有一个新的apple（新的内存空间）了，不过结果是一样的，正常释放：

![][img-35]

---

## ARC（ Automatic Reference Counting）内存管理

- 请期待下一篇......

[img-00]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/00 NSAutoreleasePool.png" | relative_url }}     
[img-01]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/01.png" | relative_url }}  
[img-02]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/02 addObject 方法.png" | relative_url }}  
[img-03]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/03 drain方法.png" | relative_url }}
[img-04]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/04 autorelease方法.png" | relative_url }}     
[img-05]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/05.png" | relative_url }}  
[img-06]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/06 选择Edit Scheme.png" | relative_url }}  
[img-07]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/07 勾选僵尸对象检测.png" | relative_url }}  
[img-08]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/08 只能用在调试阶段_值是不可靠的.png" | relative_url }}     
[img-09]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/09 tesh.m.png" | relative_url }}  
[img-10]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/10 main.m.png" | relative_url }}  
[img-11]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/11 指向异常的代码.png" | relative_url }}  
[img-12]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/12 持有对象.png" | relative_url }}     
[img-13]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/13 运行结果.png" | relative_url }}  
[img-14]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/14 再来一次release.png" | relative_url }}  
[img-15]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/15 源代码.png" | relative_url }}  
[img-16]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/16 运行结果.png" | relative_url }}     
[img-17]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/17 明显的野指针访问了.png" | relative_url }}  
[img-18]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/18 使用copy源代码.png" | relative_url }}  
[img-19]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/19 内容没有改变.png" | relative_url }}  
[img-20]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/20 Apple.h.png" | relative_url }}     
[img-21]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/21 Apple.m.png" | relative_url }}  
[img-22]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/22 Girl.h.png" | relative_url }}  
[img-23]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/23 Girl.m.png" | relative_url }}  
[img-24]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/24 main.m.png" | relative_url }}     
[img-25]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/25 内存泄漏.png" | relative_url }}  
[img-26]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/26.png" | relative_url }}  
[img-27]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/27 retain.png" | relative_url }}  
[img-28]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/28 retain去掉.png" | relative_url }}     
[img-29]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/29 set方法中进行retain.png" | relative_url }}  
[img-30]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/30.png" | relative_url }}  
[img-31]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/31.png" | relative_url }}  
[img-32]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/32 正常释放.png" | relative_url }}     
[img-33]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/33 做if判断.png" | relative_url }}  
[img-34]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/34 正常释放.png" | relative_url }}  
[img-35]:{{ "blogs/coding/iOS/Objective_C/images/Objective-C-内存管理_上_学习笔记/35.png" | relative_url }}  
