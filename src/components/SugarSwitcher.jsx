import React, { useState } from 'react'
// 1. 补全引入：ErrorBlock 和 Icons
import { SearchBar, Card, Tag, ErrorBlock } from 'antd-mobile'
import { FireFill, CheckCircleFill } from 'antd-mobile-icons'
import { SUGAR_DB } from '../data/sugar_db'

const SugarSwitcher = () => {
  const [query, setQuery] = useState('')
  
  const searchResult = SUGAR_DB.find(item => 
    item.match.some(m => m.includes(query)) || item.keyword.includes(query)
  )

  // 2. 颜色辅助函数：让卡片颜色随结果变化
  const getStyle = (type) => {
    switch (type) {
      case 'danger': return { color: '#ef4444', bg: '#fef2f2', border: '#ef4444' }
      case 'warning': return { color: '#f59e0b', bg: '#fffbeb', border: '#f59e0b' }
      case 'success': return { color: '#16a34a', bg: '#f0fdf4', border: '#16a34a' }
      default: return { color: '#16a34a', bg: '#f0fdf4', border: '#16a34a' }
    }
  }

  const resultStyle = searchResult ? getStyle(searchResult.color) : {}

  return (
    <div className="space-y-4 px-1">
      {/* 搜索框容器：加个阴影让它浮起来 */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 sticky top-0 z-10">
        <SearchBar 
          placeholder="搜一下：奶茶、可乐..." 
          value={query}
          onChange={setQuery}
          style={{ '--background': 'transparent' }}
        />
      </div>

      {query ? (
        searchResult ? (
          // --- 搜索结果卡片 ---
          <Card 
            className="rounded-2xl shadow-md animate-fade-in"
            style={{ 
              backgroundColor: resultStyle.bg,
              borderLeft: `6px solid ${resultStyle.border}`
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold m-0 flex items-center gap-2" style={{ color: resultStyle.color }}>
                {searchResult.color === 'success' ? <CheckCircleFill /> : '⚠️'} 
                推荐替代
              </h3>
              <Tag color={searchResult.color} fill="outline">
                {searchResult.color === 'success' ? '健康' : '更优'}选择
              </Tag>
            </div>
            
            <div className="text-xl font-medium mb-4 text-gray-800">
              {searchResult.replace}
            </div>
            
            <div className="bg-white/60 p-3 rounded-lg text-sm flex items-center justify-between" style={{ color: resultStyle.color }}>
              <span className="opacity-80">⚡️ 帮你省下糖分</span>
              <span className="font-bold text-lg">{searchResult.save}</span>
            </div>
          </Card>
        ) : (
          // --- 空状态 (ErrorBlock) ---
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm mt-4">
            <ErrorBlock 
              status="empty" 
              title="暂无收录" 
              description={
                <span className="text-gray-400">
                  太生僻了，建议直接喝 <b className="text-blue-500">白开水</b> 保平安！
                </span>
              } 
            />
          </div>
        )
      ) : (
        // --- 热门搜索卡片 ---
        <Card 
          title={
            <div className="flex items-center gap-1 text-gray-700">
              <FireFill className="text-orange-500 text-lg"/> 
              <span className="font-bold">大家都在搜</span>
            </div>
          } 
          className="rounded-2xl border-none shadow-sm"
        >
          <div className="flex flex-wrap gap-3">
            {SUGAR_DB.slice(0, 8).map(item => (
              <Tag 
                key={item.id} 
                fill="outline" 
                color="default"
                className="px-4 py-2 text-sm active:scale-95 transition-transform"
                onClick={() => setQuery(item.keyword)}
                style={{ 
                  '--border-radius': '100px', 
                  border: '1px solid #f3f4f6',
                  backgroundColor: '#f9fafb',
                  color: '#4b5563'
                }}
              >
                {item.keyword}
              </Tag>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default SugarSwitcher
