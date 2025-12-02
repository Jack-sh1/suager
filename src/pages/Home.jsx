import React, { useState, useEffect } from 'react'
import { Toast, Dialog } from 'antd-mobile'
import StatusCard from '../components/StatusCard'
import StatsCard from '../components/StatsCard'

// 1. 👇 在这里添加引入 (这一行是新的)
import { performCheckIn, checkStreakLogic } from '../utils/checkInService'

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



  // 🟢 正常打卡
  const handleCheckIn = () => {
    // 2. 👇 修改这里：直接调用 performCheckIn，不再调用 updateState
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
      // 3. 👇 修改这里：直接调用 performCheckIn
      const newStreak = performCheckIn(true, streak)

      setIsChecked(true)
      setIsRelapse(true)
      setStreak(newStreak)

      Toast.show({ icon: 'fail', content: '已记录，扣除10元' })
    }
  }

  // 4. ❌ 注意：原来的 const updateState = (...) 函数必须删掉！
  // 因为它的逻辑已经移到了 src/utils/checkInService.js 里
  // 所有的 LocalStorage 操作都在那个文件里完成了。

  return (
    <div className="space-y-4 pt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 m-0">早安，戒糖人 ☀️</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isRelapse ? '诚实面对自己，也是一种进步。' : '坚持就是胜利，保持健康！'}
        </p>
      </div>

      <StatusCard
        isChecked={isChecked}
        isRelapse={isRelapse}
        onCheckIn={handleCheckIn}
        onRelapse={handleRelapse}
      />

      <StatsCard streak={streak} />
    </div>
  )
}

export default Home
