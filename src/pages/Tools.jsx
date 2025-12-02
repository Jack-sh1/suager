import React from 'react'
import { Tabs } from 'antd-mobile'
// 引入两个独立组件
import SugarSwitcher from '../components/SugarSwitcher'
import LabelDecoder from '../components/LabelDecoder'

const Tools = () => {
  return (
    <div className="pt-2 h-full">
      <h1 className="text-xl font-bold text-gray-800 mb-4 px-2">🛠️ 戒糖工具箱</h1>
      
      <Tabs defaultActiveKey="replace" style={{ '--content-padding': '16px 0' }}>
        
        <Tabs.Tab title="查替代" key="replace">
          <SugarSwitcher />
        </Tabs.Tab>

        <Tabs.Tab title="扫配料" key="scan">
          <LabelDecoder />
        </Tabs.Tab>

      </Tabs>
    </div>
  )
}

export default Tools
