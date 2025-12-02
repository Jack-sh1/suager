import { HashRouter, rowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import { CalendarOutline, SearchOutline, HistogramOutline } from 'antd-mobile-icons'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Achievement from './pages/Achievement'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider, useAuth } from './context/AuthContext'

// 路由守卫组件
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return null // 或者加载动画
  if (!user) return <Navigate to="/login" replace />

  return children
}

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  // 在登录/注册页不显示底部导航
  if (['/login', '/register'].includes(pathname)) return null

  const tabs = [
    { key: '/', title: '打卡', icon: <CalendarOutline /> },
    { key: '/tools', title: '工具', icon: <SearchOutline /> },
    { key: '/achievement', title: '成就', icon: <HistogramOutline /> },
  ]

  return (
    <TabBar
      activeKey={pathname}
      onChange={value => navigate(value)}
      className="fixed bottom-0 w-full bg-white border-t border-gray-100 z-50"
    >
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-50 pb-16 font-sans">
          {/* 页面内容区 */}
          <div className="max-w-md mx-auto">
            <Routes>
              {/* 公开路由 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 受保护路由 */}
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="p-4"><Home /></div>
                </ProtectedRoute>
              } />
              <Route path="/tools" element={
                <ProtectedRoute>
                  <div className="p-4"><Tools /></div>
                </ProtectedRoute>
              } />
              <Route path="/achievement" element={
                <ProtectedRoute>
                  <div className="p-4"><Achievement /></div>
                </ProtectedRoute>
              } />
            </Routes>
          </div>

          {/* 底部导航 */}
          <div className="max-w-md mx-auto">
            <BottomNav />
          </div>
        </div>
      </HashRouter>
    </AuthProvider>
  )
}

export default App
