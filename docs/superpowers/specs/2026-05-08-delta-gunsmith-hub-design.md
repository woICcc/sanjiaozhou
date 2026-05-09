# 三角洲改枪营地 (Delta GunSmith Hub) — 设计文档

## 1. 技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 前端 | React 18 + Vite | SPA，开发体验好 |
| 样式 | Tailwind CSS 3 | 原子化 CSS，快速构建 UI |
| 路由 | React Router v6 | 前端路由 |
| 后端 | Node.js + Express | RESTful API |
| ORM | Prisma | 支持 SQLite / MySQL / PG 平滑切换 |
| 数据库 | SQLite（开发） | 文件型，零配置 |
| 鉴权 | JWT (jsonwebtoken) | 无状态，存 localStorage |
| 部署 | PM2 + Nginx | 云服务器标准方案 |

## 2. 项目结构

```
cc-first/
├── client/                      # React 前端
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx             # 入口
│       ├── App.jsx              # 路由配置
│       ├── api/
│       │   └── index.js         # axios 封装
│       ├── context/
│       │   └── AuthContext.jsx   # 登录状态
│       ├── pages/
│       │   ├── Home.jsx         # 首页
│       │   ├── GunPlaza.jsx     # 枪械广场
│       │   ├── GunDetail.jsx    # 枪械专区 + Top5
│       │   ├── StrategyList.jsx # 攻略列表
│       │   ├── ArticleDetail.jsx# 帖子详情 + 评论
│       │   ├── Login.jsx        # 登录
│       │   ├── Register.jsx     # 注册
│       │   ├── Profile.jsx      # 个人中心
│       │   └── Admin.jsx        # 管理后台
│       └── components/
│           ├── Navbar.jsx
│           ├── GunCard.jsx
│           ├── BuildCard.jsx
│           ├── TopFiveCard.jsx
│           ├── ArticleCard.jsx
│           └── LikeButton.jsx
│
├── server/                      # Express 后端
│   ├── package.json
│   ├── index.js                 # 入口
│   ├── prisma/
│   │   └── schema.prisma        # 数据库模型
│   ├── middleware/
│   │   └── auth.js              # JWT 鉴权中间件
│   ├── routes/
│   │   ├── auth.js              # 注册/登录
│   │   ├── guns.js              # 枪械 CRUD
│   │   ├── builds.js            # 改枪码 CRUD + 点赞
│   │   ├── articles.js          # 攻略 CRUD + 点赞
│   │   └── comments.js          # 评论 CRUD
│   └── seed.js                  # 种子数据
│
└── package.json                 # 根 workspace
```

## 3. 数据库模型 (Prisma Schema)

```
User
  id             Int       @id @default(autoincrement())
  username       String    @unique
  email          String    @unique
  passwordHash   String
  role           String    @default("user")     // "user" | "admin"
  createdAt      DateTime  @default(now())
  builds         Build[]
  articles       Article[]
  buildLikes     BuildLike[]
  articleLikes   ArticleLike[]
  comments       Comment[]

Gun
  id             Int       @id @default(autoincrement())
  name           String    @unique
  type           String                            // "突击步枪","冲锋枪","狙击枪",...
  image          String?
  unlockLevel    Int?
  createdAt      DateTime  @default(now())
  builds         Build[]

Build
  id             Int       @id @default(autoincrement())
  gunId          Int
  userId         Int
  name           String                            // 改枪码名称
  buildCode      String                            // 改枪码字符串本体
  description    String?
  screenshot     String?
  likesCount     Int       @default(0)
  createdAt      DateTime  @default(now())
  gun            Gun       @relation(fields: [gunId], references: [id])
  user           User      @relation(fields: [userId], references: [id])
  likes          BuildLike[]

BuildLike
  id             Int       @id @default(autoincrement())
  buildId        Int
  userId         Int
  likedDate      DateTime  @default(now())
  build          Build     @relation(fields: [buildId], references: [id])
  user           User      @relation(fields: [userId], references: [id])
  @@unique([buildId, userId, likedDate])            // 每人每天每码最多1赞

Article
  id             Int       @id @default(autoincrement())
  userId         Int
  title          String
  content        String                            // HTML 富文本
  category       String?                           // "活动速通","武器测评","干员技巧","地图解析"
  likesCount     Int       @default(0)
  createdAt      DateTime  @default(now())
  user           User      @relation(fields: [userId], references: [id])
  comments       Comment[]
  likes          ArticleLike[]

ArticleLike
  id             Int       @id @default(autoincrement())
  articleId      Int
  userId         Int
  article        Article   @relation(fields: [articleId], references: [id])
  user           User      @relation(fields: [userId], references: [id])
  @@unique([articleId, userId])                     // 每人每帖1赞（可取消）

Comment
  id             Int       @id @default(autoincrement())
  articleId      Int
  parentId       Int?                              // 楼中楼
  userId         Int
  content        String
  createdAt      DateTime  @default(now())
  article        Article   @relation(fields: [articleId], references: [id])
  user           User      @relation(fields: [userId], references: [id])
```

## 4. API 设计

### 鉴权
- `POST /api/auth/register` — 注册
- `POST /api/auth/login` — 登录，返回 JWT
- `GET /api/auth/me` — 获取当前用户信息 (需鉴权)

### 枪械
- `GET /api/guns?type=` — 枪械列表，支持类型筛选
- `GET /api/guns/:id` — 枪械详情 + Top5 + 改枪码列表
- `POST /api/guns` — 新增枪械 (admin)
- `PUT /api/guns/:id` — 编辑枪械 (admin)
- `DELETE /api/guns/:id` — 下架枪械 (admin)

### 改枪码
- `POST /api/builds` — 发布改枪码 (需鉴权)
- `GET /api/builds/:id` — 改枪码详情
- `DELETE /api/builds/:id` — 删除 (作者/admin)
- `POST /api/builds/:id/like` — 点赞 (需鉴权)
- `GET /api/user/likes/today` — 今日剩余点赞次数 (需鉴权)

### 攻略
- `GET /api/articles?category=&sort=` — 攻略列表，分类+排序
- `GET /api/articles/:id` — 攻略详情 + 评论
- `POST /api/articles` — 发布 (需鉴权)
- `PUT /api/articles/:id` — 编辑 (作者/admin)
- `DELETE /api/articles/:id` — 删除 (作者/admin)
- `POST /api/articles/:id/like` — 点赞/取消赞 (需鉴权)

### 评论
- `GET /api/articles/:id/comments` — 获取评论
- `POST /api/articles/:id/comments` — 发布评论 (需鉴权)
- `POST /api/comments/:id/reply` — 回复评论 (需鉴权)

## 5. 前端页面 & 组件

| 页面 | 路由 | 核心功能 |
|---|---|---|
| 首页 | `/` | 搜索框、热门枪械、热门攻略 |
| 枪械广场 | `/guns` | 分类筛选网格 |
| 枪械专区 | `/guns/:id` | Top5 排行 + 改枪码流 + 发布入口 |
| 攻略列表 | `/articles` | 分类筛选 + 卡片流 |
| 帖子详情 | `/articles/:id` | 正文 + 评论区 |
| 登录 | `/login` | 表单 |
| 注册 | `/register` | 表单 |
| 个人中心 | `/profile` | 我的改枪码/攻略/点赞历史 |
| 管理员 | `/admin` | 枪械库管理 |

## 6. 点赞规则实现

### 改枪码点赞（严格限制）
- 每天每用户 10 次总额度，跨枪械共享
- 每天每用户对同一改枪码只能点 1 次
- 查询 `BuildLike` 表按 `buildId + userId + 当天日期` 去重
- 查询当天所有 `BuildLike` 表 `userId` 的记录数量判断额度
- 点赞后 `Build.likesCount` +1，额度用尽弹窗提示

### 攻略点赞（宽松）
- 每人每帖 1 次，可取消
- 查询 `ArticleLike` 表按 `articleId + userId` 去重
- 点赞/取消都操作该记录，`Article.likesCount` 相应增减

## 7. 部署方案

- `server/` 用 PM2 启动 `node index.js`
- `client/` 用 Vite build 出静态文件
- Nginx 反代 `/api/` 到 Express 端口，其余服务静态文件
- 环境变量通过 `.env` 配置（JWT_SECRET, DATABASE_URL 等）
