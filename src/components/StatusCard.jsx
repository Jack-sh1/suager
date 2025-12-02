import React from 'react'
import { Card, Result, Button } from 'antd-mobile'

const StatusCard = ({ isChecked, isRelapse, onCheckIn, onRelapse }) => {
    // 1. 已打卡状态 (包括正常和破戒)
    if (isChecked) {
        return (
            <Card className="rounded-2xl shadow-sm border-none py-6 text-center">
                <Result
                    status={isRelapse ? 'warning' : 'success'}
                    title={
                        <span className={isRelapse ? "text-orange-600 font-bold" : "text-green-600 font-bold"}>
                            {isRelapse ? '已记录破戒' : '今日已达成'}
                        </span>
                    }
                    description={isRelapse ? "罚款 ¥10，连胜保住了。下次加油！" : "太棒了！管住嘴，迈开腿。"}
                />
                <Button
                    block
                    color="default"
                    shape="rounded"
                    disabled
                    className="mt-4 mx-4 w-auto border-none bg-gray-100 text-gray-400"
                >
                    明天继续加油
                </Button>
            </Card>
        )
    }

    // 2. 未打卡状态
    return (
        <Card className="rounded-2xl shadow-sm border-none py-6 text-center">
            <div className="mb-6">
                <div className="text-6xl mb-4 animate-bounce">🥤</div>
                <h2 className="text-xl font-bold text-gray-700">今天还没打卡哦</h2>
                <p className="text-gray-400 text-sm">放下手中的甜饮料</p>
            </div>

            <div className="space-y-3 px-4">
                <Button
                    block
                    color="primary"
                    size="large"
                    shape="rounded"
                    onClick={onCheckIn}
                    className="font-bold shadow-lg shadow-primary/30"
                >
                    我忍住了，打卡！
                </Button>

                <Button
                    block
                    fill="none"
                    size="small"
                    color="danger"
                    onClick={onRelapse}
                    className="text-gray-400 hover:text-red-500 transition-colors text-xs"
                >
                    哎呀，没忍住破戒了...
                </Button>
            </div>
        </Card>
    )
}

export default StatusCard
