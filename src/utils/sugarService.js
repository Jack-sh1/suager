import { SUGAR_DB as DEFAULT_DB } from '../data/sugar_db'
import { scopedStorage } from './storageUtils'

const STORAGE_KEY = 'custom_sugar_db'

// 1. Read (查): 获取所有食物 (用户自定义 + 默认)
export const getFoods = () => {
    const custom = JSON.parse(scopedStorage.getItem(STORAGE_KEY) || '[]')
    // 把用户自定义的放在最前面，方便看到
    return [...custom, ...DEFAULT_DB]
}

// 2. Create (增): 添加新食物
export const addFood = (food) => {
    const custom = JSON.parse(scopedStorage.getItem(STORAGE_KEY) || '[]')
    const newFood = {
        ...food,
        id: Date.now(), // 用时间戳做唯一ID
        isCustom: true, // 标记为自定义，允许删除
        color: 'success' // 默认给个绿色
    }
    const newList = [newFood, ...custom]
    scopedStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
    return getFoods() // 返回最新列表
}

// 3. Update (改): 修改自定义食物
export const updateFood = (updatedFood) => {
    const custom = JSON.parse(scopedStorage.getItem(STORAGE_KEY) || '[]')
    const newList = custom.map(item => item.id === updatedFood.id ? updatedFood : item)
    scopedStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
    return getFoods()
}

// 4. Delete (删): 删除自定义食物
export const deleteFood = (id) => {
    const custom = JSON.parse(scopedStorage.getItem(STORAGE_KEY) || '[]')
    const newList = custom.filter(item => item.id !== id)
    scopedStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
    return getFoods()
}
