---
layout: post
title:  "Objective-C 之 NSDictionary 学习笔记（iOS-9-1）"
toc: true
date:  2016-01-03 21:37
cover: "assets/images/maincontent/post/cover.jpg"
box_cover: "assets/images/maincontent/post/default.jpg" # 文章的第一张图片
vfpage_collection_tags: Objective_C
tags: Objective_C iOS NSDictionary
categories: Coding iOS Objective_C
---

## NSDictionary类简介

	 1. 以key-object的形式保存数据，是一个集合类（collection）
	 2. 词典中词条的保存是无序的
	 3. 不可变词典（内容一旦init后就不能更改）
	 4. 既然不能更改，当然就不能进行删除、替换、增加操作，只能查询
	 5. key值不能重复

## 属性表（@property）

**@property**     | **描述**
 :-------- | :--- |
@property(readonly) NSUInteger count | 词典词条的 **数量**
@property(readonly, copy) NSArray < KeyType > `*allKeys`    | 词典的所有 **键值**（数组）
@property(readonly, copy) NSArray < ObjectType > `*allValues` | 词典的所有 **词条**（数组）
@property(readonly, copy) NSString `*description` | 描述词典内容的字符串（plist格式）
@property(readonly, copy) NSString `*descriptionInStringsFileFormat` | 描述.string格式文件的词典内容的字符串

***

## 常用方法

### 常用类方法

#### 词典对象的生成

```
+ (instancetype)dictionary // 生成并返回一个空的词典对象
```

```
+ (instancetype)dictionaryWithObject:(ObjectType)anObject forKey:(id<NSCopying>)aKey // 根据akey和anObject返回一个词典对象
```

### 常用实例方法

#### 词典对象的初始化

```
- (instancetype)initWithObjects:(NSArray<ObjectType>
*)objects forKeys:(NSArray<id<NSCopying>> *)keys //分别从objects和keys数组中取出一个元素作为 key - object 键值对，并返回包含该键值对的词典对象
```

> 便利构造器：dictionaryWithObjects : forKeys :

---

```
- (instancetype)initWithObjects:(const ObjectType _Nonnull
[])objects forKeys:(const id<NSCopying> _Nonnull [])keys
count:(NSUInteger)count	//用objects和keys数组的元素来生成count条词条的词典对象
```

> 便利构造器：dictionaryWithObjects : forKeys : count :

---

```
- (instancetype)initWithObjectsAndKeys:(id)firstObject, ... //使用指定的object - key来创建词典对象，以nil作为结束
```

> 便利构造器：dictionaryWithObjectsAndKeys :

---

```
- (instancetype)initWithDictionary:
(NSDictionary<KeyType,ObjectType> *)otherDictionary //用一个已经存在的词典对象创建一个词典对象（注：此处的otherDictionary可以是可变词典对象）
```

> 便利构造器：dictionaryWithDictionary :

---

#### 词典对象的访问

```
- (NSUInteger) count //返回词条数量
```

```
- (ObjectType)objectForKey:(KeyType)aKey //返回akey对应的值，若不存在则返回nil
```

```
- （NSArray <KeyType> *）allKeys //返回词典中所有对象的key
```

```
- （NSArray <KeyType> *）allValues //返回词典中所有的值对象
```

```
- (NSEnumerator<ObjectType> *)keyEnumerator //返回一个可以快速访问词典中所有关键字的 快速枚举器
```

```
- (NSEnumerator<ObjectType> *)objectEnumerator //返回一个可以快速访问词典中所有值对象的 快速枚举器
```

```
- (NSArray<KeyType> *)allKeysForObject:(ObjectType)anObject //返回词典中所有值对象为anObject的key数组
```

---

#### 词典对象的比较

```
- (BOOL)isEqualToDictionary:
(NSDictionary<KeyType,ObjectType> *)otherDictionary //如果两个词典的词条数和key - object都是一样就返回YES
```

---

#### 词典对象，文件输入与输出

```
- (NSString *)description //以ASCII编码的属性列表格式输出词典的词条
```

---

```
- (NSDictionary<KeyType,ObjectType>*)initWithContentsOfFile:(NSString *)path //根据属性列表格式保存的文件来初始化词典对象
```

> 便利构造器：dictionaryWithContentsOfFile:

---

```
- (BOOL)writeToFile:(NSString *)path atomically:(BOOL)flag //把代表这个词典内容的属性列表输出到指定的文件（flag是控制写入的，如果为YES则表示完全写入）
```

> 参考方法：writeToFile: atomically: encoding: error:

---

#### 词典对象的遍历

```
for (... in ...) {
   ...
}
```

```
- (void)enumerateKeysAndObjectsUsingBlock:(void (^)(KeyType
key, ObjectType obj, BOOL *stop))block
```

---

## 词典对象，小试牛刀

```
//Xcode 7.2
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {

        //1.词典对象的生成
        NSDictionary *dict = [NSDictionary dictionary]; //返回空的词典对象
        NSLog(@"dict --> %@",[dict description]);    //打印对象的内容，返回一个字符串“{ 内容在这 }”
        //1.1 返回一个以dict - dict1(key - object)的词典对象
        NSDictionary *dict1 = [NSDictionary dictionaryWithObject:@"dict1" forKey:@"dict"];
        NSLog(@"dict1 --> %@",[dict1 description]);
        //1.2 返回一个以dict - 1(key - object)的词典对象 （@1，是指NSValue 1）
        NSDictionary *dict1_1 = [NSDictionary dictionaryWithObject:@1 forKey:@"dict"];
        NSLog(@"dict1_1 --> %@",[dict1_1 description]);

        //2.词典对象的初始化
        //2.1 返回一个以@[@"-1-",@"-2-",@"-3-"] - @[@1,@2,@3]为基础逐一创建的，“-1-” - 1，“-2-” - 2，“-3-” - 3共三条词条的词典对象
        NSDictionary *dict2 = [[NSDictionary alloc] initWithObjects:@[@1,@2,@3] forKeys:@[@"-1-",@"-2-",@"-3-"]];
        NSLog(@"dict2 --> %@",[dict2 description]);
        //2.2 IOS 8可以用，但IOS 9才行被搞死了 T_T
//        __unsafe_unretained NSArray * _Nonnull arryObjects = @[@"one",@"two",@"三"];
//        __unsafe_unretained NSArray * _Nonnull arrayKeys = @[@1,@2,@3];
//        NSDictionary *dict2_1 = [[NSDictionary alloc] initWithObjects:arryObjects forKeys:arrayKeys count:4];
//        NSLog(@"dict2_1 --> %@",[dict2_1 description]);
        //报错信息：Implicit conversion of an Objective-C pointer to 'const id  _Nonnull __unsafe_unretained *' is disallowed with ARC
        //2.3
        NSDictionary *dict2_2 = [[NSDictionary alloc] initWithObjectsAndKeys:@"object1", @"key1", @"object2", @"key2", nil];
        NSLog(@"dict2_2 --> %@",[dict2_2 description]);
        //2.4
        NSDictionary *dict2_3 = [[NSDictionary alloc] initWithDictionary:dict2_2];
        NSLog(@"dict2_3 --> %@",[dict2_3 description]);

        //3.词典对象的访问
        NSDictionary *dict3 = @{@1 : @"one", @2 : @"two", @3 : @[@"three",@"four"], @4 : @"one"};
        //3.1 词条的数量
        NSLog(@"dict3 --> %@,词条数：%lu",[dict3 description], [dict3 count]);
        //3.2 根据 key 寻找 object
        NSLog(@"dict3 --> %@", [dict3 objectForKey:@2]);
        NSLog(@"dict3 --> %@", [dict3 objectForKey:@3]);
        //3.3 返回包含所有key的数组
        NSArray *arryAllKeys = [dict3 allKeys];
        for (NSNumber *key in arryAllKeys) {
            NSLog(@"Allkeys --> %@", [key description]);
        }
        //3.4 返回一个枚举器
        NSEnumerator * enumer = [dict3 keyEnumerator];
        for (NSNumber *key in enumer) {
            NSLog(@"enumerkeys --> %@", [key description]);
        }
        //3.5 返回一个包含@“one”的所有关键字的数组
        NSArray *arryOneKeys = [dict3 allKeysForObject:@"one"];
        for (NSNumber *key in arryOneKeys) {
            NSLog(@"onekeys --> %@", [key description]);
        }

        //4.词典对象的比较
        NSDictionary *dict4_1 = @{@1 : @"one", @2 : @"two", @3 : @"three"};
        NSDictionary *dict4_2 = @{@1 : @"one", @2 : @"two", @3 : @"three"};
        NSDictionary *dict4_3 = @{@1 : @"one", @2 : @"two"};
        NSDictionary *dict4_4 = @{@1 : @"一", @2 : @"二", @3 : @"三"};
        //只有key和object完全一样才会返回YES
        [dict4_1 isEqualToDictionary:dict4_2] ? NSLog(@"dict4_1 & dict4_2: YES"): NSLog(@"dict4_1 & dict4_2: NO");
        [dict4_1 isEqualToDictionary:dict4_3] ? NSLog(@"dict4_1 & dict4_3: YES"): NSLog(@"dict4_1 & dict4_3: NO");
        [dict4_3 isEqualToDictionary:dict4_4] ? NSLog(@"dict4_3 & dict4_4: YES"): NSLog(@"dict4_3 & dict4_4: NO");

        //5.词典对象与文件操作
        //5.1 根据plist文件来创建词典
        NSDictionary *dict5 = [[NSDictionary alloc] initWithContentsOfFile:@"/Users/windy/Desktop/OC pros/NSDictionaryTest/dict.plist"];
        NSLog(@"dict5 --> %@", [dict5 description]);
        //5.2 把词典词条写进文件
        NSDictionary *dict5_1 = @{@"一" : @[@"one",@"one one"], @"二" : @3};
        [dict5_1 writeToFile:@"/Users/windy/Desktop/OC pros/NSDictionaryTest/dict2.plist" atomically:YES];
        //5.3 把词典词条读取出来,使用的是initWithContentsOfFile:的便利构造器dictionaryWithContentsOfFile:
        NSDictionary *dict5_2 = [[NSDictionary alloc] init];
        dict5_2 = [NSDictionary dictionaryWithContentsOfFile:@"/Users/windy/Desktop/OC pros/NSDictionaryTest/dict2.plist"];
        NSLog(@"dict5_2 --> %@", [dict5_2 description]);

        //6.利用block遍历词典
        NSDictionary *dict6 = @{@"china" : @"中国", @"Eng" : @"英国"};
        [dict6 enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
            NSLog(@"dict6 --> key - obj: %@ = %@", key, obj);
        }];
    }
    return 0;
}
```
