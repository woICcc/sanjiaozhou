import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@delta.com' },
    update: {},
    create: { username: '管理员', email: 'admin@delta.com', passwordHash: adminHash, role: 'admin' }
  })

  const userHash = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: { username: '测试用户', email: 'user@test.com', passwordHash: userHash, role: 'user' }
  })

  const guns = [
    // 突击步枪
    { name: 'M4A1', type: '突击步枪', unlockLevel: 1 },
    { name: 'AK-74', type: '突击步枪', unlockLevel: 4 },
    { name: 'SCAR-H', type: '突击步枪', unlockLevel: 10 },
    { name: 'G36C', type: '突击步枪', unlockLevel: 7 },
    { name: 'CAR-15', type: '突击步枪', unlockLevel: 3 },
    { name: 'AUG', type: '突击步枪', unlockLevel: 14 },
    { name: 'FAMAS', type: '突击步枪', unlockLevel: 18 },
    { name: 'QBZ-95', type: '突击步枪', unlockLevel: 11 },
    { name: 'HK416', type: '突击步枪', unlockLevel: 20 },
    { name: 'AK-12', type: '突击步枪', unlockLevel: 16 },
    { name: 'M16A4', type: '突击步枪', unlockLevel: 5 },
    // 冲锋枪
    { name: 'MP5', type: '冲锋枪', unlockLevel: 2 },
    { name: 'Vector', type: '冲锋枪', unlockLevel: 8 },
    { name: 'MP7', type: '冲锋枪', unlockLevel: 6 },
    { name: 'P90', type: '冲锋枪', unlockLevel: 13 },
    { name: 'UMP45', type: '冲锋枪', unlockLevel: 9 },
    { name: 'PP-19', type: '冲锋枪', unlockLevel: 4 },
    { name: 'MAC-10', type: '冲锋枪', unlockLevel: 3 },
    // 狙击枪
    { name: 'SR-25', type: '狙击枪', unlockLevel: 12 },
    { name: 'AWP', type: '狙击枪', unlockLevel: 15 },
    { name: 'M700', type: '狙击枪', unlockLevel: 10 },
    { name: 'VSS', type: '狙击枪', unlockLevel: 17 },
    { name: 'PSG-1', type: '狙击枪', unlockLevel: 22 },
    { name: 'M24', type: '狙击枪', unlockLevel: 19 },
    // 霰弹枪
    { name: 'M870', type: '霰弹枪', unlockLevel: 6 },
    { name: 'AA-12', type: '霰弹枪', unlockLevel: 16 },
    { name: 'SPAS-12', type: '霰弹枪', unlockLevel: 11 },
    { name: 'S12K', type: '霰弹枪', unlockLevel: 8 },
    // 轻机枪
    { name: 'M249', type: '轻机枪', unlockLevel: 20 },
    { name: 'RPK', type: '轻机枪', unlockLevel: 14 },
    { name: 'MG4', type: '轻机枪', unlockLevel: 18 },
    // 射手步枪
    { name: 'Mini-14', type: '射手步枪', unlockLevel: 9 },
    { name: 'SVD', type: '射手步枪', unlockLevel: 13 },
    { name: 'Mk12', type: '射手步枪', unlockLevel: 11 },
  ]

  for (const gun of guns) {
    await prisma.gun.upsert({
      where: { name: gun.name },
      update: {},
      create: gun
    })
  }

  const m4 = await prisma.gun.findUnique({ where: { name: 'M4A1' } })
  if (m4) {
    await prisma.build.create({
      data: {
        gunId: m4.id, userId: admin.id,
        name: '激光远射 M4', buildCode: 'M4A1-001-LASER-XYZ',
        description: '中远距离压制，后坐力控制优秀'
      }
    })
    await prisma.build.create({
      data: {
        gunId: m4.id, userId: user.id,
        name: '近战速射 M4', buildCode: 'M4A1-002-CQB-ABC',
        description: '近距离高射速，腰射精准'
      }
    })
  }

  const ak = await prisma.gun.findUnique({ where: { name: 'AK-74' } })
  if (ak) {
    await prisma.build.create({
      data: {
        gunId: ak.id, userId: admin.id,
        name: '经典 AK 稳点', buildCode: 'AK74-001-STABLE',
        description: '经典配装，稳扎稳打'
      }
    })
  }

  await prisma.article.create({
    data: {
      userId: admin.id, title: 'M4A1 最强配装指南——新赛季必看',
      content: '<h2>M4A1 新赛季配装思路</h2><p>M4A1 在本赛季中依然是最稳定的突击步枪选择。以下是推荐的配装方案...</p><h3>配件选择</h3><ul><li>枪口：消音器</li><li>握把：垂直握把</li><li>瞄准镜：红点</li></ul>',
      category: '武器测评'
    }
  })

  await prisma.article.create({
    data: {
      userId: user.id, title: '长弓溪谷地图打法详解',
      content: '<h2>长弓溪谷攻略</h2><p>长弓溪谷是一张中型地图，主要交战距离为中远距离...</p>',
      category: '地图解析'
    }
  })

  console.log('✅ 种子数据创建成功')
  console.log('管理员: admin@delta.com / admin123')
  console.log('测试用户: user@test.com / user123')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())
