import React, { useState, useEffect } from 'react'
import { Card, ProgressBar } from 'antd-mobile'

const Achievement = () => {
  const [stats, setStats] = useState({ streak: 0, savedMoney: 0 })
  const GOAL = { price: 1540, dailySave: 20 } // 目标金额

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem('streak') || '0')
    setStats({
      streak: savedStreak,
      savedMoney: savedStreak * GOAL.dailySave
    })
  }, [])

  const progress = Math.min((stats.savedMoney / GOAL.price) * 100, 100)

  return (
    <div className="pt-2 space-y-5">
      <h1 className="text-xl font-bold text-gray-800">🏆 战果统计</h1>

      {/* 资产卡片 - 使用 UnoCSS 定义渐变背景 */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
        <div className="text-sm opacity-90 mb-1">累计省下 (¥)</div>
        <div className="text-5xl font-bold mb-2 font-mono">{stats.savedMoney}.00</div>
        <div className="text-xs opacity-80 bg-white/20 inline-block px-2 py-1 rounded">
          相当于拒绝了 {stats.streak} 杯全糖奶茶
        </div>
      </div>

      {/* 目标卡片 */}
      <Card title="🎯 存钱目标：SK-II 神仙水" className="rounded-xl">
        <div className="mb-2 flex justify-between text-sm text-gray-500">
          <span>进度 {progress.toFixed(0)}%</span>
          <span>¥{GOAL.price}</span>
        </div>
        <ProgressBar percent={progress} style={{ '--track-width': '12px' }} />
        <div className="mt-3 text-right text-xs text-gray-400">
          还需要坚持 {Math.ceil((GOAL.price - stats.savedMoney) / GOAL.dailySave)} 天
        </div>
      </Card>

      {/* 勋章墙 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { day: 3, label: '3天萌新', icon: '🥉' },
          { day: 7, label: '7天入门', icon: '🥈' },
          { day: 21, label: '大神', icon: '🥇' },
        ].map((badge) => (
          <div 
            key={badge.day} 
            className={`bg-white p-4 rounded-xl text-center transition-all ${
              stats.streak >= badge.day ? 'shadow-sm opacity-100' : 'opacity-40 grayscale'
            }`}
          >
            <div className="text-3xl mb-1">{badge.icon}</div>
            <div className="text-xs text-gray-500">{badge.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Achievement
