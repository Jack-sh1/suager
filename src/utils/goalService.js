const STORAGE_KEY = 'saving_goals'
const CURRENT_ID_KEY = 'current_goal_id'

// 默认目标
const DEFAULT_GOALS = [
    { id: 1, name: 'SK-II 神仙水', price: 1540 },
    { id: 2, name: 'Switch 游戏机', price: 2099 },
    { id: 3, name: '三亚五日游', price: 5000 }
]

// 1. Read: 获取所有目标
export const getGoals = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : DEFAULT_GOALS
}

// 2. Read: 获取当前选中的目标
export const getCurrentGoal = () => {
    const goals = getGoals()
    const currentId = parseInt(localStorage.getItem(CURRENT_ID_KEY) || '1')
    return goals.find(g => g.id === currentId) || goals[0]
}

// 3. Create: 新增目标
export const addGoal = (name, price) => {
    const goals = getGoals()
    const newGoal = { id: Date.now(), name, price: Number(price) }
    const newList = [...goals, newGoal]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
    // 新增后自动设为当前目标
    localStorage.setItem(CURRENT_ID_KEY, newGoal.id)

    return { list: newList, current: newGoal }
}

// 4. Update: 切换当前目标
export const setActiveGoal = (id) => {
    localStorage.setItem(CURRENT_ID_KEY, id)
    return getCurrentGoal()
}

// 5. Delete: 删除目标
export const deleteGoal = (id) => {
    const goals = getGoals()
    // 不允许删除最后一个，至少保留一个
    if (goals.length <= 1) return { success: false }

    const newList = goals.filter(g => g.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList))

    // 如果删的是当前正选中的，重置为列表第一个
    const currentId = parseInt(localStorage.getItem(CURRENT_ID_KEY))
    if (currentId === id) {
        localStorage.setItem(CURRENT_ID_KEY, newList[0].id)
    }

    return { success: true, list: newList, current: getCurrentGoal() }
}
// 6. 热门心愿推荐库 (数据源)
export const WISH_LIBRARY = [
    {
        category: '数码控', list: [
            { name: 'PS5 光驱版', price: 3599 },
            { name: 'iPhone 15 Pro', price: 7999 },
            { name: 'AirPods Pro', price: 1899 },
            { name: 'Switch OLED', price: 2100 }
        ]
    },
    {
        category: '爱生活', list: [
            { name: '戴森吹风机', price: 2990 },
            { name: 'Lamer 面霜', price: 1500 },
            { name: '环球影城门票', price: 600 },
            { name: '乐高迪士尼城堡', price: 2999 }
        ]
    },
    {
        category: '大梦想', list: [
            { name: '存钱买房', price: 1000000 },
            { name: '欧洲十日游', price: 25000 },
            { name: 'LV 经典包', price: 15000 }
        ]
    }
]

