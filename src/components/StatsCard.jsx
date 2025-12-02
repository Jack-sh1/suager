import React from 'react'
import { Card } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

const StatsCard = ({ streak }) => {
    const navigate = useNavigate()

    return (
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
    )
}

export default StatsCard
