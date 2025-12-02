import React from 'react'
import { Card } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

const StatsCard = ({ streak }) => {
    const navigate = useNavigate()

    // 1. 生成最近 7 天的日期数组 (从左到右：6天前 -> 今天)
    const getLast7Days = () => {
        const days = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            days.push({
                dateStr: d.toISOString().split('T')[0], // 格式: 2025-12-02
                dayLabel: i === 0 ? '今' : ['日', '一', '二', '三', '四', '五', '六'][d.getDay()] // 显示周几
            })
        }
        return days
    }

    // 2. 读取打卡日志 (由 checkInService 写入的)
    const historyLog = JSON.parse(localStorage.getItem('historyLog') || '{}')
    const last7Days = getLast7Days()

    // 3. 获取格子颜色的逻辑
    const getCellStatus = (dateStr) => {
        const status = historyLog[dateStr]
        if (status === 'success') return { color: 'bg-green-500', opacity: 1 }
        if (status === 'relapse') return { color: 'bg-orange-500', opacity: 1 }
        return { color: 'bg-gray-200', opacity: 0.3 } // 未打卡
    }

    return (
        <Card
            className="rounded-xl active:bg-gray-50 transition-colors"
            onClick={() => navigate('/achievement')}
        >
            {/* 顶部标题栏 */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 text-xs">已连续坚持</span>
                    <span className="text-2xl font-bold text-gray-800 font-mono">{streak}</span>
                    <span className="text-gray-500 text-xs">天</span>
                </div>
                <div className="flex items-center text-primary text-xs">
                    查看详情 <span className="i-carbon-chevron-right text-sm"></span>
                </div>
            </div>

            {/* 🔥 核心：GitHub 风格热力图 */}
            <div className="flex justify-between gap-2">
                {last7Days.map((day) => {
                    const { color, opacity } = getCellStatus(day.dateStr)

                    return (
                        <div key={day.dateStr} className="flex flex-col items-center gap-2 flex-1">
                            {/* 格子本体 */}
                            <div
                                className={`w-full aspect-square rounded-md transition-all duration-500 ${color}`}
                                style={{ opacity: opacity }}
                            />
                            {/* 星期几标签 */}
                            <span className="text-[10px] text-gray-400 scale-90 font-medium">
                                {day.dayLabel}
                            </span>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default StatsCard
