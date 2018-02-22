---
layout: post
title:  "Objective-C 之 NSArray 学习笔记（iOS-9-1）"
toc: true
date:  2016-01-03 21:41
cover: "assets/images/maincontent/post/cover.jpg"
box_cover: "assets/images/maincontent/post/default.jpg" # 文章的第一张图片
vfpage_collection_tags: Objective_C
tags: Objective_C iOS NSArray
categories: Coding iOS Objective_C
---

## NSArray类简介

1. 有序且只可以存储Objective-C对象的数组
2. 初始化后，内容不可变，长度也不可变，不能进行增、删、改操作
3. 不能存放nil (nil是标志数组的结束)
4. 在MRC模式下，会发送retain消息于每个加入数组中的元素都进行保持，数组被释放的时候会发送release消息

---

## 属性表（@property）

**@property**     | **描述**
 :-------- | :--- |
@property(readonly) NSUInteger count | 数组元素的 **个数**
@property(nonatomic, readonly) ObjectType firstObject    | 返回数组中的第一个元素
@property(nonatomic, readonly) ObjectType lastObject| 返回数组中的最后一个元素
@property(readonly, copy) NSData `*sortedArrayHint` | 用于排序
@property(readonly, copy) NSString `*description` | 返回数组的内容“（内容在这）”

***

## 常用方法

### 常用类方法

#### 数组对象的生成

```
+ (instancetype)array // 生成并返回一个空的数组对象
```

```
+ (instancetype)arrayWithObject:(ObjectType)anObject // 返回一个只有anObject的数组对象
```

### 常用实例方法

#### 数组对象的初始化

```
- (instancetype)initWithObjects:(ObjectType)firstObj, ... //返回以firstObj等元素生成的数组，以nil结束
```

> 便利构造器：arrayWithObjects:

---

```
- (instancetype)initWithObjects:(const ObjectType _Nonnull[])objects count:(NSUInteger)count	//返回包含前count个objects的数组
```

> 便利构造器：arrayWithObjects:count:

---

```
- (instancetype)initWithArray:(NSArray<ObjectType> *)anArray //使用anArray来生成一个新的数组
```

> 便利构造器：arrayWithArray:

---

```
- (instancetype)initWithArray:(NSArray<ObjectType> *)array copyItems:(BOOL)flag //falg为YES的时候，底层会使用copyWithZone:方法为每个array元素生成一个副本，并把新生成的副本数组返回
```

---

#### 数组元素的访问

```
- (NSUInteger) count //返回元素数量
```

```
- (NSUInteger)indexOfObject:(ObjectType)anObject //返回数组中元素为anObject的最小的下标（利用isEqual:方法进行比较）
```

```
- (BOOL)containsObject:(ObjectType)anObject //判断数组中是否有anObject元素，如果没有就返回NSNotFound（宏定义，就是没有找到的意思）
```

```
- (ObjectType)objectAtIndex:(NSUInteger)index //返回下标对应的元素（index大于数组的count时就发生NSRangeException异常）
```

```
@property(nonatomic, readonly) ObjectType lastObject //返回数组中的最后一个元素，如果没有接收者（就是没有取值操作）就返回nil
```

```
- (void)getObjects:(ObjectType _Nonnull [])aBuffer range:(NSRange)aRange //根据aRange指定的范围复制数组元素到C语言的aBuffer缓冲区中（aBuffer可以通过malloc进行创建）
```

```
- (NSArray<ObjectType> *)subarrayWithRange:(NSRange)range //返回根据aRange指定的范围从原数组中生成一个新的数组
```

---

#### 数组元素的比较

```
- (BOOL)isEqualToArray:(NSArray<ObjectType> *)otherArray //判断两个数组的元素是否一致（相同下标所对应的元素要相等）
```

```
- (ObjectType)firstObjectCommonWithArray:(NSArray<ObjectType> *)otherArray //返回消息接收者与otherArray第一个相同的元素
```

---

#### 添加新元素到数组（间接添加，返回一个新数组）

```
- (NSArray<ObjectType> *)arrayByAddingObject(ObjectType)anObject //返回一个由消息接收者和anObject共同组成的新数组（anObject加到新数组的末尾）
```

```
- (NSArray<ObjectType> *)arrayByAddingObjectsFromArray：(NSArray<ObjectType> *)otherArray //返回一个由消息接收者和otherArray共同组成的新数组（otherArray加到新数组的末尾）
```

***

#### 数组元素的排序

```
- (NSArray<ObjectType> *)sortedArrayUsingSelector:
(SEL)comparator //使用指定方法comparator（可以自定义，也可以使用对象本身拥有的方法；要求必须要有一个参数，且其返回值必须为以下三种情况中的一种：
 1. NSOrderedAscending  消息接收者元素 < 形参元素
 2. NSOrderedSame       消息接收者元素 == 形参元素
 3. NSOrderedDescending 消息接收者元素 > 形参元素
），返回排好序的新数组
```

```
- (NSArray<ObjectType> *)sortedArrayUsingFunction:
(NSInteger (*)(ObjectType, ObjectType, void *))comparator
context:(void *)context //使用指定的comparator方法（要求必须要有三个形式参数，前两个是数组中的元素，第三个元素是自定义形参；返回值是NSComparisonResult类型(NSInteger也行)，该类型的值就是前面方法中的NSOrderedSame等三者），返回一个排好序的新数组
```

***

#### 向数组中的元素发送消息

```
- (void)makeObjectsPerformSelector:(SEL)aSelector //为数组中的每一个元素发送一条消息（aSelector指定的方法），从数组的第一个元素依次发送到最后一个元素为止
//注意：
//  i: aSelector指定的方法不能有参数
// ii: 指定的方法发生波及作用（就是改变数组之类的操作）
//iii: 如果没有指定的方法会抛出NSInvalidArgumentException异常
```

```
- (void)makeObjectsPerformSelector:(SEL)aSelector
withObject:(id)anObject //为数组中的每一个元素发送一条消息（aSelector指定的方法），从数组的第一个元素依次发送到最后一个元素为止
//注意：
//  i: aSelector指定的方法只能有一个参数anObject
// ii: 指定的方法发生波及作用（就是改变数组之类的操作）
//iii: 如果没有指定的方法会抛出NSInvalidArgumentException异常
```

***

#### 数组的文件输入与输出操作

```
- (NSString *)description //以ASCII编码的属性列表格式输出数组的元素
```

---

```
- (NSArray<ObjectType> *)initWithContentsOfFile:(NSString *)aPath //根据属性列表格式保存的文件来初始化数组,aPath指文件路径
```

> 便利构造器：arrayWithContentsOfFile:

---

```
- (BOOL)writeToFile:(NSString *)path atomically:(BOOL)flag //把代表这个数组内容的属性列表输出到指定的文件中，path指点生成的文件的路径（flag是控制写入的，如果为YES则表示完全写入）
```

> 参考方法（NSString）：writeToFile: atomically: encoding: error:

***

```
- (NSString *)componentsJoinedByString:(NSString *)separator //把数组元素（以“,”分隔的元素）自第一个元素至最后一个元素用separator连接起来形成字符串（假设separatoro "-"即：firstObject-SecondObject...-LastObject）
```

```
- (NSArray<NSString *> *)pathsMatchingExtensions:(NSArray<NSString *> *)filterTypes //筛选具有特定扩展名的字符串，如：“.jpg”
```

***

#### 数组的遍历

```
- (NSEnumerator<ObjectType> *)objectEnumerator //返回一个枚举器，用于遍历数组
```

---

## 数组，小试牛刀

```
//Xcode 7.2
 #import <Foundation/Foundation.h>

@interface msgTest : NSObject
- (void)test;
- (void)oneTest:(NSNumber *)num;
@end

@implementation msgTest

- (void)test{

    NSLog(@"7 --> I am a msgTest class!");
}

- (void)oneTest:(NSNumber *)num{

    NSLog(@"7 --> num = %d", [num intValue]);
}

@end

//官方Demo
NSInteger intSort(id num1, id num2, void *context)
{
    int v1 = [num1 intValue];
    int v2 = [num2 intValue];
    if (v1 < v2)
        return NSOrderedAscending;
    else if (v1 > v2)
        return NSOrderedDescending;
    else
        return NSOrderedSame;
}

int main(int argc, const char * argv[]) {
    @autoreleasepool {

        //1.数组对象的生成
        //1.1 //返回空的数组对象
        NSArray *arry1_1 = [NSArray array];
        NSLog(@"arry1_1 --> %@",arry1_1);    //打印对象的内容，返回一个字符串“( 内容在这 )”
        //1.2 返回一个只有 @"你好！数组！" 元素的数组
        NSArray *arry1_2 = [NSArray arrayWithObject:@"你好！数组！"];
        NSLog(@"arry1_2 --> %@",[arry1_2 description]);

        //2.数组对象的初始化
        //2.1 返回一个以@[@"-1-",@"-2-",@"-3-"] - @[@1,@2,@3]为基础逐一创建的，“-1-” - 1，“-2-” - 2，“-3-” - 3共三条词条的词典对象
        NSArray *arry2_1 = [[NSArray alloc] initWithObjects:@3,@[@"oneObject",@"twoObject"], nil];
        NSLog(@"arry2_1 --> %@",arry2_1);
        //2.2 IOS 9.1可以用，但IOS 9.2 不可以了
//        NSArray *arry2_2 = [[NSArray alloc] initWithObjects:(const id  _Nonnull __unsafe_unretained *) count:(NSUInteger)]

        //2.3 根据arry2_1数组生成arry2_3
        NSArray *arry2_3 = [[NSArray alloc] initWithArray:arry2_1];
        NSLog(@"arry2_3 --> %@",arry2_3);
        //2.4 copeItem值为YES的时候会以arry为蓝本生成一个副本返回组arry2_4
        NSArray *arry = @[@"1", @"2", @"3", @"4"];
        NSArray *arry2_4 = [[NSArray alloc] initWithArray:arry copyItems:YES];
        NSLog(@"arry2_4 --> %@",arry2_4);

        //3.数组对象的访问--------------=====
        NSArray *arry3 = @[@1,@2,@3,@"4",@[@"1",@"2",@YES],@2.0f];//快速生成数组，只能用在NSArray处，因为生成的数组是不可变的
        //3.1 元素的数量
        NSLog(@"arry3 --> %@,词条数：%lu",arry3, [arry3 count]);
        //3.2 通过 object 获取相应的 index
        NSLog(@"arry3 --> %lu", [arry3 indexOfObject:@2]);
        NSLog(@"arry3 --> %lu", [arry3 indexOfObject:@YES]);
        //3.3 根据 index 获取相应的 object
        NSString *str = [arry3 objectAtIndex:3];
        NSArray *arryTemp = [arry3 objectAtIndex:4];
        NSLog(@"str = %@, arryTemp = %@", str, arryTemp);

        //3.4 获取数组中的第一个元素和最后一个元素                [NSNumber intValue] @property属性
        NSLog(@"firstObject = %d, lastObject = %@", [[arry3 firstObject] intValue], [arry3 lastObject]);

        //3.5 复制在原数组一个 aRange 范围的元素到一个C语言缓冲区，并返回由这些元素组成的一个新的数组
        //arry3 getObjects:(__unsafe_unretained id  _Nonnull *) range:(NSRange)

//         官方Demo,ARC模式下用不了

//         NSArray *mArray = arry3;// an array with at least six elements...;
//         id *cObject;
//         
//         NSRange range = NSMakeRange(2, 4);
//         cObject = malloc(sizeof(id) * range.length);
//         
//         [mArray getObjects:cObject range:range];
//         
//         for (int i = 0; i < range.length; i++) {
//         NSLog(@"objects: %@", cObject[i]);
//         }
//         free(cObject);

        //3.6 抽取原数组中 range 范围的元素并以此生成一个新的数组并返回
        NSRange range;      //创建一个 range 结构体
        range.location = 2;
        range.length   = 2;
        NSArray *arryOfArange = [arry3 subarrayWithRange:range];
        NSLog(@"arryOfArange = %@", arryOfArange);

        //4.数组元素的比较
        NSArray *arry4_1 = @[@1, @2, @3];
        NSArray *arry4_2 = @[@1, @2, @3];
        NSArray *arry4_3 = @[@2, @1];
        NSArray *arry4_4 = @[@4, @2, @3,@1];
        //4.1 两个数组元素完全一样才会返回YES
        [arry4_1 isEqualToArray:arry4_2] ? NSLog(@"arry4_1 & arry4_2: YES"): NSLog(@"arry4_1 & arry4_2: NO");
        [arry4_1 isEqualToArray:arry4_3] ? NSLog(@"arry4_1 & arry4_3: YES"): NSLog(@"arry4_1 & arry4_3: NO");
        [arry4_3 isEqualToArray:arry4_4] ? NSLog(@"arry4_3 & arry4_4: YES"): NSLog(@"arry4_3 & arry4_4: NO");

        //4.2 返回两个数组中第一个相同的元素
        NSLog(@"arry4_1 & arry4_2 : %@", [arry4_1 firstObjectCommonWithArray:arry4_2]);   //只返回index为 0 的元素 @1
        NSLog(@"arry4_1 & arry4_3 : %@", [arry4_1 firstObjectCommonWithArray:arry4_3]);   //只返回index为 1 的元素 @1
        NSLog(@"arry4_3 & arry4_4 : %@", [arry4_3 firstObjectCommonWithArray:arry4_4]);   //只返回index为 1 的元素 @2

        //5.向数组中增加元素
        NSArray *arry5 = [NSArray arrayWithObjects:@1,@2,@3,@4,nil];
        //5.1 返回一个由消息接收者和anObject共同组成的新数组（anObject加到新数组的末尾）
        NSLog(@"arry5 & object = %@", [arry5 arrayByAddingObject:@5]);

        //5.2 返回一个由消息接收者和otherArray共同组成的新数组（otherArray加到新数组的末尾）
        NSLog(@"arry5 & arry %@", [arry5 arrayByAddingObjectsFromArray:@[@"one",@"two"]]);

        //6.数组的排序
        NSArray *arryString = @[@"man",@"woman",@"cat",@"dog",@"fish"];
        NSArray *arryNumber = @[@5,@2,@8,@61,@1,@13];
//        6.1 使用指定方法comparator（可以自定义，也可以使用对象本身拥有的方法),返回排好序的新数组,要求:
//        (1).必须要有一个参数
//        (2).返回值必须为以下三种情况中的一种：
//            1). NSOrderedAscending  消息接收者元素 < 形参元素
//            2). NSOrderedSame       消息接收者元素 == 形参元素
//            3). NSOrderedDescending 消息接收者元素 > 形参元素
        //使用 NSString 自带的 compare: 方法
        NSArray *sortedStringArray = [arryString sortedArrayUsingSelector:@selector(compare:)];
        NSLog(@"sortedStringArray : %@", sortedStringArray);

        //6.2 使用指定的comparator方法,返回一个排好序的新数组,要求:
//        1).必须要有三个形式参数，前两个是数组中的元素，第三个元素是自定义形参；
//        2).返回值是NSComparisonResult类型(NSInteger也行)，该类型的值就是前面方法中的NSOrderedSame等三者)
        //应用于基本数据类型
        NSArray *sortedNumberArray = [arryNumber sortedArrayUsingFunction:intSort context:nil];
        NSLog(@"sortedNumberArray : %@", sortedNumberArray);

        //7.给数组中的元素发送消息
        msgTest *test1 = [[msgTest alloc] init];
        msgTest *test2 = [[msgTest alloc] init];
        msgTest *test3 = [[msgTest alloc] init];
        NSArray *arryPerforms = @[test1, test2, test3];
        //7.1 为数组中的每一个元素发送一条消息（aSelector指定的方法），从数组的第一个元素依次发送到最后一个元素为止
        //注意：
        //  i: aSelector指定的方法不能有参数
        // ii: 指定的方法发生波及作用（就是改变数组之类的操作）
        //iii: 如果没有指定的方法会抛出NSInvalidArgumentException异常
        [arryPerforms makeObjectsPerformSelector:@selector(test)];

        //7.2 为数组中的每一个元素发送一条消息（aSelector指定的方法），从数组的第一个元素依次发送到最后一个元素为止
        //注意：
        //  i: aSelector指定的方法只能有一个参数anObject
        // ii: 指定的方法发生波及作用（就是改变数组之类的操作）
        //iii: 如果没有指定的方法会抛出NSInvalidArgumentException异常
        [arryPerforms makeObjectsPerformSelector:@selector(oneTest:) withObject:@7];

        //8.数组对象与文件操作
        //8.1 根据plist文件来创建数组
        NSArray *arry8_1 = [NSArray arrayWithContentsOfFile:@"/Users/windy/Desktop/OC pros/NSArrayTest/NSArrayTest/arry8.plist"];
        NSLog(@"arry8_1 --> %@", [arry8_1 description]);
        //8.2 把数组元素写进文件
        NSArray *arry8_2 = @[@"你", @[@"love",@"someone"], @"好"];
        [arry8_2 writeToFile:@"/Users/windy/Desktop/OC pros/NSArrayTest/NSArrayTest/arry8_2.plist" atomically:YES];
        //8.3 把数组元素（以“,”分隔的元素）自第一个元素至最后一个元素用separator连接起来形成字符串
        //假设separatoro "-"即：firstObject-SecondObject...-LastObject
        NSString *strTemp = [arry8_2 componentsJoinedByString:@"?"];
        NSLog(@"strTemp --> %@", strTemp);

        //8.4 筛选具有特定扩展名的字符串，如：“jpg”等它会自动根据扩展名进行查找不能用“.jpg”
        NSArray *arry8_4 = @[@"c.jpg",@"jpg",@"card",@"A.jpg",@"car2.jpg"];
        NSArray *fliterArray = [arry8_4 pathsMatchingExtensions:[NSArray arrayWithObject:@"jpg"]];
        NSLog(@"fliterArray : %@", fliterArray);
        NSArray *arry8_5 = @[@"t.tif",@"c.jpg",@"ee.jpg",@"card",@"A.jpg",@"car2.jpg",@"2.png",@"a.png",@"tt.doc",@"doc",@"y.tif"];
        NSArray *fliterArray2 = [arry8_5 pathsMatchingExtensions:[NSArray arrayWithObjects:@".jpg",@"png",@"doc",@"tif",nil]];
        NSLog(@"fliterArray2 : %@", fliterArray2);
    }
        //9.数组元素的遍历(block)
        NSArray *arry9 = [NSArray arrayWithObjects:@1,@2,@3,nil];
        [arry9 enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            if (idx == 1) {
                *stop = YES;//stop是停止判断条件
            }
            //obj指代数组中的元素，如：@1
            NSLog(@"%d", [obj intValue]);
        }];
    return 0;
}
```
