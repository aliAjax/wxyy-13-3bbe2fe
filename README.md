# 手工羽毛笔修复委托API

管理羽毛笔修复工作室的委托、报价、修复步骤和寄回记录。

## 启动

```bash
npm install
npm start
```

默认地址：http://localhost:3913

## 常用接口

- `GET /health`
- `GET /api/meta`
- `GET /api/commissions`
- `POST /api/commissions`
- `POST /api/commissions/:id/events`
- `GET /api/commissions/:id/timeline`

SQLite数据库文件会在首次启动时创建到`data/app.db`。
