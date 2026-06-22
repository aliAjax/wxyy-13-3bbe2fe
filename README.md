# 手工羽毛笔修复委托API

管理羽毛笔修复工作室的委托、报价、修复步骤和寄回记录，支持客户档案管理。

## 启动

```bash
npm install
npm start
```

默认地址：http://localhost:3913

## 接口总览

### 通用

- `GET /health` 健康检查
- `GET /api/meta` 获取服务元信息

### 客户档案

- `GET /api/customers` 客户列表
- `POST /api/customers` 创建客户
- `GET /api/customers/:id` 客户详情
- `PATCH /api/customers/:id` 更新客户
- `GET /api/customers/:id/profile` 客户详情 + 最近委托摘要
- `DELETE /api/customers/:id` 删除客户

### 委托单

- `GET /api/commissions` 委托列表
- `POST /api/commissions` 创建委托（支持 `customerId` 复用联系信息）
- `GET /api/commissions/:id` 委托详情
- `PATCH /api/commissions/:id` 更新委托
- `POST /api/commissions/:id/events` 登记收件/清洁/削尖/试写/封存/寄回
- `GET /api/commissions/:id/timeline` 委托时间线
- `DELETE /api/commissions/:id` 删除委托

## 接口示例

### 创建客户档案

```bash
curl -X POST http://localhost:3913/api/customers \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "陆青",
    "contact": "luqing@example.test",
    "preferredDelivery": "顺丰寄回",
    "notes": "长期客户，偏好英文花体试写"
  }'
```

### 查看客户详情及最近委托

```bash
curl http://localhost:3913/api/customers/{id}/profile
```

返回示例：

```json
{
  "customer": {
    "id": "customer-seed-1",
    "name": "陆青",
    "contact": "luqing@example.test",
    "preferredDelivery": "顺丰寄回",
    "notes": "长期客户，偏好英文花体试写",
    "status": "活跃",
    "createdAt": "2026-06-22T00:00:00.000Z"
  },
  "totalCommissions": 2,
  "recentCommissions": [
    {
      "id": "...",
      "customerName": "陆青",
      "featherSource": "灰雁换羽",
      "damageType": "笔尖劈裂",
      "status": "清洁中",
      "quote": 260,
      "createdAt": "2026-06-20T00:00:00.000Z",
      "updatedAt": "2026-06-20T00:00:00.000Z"
    }
  ]
}
```

### 创建委托（带客户档案ID复用联系信息）

```bash
curl -X POST http://localhost:3913/api/commissions \
  -H 'Content-Type: application/json' \
  -d '{
    "customerId": "customer-seed-1",
    "featherSource": "白鹅羽",
    "holderMaterial": "红木笔杆",
    "damageType": "笔杆开裂",
    "repairRequest": "修复笔杆，保留原漆面"
  }'
```

当传入 `customerId` 时，系统自动从客户档案填充 `customerName`、`contact` 和 `deliveryMethod`（优先使用请求体中的值）。

### 创建委托（不使用客户档案）

```bash
curl -X POST http://localhost:3913/api/commissions \
  -H 'Content-Type: application/json' \
  -d '{
    "customerName": "张三",
    "contact": "zhangsan@example.test",
    "featherSource": "火鸡羽",
    "holderMaterial": "竹制笔杆",
    "damageType": "羽毛折断",
    "repairRequest": "更换羽毛，适配原笔杆",
    "deliveryMethod": "中通寄回"
  }'
```

### 登记委托事件

```bash
curl -X POST http://localhost:3913/api/commissions/{id}/events \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "已收件",
    "status": "已收件",
    "note": "包裹完好"
  }'
```

### 查询委托

```bash
curl http://localhost:3913/api/commissions?customerName=陆青
curl http://localhost:3913/api/commissions?status=清洁中
```

## 验证方式

### 必填字段校验

创建客户时 `name` 和 `contact` 为必填，缺少时返回 `400`：

```bash
curl -X POST http://localhost:3913/api/customers \
  -H 'Content-Type: application/json' \
  -d '{"name": "测试客户"}'
# 返回 {"error":"missing required fields: contact"}
```

创建委托时 `customerName`、`featherSource`、`holderMaterial`、`damageType`、`repairRequest`、`deliveryMethod` 为必填。若传入 `customerId`，系统会自动填充 `customerName`、`contact`、`deliveryMethod`，无需手动填写。

### 状态校验

创建、更新和登记事件时，传入的 `status` 必须在允许值范围内，否则返回 `400`。

- 委托状态允许值：`待收件` `已收件` `清洁中` `削尖中` `试写中` `已封存` `已寄回`
- 客户状态允许值：`活跃` `休眠`

示例：

```bash
curl -X POST http://localhost:3913/api/customers \
  -H 'Content-Type: application/json' \
  -d '{"name":"测试","contact":"test@test.com","status":"已删除"}'
# 返回 {"error":"invalid status: 已删除"}
```

未传 `status` 时使用集合的默认状态（客户默认 `活跃`，委托默认 `待收件`）。

### 404 校验

访问不存在的记录返回 `404`：

```bash
curl http://localhost:3913/api/customers/non-existent-id
# 返回 {"error":"not found"}
```

SQLite数据库文件会在首次启动时创建到`data/app.db`。
