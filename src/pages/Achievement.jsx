import React, { useState, useEffect } from 'react'
import { Card, ProgressBar } from 'antd-mobile'

const Achievement = () => {
  const [stats, setStats] = useState({ streak: 0, savedMoney: 0 })

  const CONFIG = {
    goalName: 'SK-II 神仙水',
    goalPrice: 1540,
    dailySave: 20
  }

  useEffect(() => {
    // 1. 先读取连胜天数 (savedStreak 必须第一个定义)
    const savedStreak = parseInt(localStorage.getItem('streak') || '0')

    // 2. 再读取罚金
    const penalty = parseInt(localStorage.getItem('penalty') || '0')

    // 3. 最后计算总金额 (这时候 savedStreak 已经有值了，不会报错)
    const totalSaved = (savedStreak * CONFIG.dailySave) - penalty

    // 4. 更新状态 (防止金额变成负数，最少显示0)
    setStats({
      streak: savedStreak,
      savedMoney: totalSaved > 0 ? totalSaved : 0
    })
  }, [])

  const progress = Math.min((stats.savedMoney / CONFIG.goalPrice) * 100, 100)
  const remainingDays = Math.ceil((CONFIG.goalPrice - stats.savedMoney) / CONFIG.dailySave)

  return (
    <div className="pt-2 space-y-5">
      <h1 className="text-xl font-bold text-gray-800">🏆 战果统计</h1>

      {/* 资产卡片 */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
        <div className="text-sm opacity-90 mb-1">累计省下 (¥)</div>
        <div className="text-5xl font-bold mb-2 font-mono">{stats.savedMoney}.00</div>
        <div className="text-xs opacity-80 bg-white/20 inline-block px-2 py-1 rounded">
          相当于拒绝了 {stats.streak} 杯全糖奶茶
        </div>
      </div>

      {/* 目标进度卡片 */}
      <Card title={`🎯 存钱目标：${CONFIG.goalName}`} className="rounded-xl">
        <div className="mb-2 flex justify-between text-sm text-gray-500">
          <span>进度 {progress.toFixed(0)}%</span>
          <span>¥{CONFIG.goalPrice}</span>
        </div>
        <ProgressBar
          percent={progress}
          style={{
            '--track-width': '12px',
            '--fill-color': progress >= 100 ? '#22c55e' : 'var(--adm-color-primary)'
          }}
        />
        <div className="mt-3 text-right text-xs text-gray-400">
          {progress >= 100 ? (
            <span className="text-green-600 font-bold">🎉 目标达成！快去奖励自己吧！</span>
          ) : (
            `还需要坚持 ${remainingDays > 0 ? remainingDays : 0} 天`
          )}
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
            className={`bg-white p-4 rounded-xl text-center transition-all duration-300 ${stats.streak >= badge.day
                ? 'shadow-md scale-105 border border-yellow-200'
                : 'opacity-40 grayscale bg-gray-50'
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
