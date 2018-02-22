---
layout: post
title:  "Objective-C-知识总结 @property"
toc: true
date:  2016-12-16 22:59
cover: "assets/images/maincontent/post/cover.jpg"
box_cover: "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/00 OC 的属性概念.png" # 文章的第一张图片
vfpage_collection_tags: Objective_C
tags: Objective_C iOS Property 属性
categories: Coding iOS Objective_C
---

#### 一、属性声明的概念、构成、访问

##### 1. 属性声明的初现版本

- 属性声明是 Objective-C 2.0 的新增功能；
- `@property` 是编译器指令，`@property` 完成的工作就是属性声明；

##### 2. 属性声明的概念

- 属性？
属性是指对象的特性。

- 属性声明？
属性声明是一种声明变量为属性的语法。

- 属性的实现？
声明了实例变量或定义了相应的访问方法（存取方法）即为实现了属性。

- Objective-C 2.0 属性的概念

![OC 的属性概念][img-00]
##### 3. 属性声明的构成

![Property 的书写格式][img-01]

- 第一部分：@property

`@property` 只是一个编译器指令，意思是告诉编译器要干嘛，当然它的意思就是要求 Xcode 做属性声明了。

- 第二部分：选项列表

这些也叫属性关键字，它们分别有，如表：

种类|关键字|描述
:-:|:-:|:-:
修改方法名类|setter = 新的 OC 方法名|修改默认生成的方法名( selector )
——|getter = 新的 OC 方法名| ——
读写权限类|readonly|表明变量只读，只生成 getter 方法
——|readwrite|表明变量可读写【默认值】
赋值操作类|assign|直接赋值 ( MRC / ARC 均可用 )【默认值】
——|retain|进行保持操作，持有对象 ( 仅 MRC 可用 )
——|unsafe_unretained|直接赋值 ( 仅 ARC )
——|strong|强引用，持有对象 ( 仅 ARC 可用 )【默认值】
——|weak|弱引用，不持有对象 ( 仅 ARC 可用 )
——|copy|拷贝副本 （深度拷贝）
原子性操作类|nonatomic|非原子性操作，线程不安全
——|atomic|原子性操作，线程安全【默认值】
类属性|class| 永远不自动合成存取方法，需手动实现；不声明实例变量，因为它是类变量；【iOS 10, Xcode 8】
空类| nonnull| 不能为空【iOS 9, Xcode 7】
——|nullable| 可以为空【iOS 9, Xcode 7】
——|null_resettable| setter 方法可以是 nil，getter 方法不能返回 nil，要重写 getter 方法【iOS 9, Xcode 7】
——|null_unspecified（`_Null_unspecified`）| 不确定是否为空【iOS 10, Xcode 8】（【iOS 9, Xcode 7】）

详细描述请移步至，本文 第三章: 属性声明的可选选项 ( 关键字 )；

- 第三部分：变量类型 + 变量名+ ；

这一部分和声明实例变量的情况是一样的;

##### 4. 属性访问方式

- 访问的方式有：
  - 通过直接使用实例变量
  - 使用编译器提供的点运算符，实现属性存取方法的调用，从而间接使用实例变量；

> 注意：`id` 类型的变量不能使用点操作符进行访问，原因是 Xcode 不知道是否存在对应的存取方法；

---

#### 二、属性声明的自动合成

![Property 的组成][img-02]

##### 1. @synthesize ：自动编写存取方法

```
@interface ......
@property (nonatomic, strong) int age;
@end
@implementaion XXXClass
@synthesize age = _age;
@end
```

- 修改属性声明的变量名，上面的例子就是修改属性声明的 `age` 变量名改为 `_age` 变量名；

- 告诉编译器要自动合成 setter、getter 方法（readwrite、readonly）

```
// 情况 1 readwrite，同时生成 setter、getter 方法
@property (nonatomic, strong) int age;
//////
  - (void)setAge:(int)age {
  // do something
}
  - (int)age {
  // do something
  return _age;
}
//////
```

```
// 情况 2 readonly，只生成 getter 方法
@property (nonatomic, strong, readonly) int age;
//////
  - (int)age {
  // do something
  return _age;
}
//////
```

> 如果声明了属性 `@property`，同时又手动实现了相应的存取方法，就一定要写 `@synthesize` 不然照样报警告；

##### 2. `@dynamic:` 手动编写存取方法

```
@interface ......
@property (nonatomic, strong) int age;
@end
@implementaion XXXClass
@synthesize age = _age;
@end
```

告诉编译器要手动编写 setter、getter 方法（readwrite、readonly）

```
// 情况 1 readwrite，必须要同时编写 setter、getter 方法
@property (nonatomic, strong) int age;
//////
  - (void)setAge:(int)age {
  // do something
}
  - (int)age {
  // do something
  return _age;
}
//////
```

```
// 情况 2 readonly，只需编写 getter 方法
@property (nonatomic, strong, readonly) int age;
//////
  - (int)age {
  // do something
  return _age;
}
//////
```

> 此处程序员手动编写的 setter 、getter 方法必须要严格按照 存取方法的命名要求进行编写：

```
setter --> setValueName:
getter --> valueName
```

不然在调用属性存取方法的时候，会出现访问出错的；

##### 3. 自动合成？

从 Xcode 4.4 开始，当我们用 `@property` 进行属性声明的时候，编译器就会自动帮我们生成相应的 实例变量 + 存取方法声明 + 存取方法实现；

那什么情况下会破坏这种自动合成的过程呢？

正常的使用情况：

```
#import "ViewController.h"

@interface ViewController ()
@property (nonatomic) NSUInteger age;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.

    _age = 18;
    self.age = 20;
    NSLog(@"self.age = %lu", (unsigned long)self.age);

}

@end
```

实例变量 + 存取方法声明 + 存取方法实现 都正常地拥有了；

- 实例变量的情况

![][img-03]

![][img-04]

这里直接证明了以下几点：

1) Xcode 帮我们生成（把原来的变量名改成）了，带下划线的实例变量；

2) 声明并生成了变量名对应的存取方法；

**让警告消失**

![][img-05]

![][img-06] <br />

```

#import "ViewController.h"

@interface ViewController (){
    NSUInteger __age;
}
@property (nonatomic) NSUInteger _age;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.

    _age = 18;
    __age = 19;
    self.age = 20;
    self._age = 23;
    NSLog(@"self.age = %lu", (unsigned long)self.age);
    NSLog(@"self.age = %lu", (unsigned long)self._age);

}

@end
```

那个警告明显是说，我自动合成的实例变量是`__age`，而不是 `_age `，所以你应该定义一个 `__age` 的实例变量才对，不然我就警告你；

其实这里是间接地证明了，如果你自己定义了相应的带下划线的实例变量，那么 Xcode 就不会自己合成属性相应的实例变量了；

简而言之，写了 `NSUInteger __age;` 和 `@property (nonatomic) NSUInteger _age;` Xcode 只会合成相应的 存取方法声明 + 存取方法实现；

- 存取方法情况

![][img-07]

很明显地，如果存取方法都手动实现了，那么自然就把自动合成的机制打破了，连 `_age` 实例变量都不会帮你生成，当然连 `age` 实例变量也不会有；

**让错误消失**

![][img-08]

```
#import "ViewController.h"

@interface ViewController ()
@property (nonatomic) NSUInteger age;
@end

@implementation ViewController

@synthesize age = _age;

- (void)setAge:(NSUInteger)age {

    _age = age;

}

- (NSUInteger)age {

    return _age;

}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.

    age = 19;

    _age = 18;
    self.age = 20;
    NSLog(@"self.age = %lu", (unsigned long)self.age);

}

@end
```

添加 `@synthesize age = _age;` 代码就是告诉 Xcode 帮我把  `age` 改成 `_age` 并生成相应的实例变量，属性的错误就可以修复了；

> 当然 `age` 那个错误可以直接忽略，因为压根就不会有它的出现；

当然如果只手动做一个方法的实现：<br />
![][img-09]

因为这里 age 默认是 readwrite 的，所以肯定还有两个方法（存取），如果只手动实现其中一个，就相当于告诉 Xcode 我还有一个方法你帮我实现了吧；

那么如果属性是 `readonly` 的呢？

![][img-10]

如果是 `readonly` 的属性声明，只可以有读取方法（getter），所以你手动实现了它的 getter 方法，其实和 `readwrite` 情况下手动实现 setter 和 getter 的情况是一样一样的；

**让错误消失** <br />
![][img-11]

同样地，添加 `@synthesize age = _age;` 即可；

> 当然，它是没有 setter 方法的，你也想要有，也可以任性地自己写一个，但是 readonly 为什么不改成 readwrite 呢？

- 实例变量和存取方法都写了的情况

![][img-12]

我觉得这个很明显了， Xcode 不会帮你生成 实例变量 + 存取方法（声明加实现）；

如果加个 `@dynamic age;` 呢？运行时挂 了：<br />
![][img-13]

**不可以挂**

![][img-14]

前者 setter Xcode 自动合成了，而后者是没有合成，现在应该知道 `@dynamic` 的用意了吧。


---

#### 三、属性声明的可选选项 ( 关键字 )

##### 1. 方法名类关键字解析

###### `@property ( setter = Age: ) int age;`

其中 **` Age: `** 就是新的方法名，它其实是一个 selector ；它会替换默认生成的 **` setAge: `** 方法；

当然 getter 也是这样使用；

##### 2. 读写权限类关键字解析

- readonly，只读只生成相应的 getter 方法，以及带下划线的实例变量；

###### `@property ( readonly ) int age;`

- readwrite，生成 setter 、getter 方法，以及带下划线的实例变量；

###### `@property ( readwrite ) int age; -- a`

###### `@property  int age; -- b`

a、b 结果是一样的，原因是 `readwrite` 是默认的读写权限；
它们都生成了，setAge: 、age 存取方法的声明和实现，`_age` 实例变量；

##### 3. 赋值操作类关键字解析 【重点】

> **1) `assign、unsafe_unretained`，仅用于基础数据类型（ C 类型）** <br />
**2) `retain、strong、weak、copy`，仅用于 OC 对象**

###### setter 、getter 方法的区别：

- `assign` 与 `unsafe_unretained`
  - 变量直接赋值
  - `assign` 可用于 MRC/ARC ，而 `unsafe_unretained` 只能用于 ARC ;
  - setter、getter 方法：

```
// 属性声明
@property ( nonatomic, assign) int age;
//  MRC 环境下，它们相同 @property ( nonatomic ) int age;
// setter 的自动实现
    - (void)setAge:(int)age {
      _age = age;
  }
// getter 的自动实现
    - (int)age {
      return _age;
}
```

```
// 属性声明
@property ( nonatomic, unsafe_unretained ) int age;
// setter 的自动实现
    - (void)setAge:(int)age {
      _age = age;
  }
// getter 的自动实现
    - (int)age {
      return _age;
}
```

- `retain` 与 `strong`
  - 变量被持有，前者对应对象的内存计数器加 1 ，后者对应对象会被强引用；
  - `retain` 只用于 MRC ，而 `strong` 只能用于 ARC ，且 ARC 默认的赋值关键字为 `strong`;
  - setter、getter 方法：

```
// 属性声明
@property ( nonatomic, retain) NSObject *obj;
// setter 的自动实现
    - (void)setObj:(NSObject *)obj{
      if ( _obj != obj ) {
        [_obj release];
        _obj = [obj retain];
      }
  }
// getter 的自动实现
    - (NSObject *)obj{
      NSObject *objTemp = [ [ _obj retain ] autorelease ];
      return objTemp;
}
```

```
// 属性声明
@property ( nonatomic, strong) NSObject *obj;
// 相同， @property ( nonatomic ) NSObject *obj;
// setter 的自动实现
    - (void)setObj:(NSObject *)obj{
      _obj = obj;  // 这里默认有 __strong 修饰
                   // __strong _obj = obj;
  }
// getter 的自动实现
    - (NSObject *)obj{
      return _obj ;
}
```

- `weak`
  - 变量不被持有，对应对象会被弱引用与 `strong` 相对；
  - `weak` 只能用于 ARC `，weak` 修饰的对象在被销毁的时候，对应的对象指针会自动置为 `nil`;
  - setter、getter 方法：

```
// 属性声明
@property ( nonatomic, weak) NSObject *obj;
// setter 的自动实现
    - (void)setObj:(NSObject *)obj{
      __weak _obj = obj;
  }
// getter 的自动实现
    - (NSObject *)obj{
      return _obj ;
}
```

- `copy`
  - 深度拷贝对象（相当于创建了新的实例对象），是不可变副本；
  - `copy` 只能用于遵守了 `NSCopying` 的对象 ，不然会出错; MRC 、ARC 环境下均可用；
  - setter、getter 方法：

```
// MRC 下：
// 属性声明
@property ( nonatomic, copy ) NSObject *obj;
// setter 的自动实现
    - (void)setObj:(NSObject *)obj{
      if ( _obj != obj ) {
        [_obj release];
        _obj = [obj copy];
      }
  }
// getter 的自动实现
    - (NSObject *)obj{
      NSObject *objTemp = [ [ _obj retain ] autorelease ];
      return objTemp;
}
```

```
// ARC 下：
// 属性声明
@property ( nonatomic, copy ) NSObject *obj;
// setter 的自动实现
    - (void)setObj:(NSObject *)obj{
      _obj = [obj copy];
  }
// getter 的自动实现
    - (NSObject *)obj{
      return _obj ;
}
```

> 注意：**`@property ( nonatomic, copy ) NSMutableArray *mArray;`** 这种声明真的是自己挖坑了；你要的是可变对象，但是一 copy 就是不可变对象了，运行时会出问题的；

##### 4. 原子性操作类关键字解析

- `atomic`
  - 原子性，存取方法均加锁保护，保证原子性；
  - 线程安全，但低效，MRC 、ARC 环境下均可用；
  - setter、getter 方法：【`copy` 关键字作为例子，就是在原来的基础上加锁】

```
// MRC 下：
// 属性声明
@property ( nonatomic, copy ) NSObject *obj;
// setter 的自动实现
    - (void)setObj:(NSObject *)obj{
      [_ex lock];
      if ( _obj != obj ) {
        [_obj release];
        _obj = [obj copy];
      }
      [_ex unlock];
  }
// getter 的自动实现
    - (NSObject *)obj{
      [_ex lock];
      NSObject *objTemp = [ [ _obj retain ] autorelease ];
      [_ex unlock];
      return objTemp;
}
```

```
// ARC 下：
// 属性声明
@property ( nonatomic, copy ) NSObject *obj;
// setter 的自动实现
    - (void)setObj:(NSObject *)obj{
      [_ex lock];
      _obj = [obj copy];
      [_ex unlock];
  }
// getter 的自动实现
    - (NSObject *)obj{
      return _obj ;
}
```

- `nonatomic`
  - 非原子性，存取方法不加锁保护；
  - 线程不安全，但高效，MRC 、ARC 环境下均可用；
  - setter、getter 方法：【`copy` 关键字作为例子】

```
// 其实上面的例子已经很多了，所以这里就不贴代码了
```

##### 5. 类属性关键字解析【 OC 新增】

- `class` 关键字是表示定义的变量是类变量，就是元类的变量；
- 那么相应地，它的存取方法当然就是类方法了；
- 它永远不会自动合成，所以类变量、类存取方法，都要自己手动实现；
- setter、getter 方法：

```
@property ( nonatomic, class) int age;
@property ( nonatomic, class) NSObject *obj;
```

- Ep:

```
#import "ViewController.h"
@interface ViewController ()
@property (class, nonatomic) int number;
@end
```

```
@implementation ViewController
@dynamic number;
static int __number = -1;
  - (void)setNumber:(int)n {
    __number = n;
}
  - (int)number {
    return __number;
}
 - (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    self.number = 77;
    NSLog(@"number %@", @(self.number));
}
@end
```

- EP2：

![][img-15]

![未手动实现相应方法][img-16]

- 解决问题：

增加一句代码即可。

![][img-17] <br />
但是是不会生成 `_name` 这个变量的，要自己手动添加， <br />
![][img-18]

![][img-19]

如果其它文件要使用到这个变量怎么调取【自身调取同理】：<br />
![失败【废话】][img-20]

![木有哦][img-21]

都说是类属性了，肯定用类调用嘛，试试啊~~~

![类方法的提示证明有相关的方法声明][img-22]

![外部调用][img-23]

![内部调用][img-24]

好兴奋啊~~~

![挂了][img-25]

就是告诉自己写 Get Set 方法吧，Xcode 只是声明一下而已：<br />
![增加相应的类方法][img-26]

再试一下，<br />
![成功了][img-27]

##### 6. 空类关键字解析

**它们只能用于指针变量，当然实例对象肯定是可以用的咯** <br />
![][img-28]

![][img-29]

Xcode7 iOS9 OC新增 `nonnull/nullable/null_resettable/null_unspecified`

- `nonnull`
  - 指针变量不可以为空`（nil/Nil/NULL）`；
  - setter、getter 方法不变；

> 补充：如果声明的属性有多个是需要 nonnull 修饰的话，可以使用一对宏来简化属性代码：
> ```
> // NS_ASSUME_NONNULL_BEGIN
> #define NS_ASSUME_NONNULL_BEGIN _Pragma("clang assume_nonnull begin")
> // NS_ASSUME_NONNULL_END   
> #define NS_ASSUME_NONNULL_END   _Pragma("clang assume_nonnull end")
> ```

Ep:

```
#import "ViewController.h"
//
@interface ViewController ()
NS_ASSUME_NONNULL_BEGIN
@property (nonatomic) NSUInteger *number;
@property (nonatomic) NSObject *obj;
@property (nonatomic) NSObject *obj1;
@property (nonatomic) NSObject *obj2;
@property (nonatomic) NSObject *obj3;
@property (nonatomic) NSObject *obj4;
@property (nonatomic) NSObject *obj5;
NS_ASSUME_NONNULL_END
@property (nonatomic) NSObject *obj6;
@end
//
@implementation ViewController
//
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    //
    self.number = nil;
    self.obj = nil;
    self.obj6 = nil;
    //
}
//
@end
```

![][img-30]

![][img-31]

- `nullable`
  - 指针变量可以为空`（nil/Nil/NULL）`；
 - setter、getter 方法不变；

- `null_resettable`

![][img-32]

![][img-33]

- setter 可以是 `nil`，但 getter 不能返回`nil`;
- 重写 setter 或 getter 方法，警告都会取消，但是正确的做法是重写 getter 方法处理返回 `nil` 的情况;

Ep:

```
#import "ViewController.h"
//
@interface ViewController ()
@property (nonatomic, null_resettable) NSString *obj;
@end
//
@implementation ViewController
//
//- (void)setObj:(NSString *)obj {
//
//    if ([obj isEqualToString:@""]) {
//        _obj = @"Hello !";
//    }
//    
//}
//
- (NSString *)obj {
    //
    if (_obj == nil) {
        _obj = @"Hello !";
    }
    //
    return _obj;
    //
}
//
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    //
    self.obj = nil;
    //
}
//
@end
```

- `null_unspecified（_Null_unspecified）`
  - 不确定是否为空；
  - `_Null_unspecified` 是 Xcode 6.3 开始使用的，`null_unspecified` Xcode 8 开始使用，并能写进 `@property` 的选项列表中；

Ep【 Xcode 7， iOS 9】:

```
#import "ViewController.h"
//
@interface ViewController ()
@property (nonatomic)  NSString * _Null_unspecified obj;
@end
//
@implementation ViewController
//
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    //
    self.obj = nil;
    //
}
//
@end
```

Ep【 Xcode 8， iOS 10】:

```
#import "ViewController.h"
//
@interface ViewController ()
@property (nonatomic, null_unspecified)  NSString * obj;
@end
//
@implementation ViewController
//
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    //
    self.obj = nil;
    //
}
//
@end
```

> 补充：有一些关键字当然也可以用于变量声明那里咯，大体有那些，你可以试试；

```
#import "ViewController.h"
//
@interface ViewController ()
@property (nonatomic)  NSString * const obj;
@property (nonatomic)  __weak NSString * obj2;
@property (nonatomic)   NSString * _Nonnull  obj3;
@end
//
@implementation ViewController
//
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    //
    self.obj = nil;
    //
}
//
@end
```

---

#### 四、属性的 Runtime 实现

核心内容在 <objc/runtime.h> 中：<br />
![][img-34]

核心参考《Objective-C Runtime Programming Guide》：<br />
![][img-35]

##### 1. 属性在Runtime 的内部实现

- 属性的定义

```
typedef struct objc_property *Property;
```

```
/// An opaque type that represents an Objective-C declared property.
typedef struct objc_property *objc_property_t;
```

`objc_property` 就是属性的真正类型，是一个结构体，下面看看它的属性描述定义：

```
/// Defines a property attribute
typedef struct {
    const char *name;           /**< The name of the attribute */
    const char *value;          /**< The value of the attribute (usually empty) */
} objc_property_attribute_t;
```

`objc_property_attribute_t` 是用于描述属性的，就是存储属性的信息；

- 属性的获取
  - 获取类的属性列表（所有属性）

`class_copyPropertyList` --> 拷贝类声明的所有属性

```
  /**
   * 类中声明的所有属性
   *
   * @param cls 你想检查的类.
   * @param outCount 存储属性的总数量
   *  如果类中没有声明属性，那么 outCount 的值不会被改变   
   *
   * @return objc_property_t * 数组
   *  超类中的属性声明不会包含在里面
   *  终端会持续持有这些数组元素，所以不用的时候要用 free() 释放掉
   *
   *  如果类中没有声明属性或 cls = Nil ，那么返回 NULL，且 outCount = 0
    */
OBJC_EXPORT objc_property_t *class_copyPropertyList(Class cls, unsigned int *outCount)
    OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0);
```

下面这两个是针对 `protocol` 的：

`protocol_copyPropertyList` --> 拷贝协议中声明的所有属性

```
  /**
   * 返回协议中声明的所有实例属性声明
   *
   * @note 同于
   * \code
   * protocol_copyPropertyList2(proto, outCount, YES, YES);
   * \endcode
   */
OBJC_EXPORT objc_property_t *protocol_copyPropertyList(Protocol *proto, unsigned int *outCount)
    OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0);
```

`protocol_copyPropertyList2` --> 功能同上，只不过它可以区分类属性和实例属性

```
  /**
   * 返回协议中声明的所有的属性
   *
   * @param proto 协议
   * @param outCount 存储属性声明的总数
   * @param isRequiredProperty \c YES 返回要求的属性, \c NO 返回可选的属性.
   * @param isInstanceProperty \c YES 返回实例属性, \c NO 返回类属性.
     *
     * @return 是一个 C 类型的指针数组
     *  其它采纳了此协议的协议里面的属性声明不会包含在这里.
     *  终端会持续持有这些数组元素，所以不用的时候要用 free() 释放掉
     *  如果类中没有声明属性或 cls = Nil ，那么返回 NULL，且 outCount = 0
  */
OBJC_EXPORT objc_property_t *protocol_copyPropertyList2(Protocol *proto, unsigned int *outCount, BOOL isRequiredProperty, BOOL isInstanceProperty)
    OBJC_AVAILABLE(10.12, 10.0, 10.0, 3.0);
```

  - 获取单个属性

`class_getProperty` --> 获取类的某个属性声明

```
  /**
   * 根据提供的类和属性名返回属性
   *
   * @param cls 类
   * @param name 属性名
   *
   * @return objc_property_t * 指向的属性
   * 如果 cls = Nil 或者 没有声明相应的属性，都会返回 NULL
   */
OBJC_EXPORT objc_property_t class_getProperty(Class cls, const char *name)
    OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0);
```

`protocol_getProperty` --> 获取协议的某个属性声明

```
  /**
   * 根据 protocol 返回指定的属性
   *
   * @param proto 协议
   * @param name 属性名
   * @param isRequiredProperty \c YES 返回要求的属性, \c NO 返回可选的属性.
   * @param isInstanceProperty  \c YES 返回实例属性, \c NO 返回类属性.
   *
   * @return 根据参数列表的信息返回相应的属性
   *  如果协议没有声明相应的属性会返回 NULL
   */
OBJC_EXPORT objc_property_t protocol_getProperty(Protocol *proto, const char *name, BOOL isRequiredProperty, BOOL isInstanceProperty)
    OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0);
```

  - 获取单个属性的具体信息

```
属性的相关方法
```

`property_getName` --> 获取属性声明的属性名

```
  /**
   * 返回属性名
   *
   * @param property 属性
   *
   * @return 是一个描述属性名的 C 字符串
   */
OBJC_EXPORT const char *property_getName(objc_property_t property)
    OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0);
```

`property_getAttributes` --> 获取属性声明的属性特征

```
  /**
   * 返回属性的特征的字符串
   *
   * @param property 属性
   *
   * @return 是一个描述属性的特征的 C 字符串
   *
   * @note 关于特征字符串的格式在 《Objective-C Runtime Programming Guide》 Declared Properties 一节有描述
   */
OBJC_EXPORT const char *property_getAttributes(objc_property_t property)
    OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0);
```

`property_copyAttributeList` --> 拷贝属性声明的所有属性特征

```
  /**
   * 返回属性的特征字符串数组
   *
   * @param property 要拷贝属性特征的属性
   * @param outCount 属性特征总数
   *
   * @return 属性特征的 C 数组，不再使用的时候要使用 free() 释放资源
   */
OBJC_EXPORT objc_property_attribute_t *property_copyAttributeList(objc_property_t property, unsigned int *outCount)
    OBJC_AVAILABLE(10.7, 4.3, 9.0, 1.0);
```

`property_copyAttributeValue` --> 拷贝属性声明的所有属性特征值

```
  /**
   * 根据属性的特征名返回属性特征的值
   *
   * @param property 属性
   * @param attributeName C 字符串的属性特征名
   *
   * @return 返回 C 字符串形式的特征值，如果 attributeName 没有找到就会返回 nil;
   */
OBJC_EXPORT char *property_copyAttributeValue(objc_property_t property, const char *attributeName)
    OBJC_AVAILABLE(10.7, 4.3, 9.0, 1.0);
```

- 变量的相关方法

```
实例变量的相关方法
```

`ivar_getName` --> 获取实例变量的变量名

```
  /**
   * 返回实例变量的变量名
   *
   * @param v 实例变量
   *
   * @return C 字符串形式的实例变量的变量名
   */
OBJC_EXPORT const char *ivar_getName(Ivar v)
    OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0);
```

`ivar_getTypeEncoding` --> 获取实例变量的变量类型

```
  /**
   * 返回实例变量的变量类型
   *
   * @param v 实例变量
   *
   * @return C 字符串形式的实例变量的变量类型
   *
   * @note 对于变量的可用类型查看《 Objective-C Runtime Programming Guide 》 Type Encodings 一节
   */
OBJC_EXPORT const char *ivar_getTypeEncoding(Ivar v)
    OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0);
```

`ivar_getOffset` --> 获取实例变量的内存偏移量

```
  /**
   * 返回实例变量的内存偏移量
   *
   * @param v 实例变量
   *
   * @return 实例变量的内存偏移量
   *
   * @note 如果是对象类型的实例，就要使用 object_getIvar 来替换这个方法进行访问内存偏移量
   */
OBJC_EXPORT ptrdiff_t ivar_getOffset(Ivar v)
    OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0);
```

- 应用例子

```
// 假设有一个类，类名为 ViewController
//
{
      Class cls = objc_getClass("ViewController");
      int propertiesCount = -1;
      objc_property_t *properties = class_copyPropertyList(&propertiesCount);
      for (int i = 0, i < propertiesCount, i++) {
            objc_property_t property = properties [i];
            NSLog(@"i --> Name: %s, Attributes: %s", property_getName(property), property_getAttributes(property));
      }
}
```

##### 2. `protocol & category` 的应用（关联对象）


**重复：如果声明并实现了属性的存取方法就等同于实现了属性；**

`objc_setAssociatedObject` --> 设置指定实例对象的关联值

```
/**
 * 根据实例对象（object）、key 、policy 关联一个值
 *
 * @param object 要关联的实例对象
 * @param key 用于关联的 key
 * @param value 要关联的值，传入 nil 就相当于重置关联值
 * @param policy setter 方法的行为，详细的要查看《 Objective-C Runtime Programming Guide 》 “Associative Object Behaviors.” 一节
 *
 * @see objc_setAssociatedObject
 * @see objc_removeAssociatedObjects
 */
OBJC_EXPORT void objc_setAssociatedObject(id object, const void *key, id value, objc_AssociationPolicy policy)
    __OSX_AVAILABLE_STARTING(__MAC_10_6, __IPHONE_3_1);
```

> 补充：Associative Object Behaviors 的内容
>
> 描述：就是一个枚举类型，不过里面的值比较特殊而已
> ```
> enum {
>   OBJC_ASSOCIATION_ASSIGN = 0,
>   OBJC_ASSOCIATION_RETAIN_NONATOMIC = 1,
>   OBJC_ASSOCIATION_COPY_NONATOMIC = 3,
>   OBJC_ASSOCIATION_RETAIN = 01401,
>   OBJC_ASSOCIATION_COPY = 01403
> };
> ```
> OBJC_ASSOCIATION_ASSIGN --> assign / weak ，直接赋值；
> OBJC_ASSOCIATION_RETAIN_NONATOMIC  --> retain / strong 持有对象，非原子性，线程不安全；
> OBJC_ASSOCIATION_COPY_NONATOMIC  --> 拷贝不可变副本，非原子性，线程不安全；
> OBJC_ASSOCIATION_RETAIN  --> retain / strong 持有对象，原子性，线程安全；
> OBJC_ASSOCIATION_COPY  --> 拷贝不可变副本，原子性，线程安全；

`objc_getAssociatedObject` --> 获取指定实例对象的关联值

```
/**
 * 根据实例对象和关联的 key 返回相应的关联值
 *
 * @param object 实例对象
 * @param key 关联的 key
 *
 * @return 指定实例对象的关联值
 *
 * @see objc_setAssociatedObject
 */
OBJC_EXPORT id objc_getAssociatedObject(id object, const void *key)
    __OSX_AVAILABLE_STARTING(__MAC_10_6, __IPHONE_3_1);
```

`objc_removeAssociatedObjects` --> 移除实例对象的所有关联值

```
/**
 * 移除实例对象的所有关联值
 *
 * @param object 实例对象
 *
 * @note 这个方法的核心目的是为了方便让实例对象的所有关联值还原到初始状态；你不应该使用此方法来对一个关联值的进行还原，而应使用 objc_setAssociatedObject 写入 nil 来达到此目的。
 *
 * @see objc_setAssociatedObject
 * @see objc_getAssociatedObject
 */
OBJC_EXPORT void objc_removeAssociatedObjects(id object)
    __OSX_AVAILABLE_STARTING(__MAC_10_6, __IPHONE_3_1);
```

Ep:

![][img-36]

```
#import <UIKit/UIKit.h>

@interface UIViewController (Test)

- (void)setTestValue:(NSString *)test;
- (NSString *)testValue;

@end
```

```
#import "UIViewController+Test.h"
#import <objc/runtime.h>

static const void * TestValueKey = &TestValueKey;

@implementation UIViewController (Test)

- (void)setTestValue:(NSString *)test {

    objc_setAssociatedObject(self, TestValueKey, test, OBJC_ASSOCIATION_COPY_NONATOMIC);

}

- (NSString *)testValue {

    return objc_getAssociatedObject(self, TestValueKey);

}

@end
```

具体使用：

![][img-37]

```
#import "ViewController.h"
#import "UIViewController+Test.h"

@interface ViewController ()
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.

    self.testValue = @"Test Runtime Associated";
    NSLog(@"testValue : %@", self.testValue);

}

@end
```

- Category 前向引用

Cocoa 没有任何真正的私有方法。只要知道对象支持的某个方法的名称，即使该对象所在的类的接口中没有该方法的声明，你也可以调用该方法。不过这么做编译器会报错，但是只要新建一个该类的类别，在类别.h文件中写上原始类该方法的声明，类别.m文件中什么也不写，就可以正常调用私有方法了。这就是传说中的私有方法 **前向引用** 。 所以说cocoa没有真正的私有方法。
—— [来自文章《类别(Category)的作用（二）---对私有方法的前向引用》](http://blog.csdn.net/xubinlxb/article/details/52077877)

---

#### 五、参考书籍、文章

《 Objective-C 编程全解 》第3版 <br />
[《Objective-C Runtime Programming Guide》](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Introduction/Introduction.html) <br />
[《runtime之玩转成员变量》](http://www.cnblogs.com/develop-SZT/p/5348364.html) <br />
[《Objective-C Runtime 运行时之二：成员变量与属性》](http://www.cocoachina.com/ios/20141105/10134.html) <br />
[《Swift 3.0 令人兴奋，但Objective-C也有小改进--Objective-C的类属性》](http://www.cocoachina.com/ios/20161202/18257.html) <br />
[《iOS9的几个新关键字（nonnull、nullable、null_resettable、__null_unspecified）》](http://www.cnblogs.com/alan12138/p/5620021.html) <br />
[《Objective—C语言的新魅力——Nullability、泛型集合与类型延拓》](https://my.oschina.net/u/2340880/blog/514804)

[img-00]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/00 OC 的属性概念.png" | relative_url }}     
[img-01]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/01 Property 的书写格式.png" | relative_url }}  
[img-02]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/02 Property 的组成.png" | relative_url }}  
[img-03]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/03.png" | relative_url }}
[img-04]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/04.png" | relative_url }}     
[img-05]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/05.png" | relative_url }}  
[img-06]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/06.png" | relative_url }}  
[img-07]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/07.png" | relative_url }}  
[img-08]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/08.png" | relative_url }}     
[img-09]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/09.png" | relative_url }}  
[img-10]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/10.png" | relative_url }}  
[img-11]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/11.png" | relative_url }}  
[img-12]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/12.png" | relative_url }}     
[img-13]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/13.png" | relative_url }}  
[img-14]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/14.png" | relative_url }}  
[img-15]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/15.png" | relative_url }}
[img-16]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/16 未手动实现相应方法.png" | relative_url }}     
[img-17]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/17.png" | relative_url }}  
[img-18]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/18.png" | relative_url }}  
[img-19]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/19.png" | relative_url }}  
[img-20]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/20 失败_废话_.png" | relative_url }}     
[img-21]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/21 木有哦.png" | relative_url }}
[img-22]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/22 类方法的提示证明有相关的方法声明.png" | relative_url }}     
[img-23]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/23 外部调用.png" | relative_url }}  
[img-24]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/24 内部调用.png" | relative_url }}  
[img-25]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/25 挂了.png" | relative_url }}
[img-26]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/26 增加相应的类方法.png" | relative_url }}     
[img-27]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/27 成功了.png" | relative_url }}  
[img-28]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/28.png" | relative_url }}  
[img-29]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/29.png" | relative_url }}  
[img-30]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/30.png" | relative_url }}     
[img-31]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/31.png" | relative_url }}  
[img-32]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/32.png" | relative_url }}  
[img-33]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/33.png" | relative_url }}  
[img-34]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/34.png" | relative_url }}     
[img-35]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/35.png" | relative_url }}  
[img-36]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/36.png" | relative_url }}  
[img-37]:{{ "blogs/coding/iOS/Objective_C/images/Objective-c-知识总结----@property/37.png" | relative_url }}
