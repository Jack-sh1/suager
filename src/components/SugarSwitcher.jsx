import React, { useState, useEffect } from 'react'
import { SearchBar, Card, Tag, ErrorBlock, FloatingBubble, Modal, Form, Input, Toast, ActionSheet } from 'antd-mobile'
import { AddOutline, CheckCircleFill, FireFill } from 'antd-mobile-icons'
// 引入刚才写的服务
import { getFoods, addFood, updateFood, deleteFood } from '../utils/sugarService'

const SugarSwitcher = () => {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')

  // 弹窗控制状态
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingItem, setEditingItem] = useState(null) // 当前正在编辑的对象

  // 初始化加载数据
  useEffect(() => {
    setItems(getFoods())
  }, [])

  // --- CRUD 交互逻辑 ---

  // 1. 提交表单 (新增或修改)
  const handleSubmit = () => {
    const values = form.getFieldsValue()
    if (!values.keyword || !values.replace) {
      Toast.show('请填写完整信息')
      return
    }

    // 构造数据格式
    const foodData = {
      keyword: values.keyword,
      match: [values.keyword], // 简单处理，匹配词就是名字本身
      replace: values.replace,
      save: values.save || '未知',
    }

    if (editingItem) {
      // Update (改)
      const updatedList = updateFood({ ...editingItem, ...foodData })
      setItems(updatedList)
      Toast.show('修改成功')
    } else {
      // Create (增)
      const newList = addFood(foodData)
      setItems(newList)
      Toast.show('添加成功')
    }

    setVisible(false)
    setEditingItem(null)
    form.resetFields()
  }

  // 2. 点击卡片处理 (如果是自定义的，弹出菜单)
  const handleCardClick = async (item) => {
    if (!item.isCustom) return // 默认数据不允许修改

    const action = await ActionSheet.show({
      actions: [
        { key: 'edit', text: '编辑', description: '修改这条记录' },
        { key: 'delete', text: '删除', description: '删除后无法恢复', danger: true },
      ],
      extra: '管理自定义数据',
      cancelText: '取消',
    })

    if (action?.key === 'delete') {
      // Delete (删)
      setItems(deleteFood(item.id))
      Toast.show('已删除')
    } else if (action?.key === 'edit') {
      // 打开编辑弹窗
      setEditingItem(item)
      form.setFieldsValue(item) // 回填数据
      setVisible(true)
    }
  }

  // 打开新增弹窗
  const openAddModal = () => {
    setEditingItem(null)
    form.resetFields()
    setVisible(true)
  }

  // --- 搜索逻辑 ---
  const searchResult = items.find(item =>
    item.match.some(m => m.includes(query)) || item.keyword.includes(query)
  )

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
    <div className="space-y-4 px-1 pb-20">
      {/* 搜索框 */}
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
          // 结果卡片 (增加点击事件)
          <Card
            className="rounded-2xl shadow-md animate-fade-in active:scale-95 transition-transform"
            onClick={() => handleCardClick(searchResult)}
            style={{
              backgroundColor: resultStyle.bg,
              borderLeft: `6px solid ${resultStyle.border}`
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold m-0 flex items-center gap-2" style={{ color: resultStyle.color }}>
                {searchResult.isCustom ? '👤 自定义' : (searchResult.color === 'success' ? <CheckCircleFill /> : '⚠️ 推荐替代')}
              </h3>
              {searchResult.isCustom && <Tag color="primary">可编辑</Tag>}
            </div>
            <div className="text-xl font-medium mb-4 text-gray-800">{searchResult.replace}</div>
            <div className="bg-white/60 p-3 rounded-lg text-sm flex items-center justify-between" style={{ color: resultStyle.color }}>
              <span className="opacity-80">⚡️ 帮你省下糖分</span>
              <span className="font-bold text-lg">{searchResult.save}</span>
            </div>
          </Card>
        ) : (
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm mt-4">
            <ErrorBlock status="empty" title="暂无收录" description="点右下角 + 号，添加你的独家秘籍！" />
          </div>
        )
      ) : (
        // 热门搜索 (显示前10个，包含自定义的)
        <Card
          title={<div className="flex items-center gap-1"><FireFill className="text-orange-500" /> <span>大家都在搜</span></div>}
          className="rounded-2xl border-none shadow-sm"
        >
          <div className="flex flex-wrap gap-3">
            {items.slice(0, 10).map(item => (
              <Tag
                key={item.id}
                fill="outline"
                color={item.isCustom ? 'primary' : 'default'}
                className="px-4 py-2 text-sm"
                onClick={() => setQuery(item.keyword)}
                style={{ '--border-radius': '100px' }}
              >
                {item.keyword}
              </Tag>
            ))}
          </div>
        </Card>
      )}

      {/* 悬浮新增按钮 */}
      <FloatingBubble
        axis="xy"
        magnetic="x"
        style={{ '--initial-position-bottom': '80px', '--initial-position-right': '24px' }}
        onClick={openAddModal}
      >
        <AddOutline fontSize={32} />
      </FloatingBubble>

      {/* 新增/编辑弹窗 */}
      <Modal
        visible={visible}
        title={editingItem ? "编辑替代品" : "新增替代品"}
        content={
          <Form form={form} layout='horizontal'>
            <Form.Item name='keyword' label='想吃...' rules={[{ required: true }]}>
              <Input placeholder='如：薯片' />
            </Form.Item>
            <Form.Item name='replace' label='替代成...' rules={[{ required: true }]}>
              <Input placeholder='如：海苔' />
            </Form.Item>
            <Form.Item name='save' label='省糖量'>
              <Input placeholder='如：20g' />
            </Form.Item>
          </Form>
        }
        closeOnAction
        showCloseButton
        onClose={() => setVisible(false)}
        actions={[
          { key: 'confirm', text: '保存', primary: true, onClick: handleSubmit },
          // { key: 'cancel', text: '取消', onClick: () => setVisible(false) }, // Modal actions 通常自动带取消逻辑，或点击遮罩关闭
        ]}
      />
    </div>
  )
}

export default SugarSwitcher
