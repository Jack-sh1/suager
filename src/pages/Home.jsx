import React, { useState, useEffect } from 'react'
import { Toast, Dialog, Button } from 'antd-mobile'
// 组件
import StatusCard from '../components/StatusCard'
import StatsCard from '../components/StatsCard'
// 逻辑服务
import { performCheckIn, getCheckInStats } from '../utils/checkInService'
// 认证上下文
import { useAuth } from '../context/AuthContext'

const Home = () => {
  // 1. 获取认证信息
  const { user, logout } = useAuth()

  // 2. 本地 UI 状态
  const [isChecked, setIsChecked] = useState(false)
  const [isRelapse, setIsRelapse] = useState(false)
  const [streak, setStreak] = useState(0)

  // 3. 初始化：检查当前用户的打卡状态
  useEffect(() => {
    const { currentStreak, isTodayChecked, todayRelapse } = checkStreakLogic()
    setStreak(currentStreak)
    setIsChecked(isTodayChecked)
    setIsRelapse(todayRelapse)
  }, []) // 仅挂载时执行

  // 核心逻辑：根据存储的数据计算 UI 状态
  const checkStreakLogic = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    // 从 Service 获取当前用户的数据
    const stats = getCheckInStats()

    const lastDate = stats.lastDate
    const savedStreak = stats.streak
    const relapseStatus = stats.isRelapse // boolean

    let currentStreak = savedStreak
    let isTodayChecked = false
    let todayRelapse = false

    if (lastDate === todayStr) {
      // 今天打过卡了
      isTodayChecked = true
      todayRelapse = relapseStatus
    } else if (lastDate === yesterdayStr) {
      // 昨天打过卡，今天还没打
      isTodayChecked = false
    } else {
      // 断签了
      if (lastDate) currentStreak = 0
      isTodayChecked = false
    }

    return { currentStreak, isTodayChecked, todayRelapse }
  }

  // --- 交互处理 ---

  // 🟢 正常打卡
  const handleCheckIn = () => {
    const newStreak = performCheckIn(false, streak)
    setIsChecked(true)
    setIsRelapse(false)
    setStreak(newStreak)
    Toast.show({ icon: 'success', content: '打卡成功！+20元' })
  }

  // 🔴 破戒复活
  const handleRelapse = async () => {
    const result = await Dialog.confirm({
      title: '💔 哎呀，破戒了？',
      content: '没关系，诚实记录也是一种勇气。本次将扣除 10 元虚拟存款，但会保留你的连胜天数。',
      confirmText: '我认罚',
      cancelText: '点错了',
    })

    if (result) {
      const newStreak = performCheckIn(true, streak)
      setIsChecked(true)
      setIsRelapse(true)
      setStreak(newStreak)
      Toast.show({ icon: 'fail', content: '已记录，扣除10元' })
    }
  }

  // 🚪 退出登录
  const handleLogout = () => {
    Dialog.confirm({
      content: '确定要退出登录吗？',
      onConfirm: () => logout()
    })
  }

  // --- 渲染 UI ---
  return (
    <div className="space-y-4 pt-4">
      {/* 1. 头部：用户信息 + 退出按钮 */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">
            早安，{user?.username || '戒糖人'} ☀️
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isRelapse ? '诚实面对自己，也是一种进步。' : '坚持就是胜利，保持健康！'}
          </p>
        </div>
        <Button
          size="mini"
          color="default"
          fill="outline"
          style={{ '--border-color': '#e5e7eb', color: '#6b7280' }}
          onClick={handleLogout}
        >
          退出
        </Button>
      </div>

      {/* 2. 状态卡片 (UI 组件) */}
      <StatusCard
        isChecked={isChecked}
        isRelapse={isRelapse}
        onCheckIn={handleCheckIn}
        onRelapse={handleRelapse}
      />

      {/* 3. 数据卡片 (UI 组件) */}
      <StatsCard streak={streak} />
    </div>
  )
}

export default Home
