import React, { useState, useEffect } from 'react'
import { Card, Button, Toast, Result } from 'antd-mobile'
import { CheckCircleFill } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [isChecked, setIsChecked] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // (保持原有的 LocalStorage 读取逻辑不变)
    const today = new Date().toISOString().split('T')[0]
    const lastDate = localStorage.getItem('lastCheckDate')
    const savedStreak = parseInt(localStorage.getItem('streak') || '0')
    
    if (lastDate === today) setIsChecked(true)
    setStreak(savedStreak)
    // 这里简化了断签逻辑演示，实际项目请保留之前的 checkStreakStatus
  }, [])

  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0]
    const newStreak = streak + 1
    
    setIsChecked(true)
    setStreak(newStreak)
    localStorage.setItem('lastCheckDate', today)
    localStorage.setItem('streak', newStreak)
    
    Toast.show({
      icon: 'success',
      content: '打卡成功！+20元',
    })
  }

  return (
    <div className="space-y-4 pt-4">
      {/* 头部 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 m-0">早安，戒糖人 ☀️</h1>
        <p className="text-gray-500 text-sm mt-1">坚持就是胜利，保持健康！</p>
      </div>

      {/* 主卡片 */}
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

      {/* 数据入口 */}
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
