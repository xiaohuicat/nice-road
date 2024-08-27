https://www.sequelize.com.cn/core-concepts/model-querying-basics

不错的教程：https://juejin.cn/post/7091485664868302862

# 简单INSERT查询

创建一个新用户

```
const jane = await User.create({ firstName: "Jane", lastName: "Doe" });
console.log("Jane's auto-generated ID:", jane.id);
```

Model.create() 方法是使用 Model.build() 构建未保存实例并使用 instance.save() 保存实例的简写形式.

也可以定义在 create 方法中的属性. 如果你基于用户填写的表单创建数据库条目,这将特别有用. 例如,使用它可以允许你将 User 模型限制为仅设置用户名和地址,而不设置管理员标志 (例如, isAdmin)：

```
const user = await User.create({
  username: 'alice123',
  isAdmin: true
}, { fields: ['username'] });
// 假设 isAdmin 的默认值为 false
console.log(user.username); // 'alice123'
console.log(user.isAdmin); // false
```

# 简单 SELECT 查询

你可以使用 findAll 方法从数据库中读取整个表：

```
// 查询所有用户
const users = await User.findAll();
console.log(users.every(user => user instanceof User)); // true
console.log("All users:", JSON.stringify(users, null, 2));
```

SELECT \* FROM ...

# SELECT 查询特定属性

选择某些特定属性,可以使用 attributes 参数：

```
Model.findAll({
  attributes: ['foo', 'bar']
});
```

SELECT foo, bar FROM ...

可以使用嵌套数组来重命名属性：

```
Model.findAll({
  attributes: ['foo', ['bar', 'baz'], 'qux']
});
```

你可以使用 sequelize.fn 进行聚合：

```
Model.findAll({
  attributes: [
    'foo',
    [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'],
    'bar'
  ]
});
```

SELECT foo, COUNT(hats) AS n_hats, bar FROM ...

使用聚合函数时,必须为它提供一个别名,以便能够从模型中访问它. 在上面的示例中,你可以通过 instance.n_hats 获取帽子数量.

有时,如果只想添加聚合,那么列出模型的所有属性可能会很麻烦：

```
// 这是获取帽子数量的烦人方法(每列都有)
Model.findAll({
  attributes: [
    'id', 'foo', 'bar', 'baz', 'qux', 'hats', // 我们必须列出所有属性...
    [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'] // 添加聚合...
  ]
});

// 这个更短,并且更不易出错. 如果以后在模型中添加/删除属性,它仍然可以正常工作
Model.findAll({
  attributes: {
    include: [
      [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats']
    ]
  }
});
```

同样,也可以排除某些属性：

```
Model.findAll({
  attributes: { exclude: ['baz'] }
});
```

-- Assuming all columns are 'id', 'foo', 'bar', 'baz' and 'qux'
SELECT id, foo, bar, qux FROM ...

# 应用 WHERE 子句

where 参数用于过滤查询.where 子句有很多运算符,可以从 Op 中以 Symbols 的形式使用