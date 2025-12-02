import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 初始化检查登录状态
        const storedUser = localStorage.getItem('currentUser')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = (username, password) => {
        // 模拟从数据库查找用户
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const foundUser = users.find(u => u.username === username && u.password === password)

        if (foundUser) {
            const userData = { username: foundUser.username, nickname: foundUser.nickname || username }
            setUser(userData)
            localStorage.setItem('currentUser', JSON.stringify(userData))
            return { success: true }
        } else {
            return { success: false, message: '用户名或密码错误' }
        }
    }

    const register = (username, password, nickname) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')

        if (users.find(u => u.username === username)) {
            return { success: false, message: '用户名已存在' }
        }

        const newUser = { username, password, nickname }
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))

        // 注册后自动登录
        setUser({ username, nickname })
        localStorage.setItem('currentUser', JSON.stringify({ username, nickname }))

        return { success: true }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('currentUser')
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
