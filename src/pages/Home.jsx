import React, { useState, useEffect } from 'react'
import { Card, Button, Toast, Result } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [isChecked, setIsChecked] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // 页面加载时，执行严谨的逻辑检查
    const { currentStreak, isTodayChecked } = checkStreakLogic()
    setStreak(currentStreak)
    setIsChecked(isTodayChecked)
  }, [])

  // 🧠 核心算法：计算连胜状态
  const checkStreakLogic = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    const lastDate = localStorage.getItem('lastCheckDate')
    const savedStreak = parseInt(localStorage.getItem('streak') || '0')

    // 计算昨天的日期
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let currentStreak = savedStreak
    let isTodayChecked = false

    if (lastDate === todayStr) {
      // 情况A: 今天已经打过卡了
      isTodayChecked = true
    } else if (lastDate === yesterdayStr) {
      // 情况B: 昨天打卡了，今天是新的一天，连胜保持
      isTodayChecked = false
    } else {
      // 情况C: 断签了！(上次打卡不是昨天，也不是今天)
      // 除非是第一次使用(无记录)，否则重置为0
      if (lastDate) {
        currentStreak = 0 
        // 可选：这里可以把重置后的 0 存回去，或者等用户点打卡时再存
        localStorage.setItem('streak', '0')
      }
      isTodayChecked = false
    }
    
    return { currentStreak, isTodayChecked }
  }

  const handleCheckIn = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    
    // 重新获取一下最新状态（防止边缘情况）
    let { currentStreak } = checkStreakLogic()
    const newStreak = currentStreak + 1
    
    setIsChecked(true)
    setStreak(newStreak)
    
    // 持久化存储
    localStorage.setItem('lastCheckDate', todayStr)
    localStorage.setItem('streak', newStreak)
    
    Toast.show({
      icon: 'success',
      content: `打卡成功！省下 ¥${20}`, // 即使反馈
    })
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 m-0">早安，戒糖人 ☀️</h1>
        <p className="text-gray-500 text-sm mt-1">坚持就是胜利，保持健康！</p>
      </div>

      <Card className="rounded-2xl shadow-sm border-none">
        <div className="text-center py-6">
          {isChecked ? (
            <Result
              status="success"
              title={<span className="text-green-600 font-bold">今日已达成</span>}
              description="太棒了！管住嘴，迈开腿。"
            />
          ) : (
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-bounce">🥤</div>
              <h2 className="text-xl font-bold text-gray-700">今天还没打卡哦</h2>
              <p className="text-gray-400 text-sm">放下手中的甜饮料</p>
            </div>
          )}

          <Button 
            block 
            color="primary" 
            size="large" 
            shape="rounded"
            disabled={isChecked}
            onClick={handleCheckIn}
            className="mt-4 font-bold shadow-lg shadow-primary/30"
          >
            {isChecked ? '明天继续加油' : '我忍住了，打卡！'}
          </Button>
        </div>
      </Card>

      <Card 
        className="rounded-xl active:bg-gray-50 transition-colors" 
        onClick={() => navigate('/achievement')}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-400 mb-1">当前连胜</div>
            <div className="text-2xl font-bold text-orange-500 flex items-center gap-1">
              {streak} <span className="text-sm font-normal text-gray-500">天</span>
            </div>
          </div>
          <div className="flex items-center text-primary text-sm font-medium">
            查看小金库 <span className="i-carbon-chevron-right ml-1 text-lg"></span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Home
