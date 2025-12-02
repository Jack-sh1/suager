import React, { useState, useEffect } from 'react'
import { Toast, Dialog } from 'antd-mobile'
// 引入新封装的组件
import StatusCard from '../components/StatusCard'
import StatsCard from '../components/StatsCard'

const Home = () => {
  const [isChecked, setIsChecked] = useState(false)
  const [isRelapse, setIsRelapse] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const { currentStreak, isTodayChecked, todayRelapse } = checkStreakLogic()
    setStreak(currentStreak)
    setIsChecked(isTodayChecked)
    setIsRelapse(todayRelapse)
  }, [])

  // 🧠 逻辑核心：判断状态
  const checkStreakLogic = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    const lastDate = localStorage.getItem('lastCheckDate')
    const savedStreak = parseInt(localStorage.getItem('streak') || '0')
    const relapseStatus = localStorage.getItem('isRelapse') === 'true'

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let currentStreak = savedStreak
    let isTodayChecked = false
    let todayRelapse = false

    if (lastDate === todayStr) {
      isTodayChecked = true
      todayRelapse = relapseStatus
    } else if (lastDate === yesterdayStr) {
      isTodayChecked = false
    } else {
      if (lastDate) currentStreak = 0
      isTodayChecked = false
    }

    return { currentStreak, isTodayChecked, todayRelapse }
  }

  // 🟢 正常打卡
  const handleCheckIn = () => {
    updateState(false)
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
      updateState(true)
      Toast.show({ icon: 'fail', content: '已记录，扣除10元' })
    }
  }

  // 💾 数据持久化
  const updateState = (relapse) => {
    const todayStr = new Date().toISOString().split('T')[0]
    const newStreak = streak + 1

    setIsChecked(true)
    setIsRelapse(relapse)
    setStreak(newStreak)

    localStorage.setItem('lastCheckDate', todayStr)
    localStorage.setItem('streak', newStreak)
    localStorage.setItem('isRelapse', relapse)

    if (relapse) {
      const currentPenalty = parseInt(localStorage.getItem('penalty') || '0')
      localStorage.setItem('penalty', currentPenalty + 30)
    }
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 m-0">早安，戒糖人 ☀️</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isRelapse ? '诚实面对自己，也是一种进步。' : '坚持就是胜利，保持健康！'}
        </p>
      </div>

      {/* 状态卡片：负责交互 */}
      <StatusCard
        isChecked={isChecked}
        isRelapse={isRelapse}
        onCheckIn={handleCheckIn}
        onRelapse={handleRelapse}
      />

      {/* 数据卡片：负责展示 */}
      <StatsCard streak={streak} />
    </div>
  )
}

export default Home
