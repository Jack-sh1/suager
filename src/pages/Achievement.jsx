import React, { useState, useEffect } from 'react'
import { Card, ProgressBar, Button, Popup, List, Form, Input, Toast, Dialog, Tabs, Tag } from 'antd-mobile'
import { EditSOutline, AddCircleOutline, DeleteOutline } from 'antd-mobile-icons'
import { getGoals, getCurrentGoal, addGoal, setActiveGoal, deleteGoal, WISH_LIBRARY } from '../utils/goalService'

const Achievement = () => {
  const [stats, setStats] = useState({ streak: 0, savedMoney: 0 })
  const [currentGoal, setCurrentGoal] = useState(getCurrentGoal())

  const [isListVisible, setIsListVisible] = useState(false) // 愿望清单列表
  const [isAddVisible, setIsAddVisible] = useState(false)   // 新增愿望弹窗 (升级版)

  const [allGoals, setAllGoals] = useState([])
  const [form] = Form.useForm()
  const DAILY_SAVE = 20

  useEffect(() => {
    refreshData()
  }, [currentGoal])

  const refreshData = () => {
    const savedStreak = parseInt(localStorage.getItem('streak') || '0')
    const penalty = parseInt(localStorage.getItem('penalty') || '0')
    const totalSaved = (savedStreak * DAILY_SAVE) - penalty

    setStats({
      streak: savedStreak,
      savedMoney: totalSaved > 0 ? totalSaved : 0
    })
    setAllGoals(getGoals())
  }

  const handleSwitch = (id) => {
    const newGoal = setActiveGoal(id)
    setCurrentGoal(newGoal)
    setIsListVisible(false)
    Toast.show(`目标切换：${newGoal.name}`)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    Dialog.confirm({
      content: '确定删除这个愿望吗？',
      onConfirm: () => {
        const result = deleteGoal(id)
        if (result.success) {
          setAllGoals(result.list)
          setCurrentGoal(result.current)
          Toast.show('已删除')
        } else {
          Toast.show('至少保留一个目标哦')
        }
      }
    })
  }

  // 提交新目标
  const handleAddGoal = () => {
    const values = form.getFieldsValue()
    if (!values.name || !values.price) {
      Toast.show('请填写完整哦')
      return
    }

    const result = addGoal(values.name, values.price)
    setAllGoals(result.list)
    setCurrentGoal(result.current) // 自动切到新目标

    setIsAddVisible(false)
    setIsListVisible(false)
    form.resetFields()
    Toast.show('新目标已设立！')
  }

  // 💡 点击推荐标签，自动填表
  const fillForm = (name, price) => {
    form.setFieldsValue({ name, price: String(price) })
  }

  const progress = Math.min((stats.savedMoney / currentGoal.price) * 100, 100)
  const remainingMoney = currentGoal.price - stats.savedMoney
  const remainingDays = Math.ceil(remainingMoney / DAILY_SAVE)

  return (
    <div className="pt-2 space-y-5 pb-20">
      <h1 className="text-xl font-bold text-gray-800 px-2">🏆 战果统计</h1>

      {/* 1. 资产卡片 */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 mx-1">
        <div className="text-sm opacity-90 mb-1">累计省下 (¥)</div>
        <div className="text-5xl font-bold mb-2 font-mono">{stats.savedMoney}.00</div>
        <div className="text-xs opacity-80 bg-white/20 inline-block px-2 py-1 rounded">
          拒绝 {stats.streak} 杯奶茶
        </div>
      </div>

      {/* 2. 目标卡片 */}
      <Card className="rounded-xl mx-1 overflow-visible">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">当前目标</div>
            <div className="text-lg font-bold text-gray-800">{currentGoal.name}</div>
          </div>
          <Button
            size="mini"
            color="primary"
            fill="outline"
            shape="rounded"
            onClick={() => { setAllGoals(getGoals()); setIsListVisible(true); }}
            className="flex items-center gap-1 px-3"
          >
            <EditSOutline /> 切换
          </Button>
        </div>

        <div className="mb-2 flex justify-between text-sm text-gray-500">
          <span>进度 {progress.toFixed(0)}%</span>
          <span>¥{currentGoal.price}</span>
        </div>
        <ProgressBar percent={progress} style={{ '--track-width': '12px' }} />
        <div className="mt-3 text-right text-xs text-gray-400">
          {progress >= 100 ?
            <span className="text-green-600 font-bold">🎉 达成！快去买！</span> :
            `还差 ¥${remainingMoney > 0 ? remainingMoney : 0} · 约 ${remainingDays} 天`
          }
        </div>
      </Card>

      {/* 3. 愿望清单列表 Popup */}
      <Popup
        visible={isListVisible}
        onMaskClick={() => setIsListVisible(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', minHeight: '40vh' }}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold m-0">我的愿望清单</h3>
            <span className="text-gray-400" onClick={() => setIsListVisible(false)}>关闭</span>
          </div>

          <div className="flex-1 overflow-y-auto mb-4">
            <List>
              {allGoals.map(goal => (
                <List.Item
                  key={goal.id}
                  onClick={() => handleSwitch(goal.id)}
                  clickable
                  extra={
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">¥{goal.price}</span>
                      <div className="p-2 text-gray-300 hover:text-red-500" onClick={(e) => handleDelete(e, goal.id)}>
                        <DeleteOutline />
                      </div>
                    </div>
                  }
                >
                  <span className={goal.id === currentGoal.id ? 'text-primary font-bold' : ''}>{goal.name}</span>
                </List.Item>
              ))}
            </List>
          </div>

          <Button block color="primary" size="large" onClick={() => setIsAddVisible(true)}>
            <AddCircleOutline className="mr-1" /> 添加新愿望
          </Button>
        </div>
      </Popup>

      {/* 4. 🚀 升级版：新增愿望弹窗 (带推荐库) */}
      <Popup
        visible={isAddVisible}
        onMaskClick={() => setIsAddVisible(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '80vh' }}
      >
        <div className="p-4 flex flex-col h-full bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold m-0">许个愿吧 ✨</h3>
            <span className="text-gray-400" onClick={() => setIsAddVisible(false)}>取消</span>
          </div>

          {/* 推荐库区域 */}
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">🔥 猜你想买 (点击自动填)</div>
            <Tabs defaultActiveKey="0" style={{ '--content-padding': '8px 0' }}>
              {WISH_LIBRARY.map((cat, index) => (
                <Tabs.Tab title={cat.category} key={index}>
                  <div className="flex flex-wrap gap-2">
                    {cat.list.map(item => (
                      <Tag
                        key={item.name}
                        fill="outline"
                        color="primary"
                        className="py-1 px-3 active:bg-blue-50"
                        onClick={() => fillForm(item.name, item.price)}
                      >
                        {item.name} <span className="opacity-60 text-xs">¥{item.price}</span>
                      </Tag>
                    ))}
                  </div>
                </Tabs.Tab>
              ))}
            </Tabs>
          </div>

          {/* 填写表单 */}
          <Card className="rounded-xl">
            <Form form={form} layout='horizontal' footer={
              <Button block color='primary' size='large' onClick={handleAddGoal}>
                确定添加
              </Button>
            }>
              <Form.Item name='name' label='名称' rules={[{ required: true }]}>
                <Input placeholder='输入愿望名称' />
              </Form.Item>
              <Form.Item name='price' label='价格' rules={[{ required: true }]}>
                <Input type='number' placeholder='输入金额' />
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Popup>

      {/* 勋章墙 */}
      <div className="grid grid-cols-3 gap-3 mx-1">
        {[
          { day: 3, label: '3天萌新', icon: '🥉' },
          { day: 7, label: '7天入门', icon: '🥈' },
          { day: 21, label: '大神', icon: '🥇' },
        ].map((badge) => (
          <div key={badge.day} className={`bg-white p-4 rounded-xl text-center transition-all ${stats.streak >= badge.day ? 'opacity-100 shadow-md' : 'opacity-40 grayscale'}`}>
            <div className="text-3xl mb-1">{badge.icon}</div>
            <div className="text-xs text-gray-500">{badge.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Achievement
