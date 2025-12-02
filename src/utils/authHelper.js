// 获取当前登录用户的 ID
export const getCurrentUserId = () => {
    const userJson = localStorage.getItem('currentUser')
    if (!userJson) return 'guest' // 游客模式（如果没登录）
    const user = JSON.parse(userJson)
    return `user_${user.id}` // 返回类似 'user_1701234567' 的前缀
}

// 自动拼接 Key 的工具函数
// 输入 'streak' -> 输出 'user_123_streak'
export const getUserKey = (key) => {
    const prefix = getCurrentUserId()
    return `${prefix}_${key}`
}
