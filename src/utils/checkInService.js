// 封装打卡的核心业务逻辑
import { scopedStorage } from './storageUtils'
export const performCheckIn = (isRelapse, currentStreak) => {
    const todayStr = new Date().toISOString().split('T')[0]

    // 1. 计算新的连胜天数
    // 逻辑：无论是否破戒，只要记录了，我们都算坚持了一天（只是破戒会有金钱惩罚）
    const newStreak = currentStreak + 1

    // 2. 存基础状态
    scopedStorage.setItem('lastCheckDate', todayStr)
    scopedStorage.setItem('streak', newStreak)
    scopedStorage.setItem('isRelapse', isRelapse)

    // 3. 处理罚金逻辑 (Money Logic)
    if (isRelapse) {
        const currentPenalty = parseInt(scopedStorage.getItem('penalty') || '0')
        // 惩罚机制：本来+20，现在-10，所以总共扣30
        scopedStorage.setItem('penalty', currentPenalty + 30)
    }

    // 4. 处理热力图日志 (History Log Logic) - 这就是你刚才新增的部分
    const historyLog = JSON.parse(scopedStorage.getItem('historyLog') || '{}')
    historyLog[todayStr] = isRelapse ? 'relapse' : 'success'
    scopedStorage.setItem('historyLog', JSON.stringify(historyLog))

    // 返回新的 streak 方便 UI 更新
    return newStreak
}

// 获取当前的连胜状态
export const checkStreakLogic = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    const lastDate = scopedStorage.getItem('lastCheckDate')
    const savedStreak = parseInt(scopedStorage.getItem('streak') || '0')
    const relapseStatus = scopedStorage.getItem('isRelapse') === 'true'

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
