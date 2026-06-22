module.exports = {
  port: 3913,
  title: '手工羽毛笔修复委托API',
  description: '管理羽毛笔修复工作室的委托、报价、修复步骤和寄回记录。',
  collections: {
    customers: {
      label: '客户档案',
      defaultStatus: '活跃',
      statuses: ['活跃', '休眠'],
      required: ['name', 'contact'],
      titleFields: ['name'],
      defaults: {}
    },
    commissions: {
      label: '委托单',
      defaultStatus: '待收件',
      statuses: ['待收件', '已收件', '清洁中', '削尖中', '试写中', '已封存', '已寄回'],
      required: ['customerName', 'featherSource', 'holderMaterial', 'damageType', 'repairRequest', 'deliveryMethod'],
      titleFields: ['customerName', 'featherSource', 'damageType'],
      defaults: { quoteConfirmed: false }
    }
  },
  seed: [
    {
      collection: 'customers',
      id: 'customer-seed-1',
      status: '活跃',
      data: {
        name: '陆青',
        contact: 'luqing@example.test',
        preferredDelivery: '顺丰寄回',
        notes: '长期客户，偏好英文花体试写'
      }
    },
    {
      collection: 'commissions',
      id: 'commission-seed-1',
      status: '清洁中',
      data: {
        customerId: 'customer-seed-1',
        customerName: '陆青',
        contact: 'luqing@example.test',
        featherSource: '灰雁换羽',
        holderMaterial: '乌木笔杆',
        damageType: '笔尖劈裂',
        repairRequest: '保留原羽纹，适合英文花体试写',
        quote: 260,
        quoteConfirmed: true,
        deliveryMethod: '顺丰寄回',
        receivedAt: '2026-06-20'
      },
      note: '已收件并开始清洁'
    }
  ],
  examples: [
    'POST /api/customers 创建客户档案',
    'GET /api/customers/:id/profile 查看客户详情及最近委托',
    'POST /api/commissions 创建委托单（可带 customerId 复用联系信息）',
    'POST /api/commissions/{id}/events 登记收件、清洁、削尖、试写、封存或寄回',
    'GET /api/commissions?customerName=陆青 或 ?featherSource=灰雁 查询历史'
  ]
};
