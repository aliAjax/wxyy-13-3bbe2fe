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
    },
    inventory: {
      label: '修复材料库存',
      defaultStatus: '在库',
      statuses: ['在库', '缺货', '停用'],
      required: ['name', 'spec', 'quantity', 'threshold'],
      titleFields: ['name', 'spec'],
      defaults: { quantity: 0, threshold: 0, unit: '个', remark: '' }
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
    },
    {
      collection: 'inventory',
      id: 'inventory-seed-1',
      status: '在库',
      data: {
        name: '羽毛管',
        spec: '灰雁大号',
        unit: '支',
        quantity: 50,
        threshold: 10,
        remark: '用于替换严重劈裂的笔尖部分'
      },
      note: '初始库存'
    },
    {
      collection: 'inventory',
      id: 'inventory-seed-2',
      status: '在库',
      data: {
        name: '笔杆',
        spec: '乌木 18cm',
        unit: '根',
        quantity: 20,
        threshold: 5,
        remark: '经典乌木笔杆，适配大号羽毛'
      },
      note: '初始库存'
    },
    {
      collection: 'inventory',
      id: 'inventory-seed-3',
      status: '在库',
      data: {
        name: '封蜡',
        spec: '酒红色 30g',
        unit: '盒',
        quantity: 8,
        threshold: 3,
        remark: '封存笔尖用，防潮防氧化'
      },
      note: '初始库存'
    },
    {
      collection: 'inventory',
      id: 'inventory-seed-4',
      status: '在库',
      data: {
        name: '清洁液',
        spec: '专用羽毛清洁液 100ml',
        unit: '瓶',
        quantity: 15,
        threshold: 5,
        remark: '温和配方，不损伤羽纹'
      },
      note: '初始库存'
    },
    {
      collection: 'inventory',
      id: 'inventory-seed-5',
      status: '在库',
      data: {
        name: '羽毛管',
        spec: '天鹅中号',
        unit: '支',
        quantity: 5,
        threshold: 8,
        remark: '库存偏低，需尽快补货'
      },
      note: '初始库存'
    }
  ],
  examples: [
    'POST /api/customers 创建客户档案',
    'GET /api/customers/:id/profile 查看客户详情及最近委托',
    'POST /api/commissions 创建委托单（可带 customerId 复用联系信息）',
    'POST /api/commissions/{id}/events 登记收件、清洁、削尖、试写、封存或寄回',
    'GET /api/commissions?customerName=陆青 或 ?featherSource=灰雁 查询历史',
    'GET /api/inventory 库存材料列表',
    'GET /api/inventory/:id 库存材料详情',
    'POST /api/inventory 新增库存材料（名称、规格、数量、预警阈值）',
    'POST /api/inventory/:id/stock-in 材料入库（增加库存数量）',
    'POST /api/inventory/:id/stock-out 材料扣减（减少库存，不能为负）',
    'GET /api/inventory/low-stock 查询低库存材料（数量低于阈值）'
  ]
};
