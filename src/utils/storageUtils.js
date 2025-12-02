// 获取当前登录用户的 ID
export const getCurrentUserId = () => {
    try {
        const userStr = localStorage.getItem('currentUser')
        if (!userStr) return 'guest' // 未登录用户归为 guest
        const user = JSON.parse(userStr)
        return user.username || 'guest'
    } catch (e) {
        return 'guest'
    }
}

// 生成带用户前缀的 Key
export const getScopedKey = (key) => {
    const userId = getCurrentUserId()
    return `user_${userId}_${key}`
}

// 封装带作用域的 Storage 操作
export const scopedStorage = {
    getItem: (key) => {
        return localStorage.getItem(getScopedKey(key))
    },
    setItem: (key, value) => {
        localStorage.setItem(getScopedKey(key), value)
    },
    removeItem: (key) => {
        localStorage.removeItem(getScopedKey(key))
    }
}
