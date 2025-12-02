import React, { useState } from 'react'
import { SearchBar, Card, Tag, Empty } from 'antd-mobile'

// 数据源跟随组件走，方便维护
const SUGAR_DB = [
  { id: 1, keyword: '奶茶', match: ['奶茶', '波霸', '珍奶'], replace: '无糖乌龙茶 + 鲜奶', save: '50g', color: 'success' },
  { id: 2, keyword: '可乐', match: ['可乐', '快乐水', '雪碧'], replace: '零度可乐 / 气泡水', save: '35g', color: 'primary' },
  { id: 3, keyword: '蛋糕', match: ['蛋糕', '甜点', '提拉米苏'], replace: '85% 黑巧克力', save: '40g', color: 'warning' },
  { id: 4, keyword: '果汁', match: ['橙汁', '果汁'], replace: '新鲜水果 / 柠檬水', save: '20g', color: 'success' },
]

const SugarSwitcher = () => {
  const [query, setQuery] = useState('')
  const searchResult = SUGAR_DB.find(item => 
    item.match.some(m => m.includes(query)) || item.keyword.includes(query)
  )

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <SearchBar 
        placeholder="搜一下：奶茶、可乐..." 
        value={query}
        onChange={setQuery}
        style={{ '--background': '#ffffff', '--border-radius': '100px' }}
      />

      {/* 结果区 */}
      {query ? (
        searchResult ? (
          <Card className="rounded-2xl border-l-4 border-green-500 animate-fade-in">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-green-800 m-0">✅ 推荐替代</h3>
              <Tag color="success" fill="outline">健康选择</Tag>
            </div>
            <div className="text-xl font-medium mb-4 text-gray-700">{searchResult.replace}</div>
            <div className="bg-green-50 p-3 rounded-lg text-green-700 text-sm flex items-center justify-between">
              <span>⚡️ 帮你省下糖分</span>
              <span className="font-bold text-lg">{searchResult.save}</span>
            </div>
          </Card>
        ) : (
          <Empty description="暂无收录，建议喝白开水" />
        )
      ) : (
        <div>
          <div className="text-sm text-gray-400 mb-3">热门搜索</div>
          <div className="flex flex-wrap gap-2">
            {['奶茶', '可乐', '蛋糕'].map(tag => (
              <Tag key={tag} round className="py-1 px-3" onClick={() => setQuery(tag)}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SugarSwitcher
