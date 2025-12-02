import React, { useState } from 'react'
import { Button, TextArea } from 'antd-mobile'

// 这里的规则数据只服务于这个组件，所以直接放这里
const INGREDIENT_RULES = {
  danger: ['白砂糖', '蔗糖', '果葡糖浆', '麦芽糖', '蜂蜜', '浓缩果汁'],
  warning: ['赤藓糖醇', '阿斯巴甜', '安赛蜜', '麦芽糊精', '代糖'],
  safe: ['水', '生牛乳', '全麦粉', '赤小豆', '鸡蛋']
}

const LabelDecoder = () => {
  const [input, setInput] = useState('')
  const [analysis, setAnalysis] = useState(null)

  const analyzeIngredients = () => {
    if (!input.trim()) return
    
    const foundDanger = INGREDIENT_RULES.danger.find(word => input.includes(word))
    const foundWarning = INGREDIENT_RULES.warning.find(word => input.includes(word))
    
    if (foundDanger) {
      setAnalysis({ 
        level: 'danger', 
        title: '🔴 警报：这是糖水！', 
        desc: `发现了核心糖分"${foundDanger}"，排位越靠前越危险！`,
        color: '#ef4444',
        bg: '#fef2f2'
      })
    } else if (foundWarning) {
      setAnalysis({ 
        level: 'warning', 
        title: '🟡 提醒：含代糖/糊精', 
        desc: `发现了"${foundWarning}"，虽然热量低但不要贪杯哦。`,
        color: '#f59e0b',
        bg: '#fffbeb'
      })
    } else {
      setAnalysis({ 
        level: 'safe', 
        title: '🟢 看起来还不错', 
        desc: '前几位配料比较干净，可以适量食用。',
        color: '#22c55e',
        bg: '#f0fdf4'
      })
    }
  }

  return (
    <div className="space-y-5 px-1">
      {/* 提示卡片 */}
      <div className="bg-blue-50 text-blue-600 text-sm p-4 rounded-xl border border-blue-100 flex items-start gap-2">
        <span className="text-lg">💡</span>
        <span className="leading-relaxed">小技巧：输入配料表的前 3 位名称即可。<br/>例如：<span className="font-mono bg-blue-100 px-1 rounded">水、白砂糖、全脂乳粉</span></span>
      </div>

      {/* 输入框 */}
      <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 focus-within:ring-2 ring-primary/20 transition-all">
        <TextArea
          placeholder="在此粘贴或输入配料名称..."
          value={input}
          onChange={setInput}
          autoSize={{ minRows: 3, maxRows: 5 }}
          style={{ '--font-size': '16px', padding: '12px' }}
        />
      </div>

      {/* 按钮 */}
      <Button 
        block 
        color="primary" 
        shape="rounded" 
        size="large"
        onClick={analyzeIngredients}
        disabled={!input}
        className="mt-6 font-bold shadow-lg shadow-primary/40 active:scale-95 transition-transform"
      >
        ⚡️ 开始扫雷分析
      </Button>

      {/* 结果卡片 */}
      {analysis && (
        <div 
          className="rounded-2xl p-5 shadow-md animate-fade-in-up"
          style={{ 
            backgroundColor: analysis.bg, 
            borderLeft: `5px solid ${analysis.color}` 
          }}
        >
          <h3 className="text-lg font-bold m-0 mb-2" style={{ color: analysis.color }}>
            {analysis.title}
          </h3>
          <p className="text-gray-700 m-0 leading-relaxed">
            {analysis.desc}
          </p>
        </div>
      )}
    </div>
  )
}

export default LabelDecoder
