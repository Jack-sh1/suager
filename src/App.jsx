import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import { CalendarOutline, SearchOutline, HistogramOutline } from 'antd-mobile-icons'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Achievement from './pages/Achievement'

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

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
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-16 font-sans">
        {/* 页面内容区 */}
        <div className="p-4 max-w-md mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/achievement" element={<Achievement />} />
          </Routes>
        </div>
        {/* 底部导航 */}
        <div className="max-w-md mx-auto">
           <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
