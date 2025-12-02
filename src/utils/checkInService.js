import { getUserKey } from './authHelper'

// 1. 核心写操作：执行打卡
export const performCheckIn = (isRelapse, currentStreak) => {
    const todayStr = new Date().toISOString().split('T')[0]
    // 如果断签归零逻辑在 checkStreakLogic 里处理了，这里传入的 currentStreak 应该是正确的
    const newStreak = currentStreak + 1

    // --- 写入基础状态 (带 UserKey) ---
    localStorage.setItem(getUserKey('lastCheckDate'), todayStr)
    localStorage.setItem(getUserKey('streak'), newStreak)
    localStorage.setItem(getUserKey('isRelapse'), isRelapse)

    // --- 处理罚金 ---
    if (isRelapse) {
        const currentPenalty = parseInt(localStorage.getItem(getUserKey('penalty')) || '0')
        localStorage.setItem(getUserKey('penalty'), currentPenalty + 30)
    }

    // --- 写入日志 (用于热力图) ---
    const historyLog = JSON.parse(localStorage.getItem(getUserKey('historyLog')) || '{}')
    historyLog[todayStr] = isRelapse ? 'relapse' : 'success'
    localStorage.setItem(getUserKey('historyLog'), JSON.stringify(historyLog))

    return newStreak
}

// 2. 核心读操作：获取原始数据 (给 Achievement 页用)
export const getCheckInStats = () => {
    return {
        lastDate: localStorage.getItem(getUserKey('lastCheckDate')),
        streak: parseInt(localStorage.getItem(getUserKey('streak')) || '0'),
        isRelapse: localStorage.getItem(getUserKey('isRelapse')) === 'true',
        penalty: parseInt(localStorage.getItem(getUserKey('penalty')) || '0'),
        historyLog: JSON.parse(localStorage.getItem(getUserKey('historyLog')) || '{}')
    }
}

// 3. 核心计算逻辑：判断断签 (给 Home 页用)
// 这个函数负责判断：今天是打卡了？没打卡？还是断签了？
export const checkStreakLogic = () => {
    const todayStr = new Date().toISOString().split('T')[0]

    // 获取昨天日期
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    // 读取当前数据
    const stats = getCheckInStats() // 复用上面的读取函数

    const lastDate = stats.lastDate
    const savedStreak = stats.streak
    const relapseStatus = stats.isRelapse

    let currentStreak = savedStreak
    let isTodayChecked = false
    let todayRelapse = false

    if (lastDate === todayStr) {
        // 情况A: 今天已打卡
        isTodayChecked = true
        todayRelapse = relapseStatus
    } else if (lastDate === yesterdayStr) {
        // 情况B: 昨天打过卡，今天还没打 (连胜保持)
        isTodayChecked = false
    } else {
        // 情况C: 断签了 (上次打卡是前天或更早)
        // 除非是新用户(无记录)，否则重置连胜
        if (lastDate) {
            currentStreak = 0
        }
        isTodayChecked = false
    }

    return { currentStreak, isTodayChecked, todayRelapse }
}
