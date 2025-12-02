import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  // 定义通用样式
  const navStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '60px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #eaeaea',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
    paddingBottom: 'safe-area-inset-bottom' // 适配 iPhone 底部横条
  };

  // 定义每个链接的样式逻辑
  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: isActive ? '#22c55e' : '#9ca3af', // 选中变绿，未选中灰
    fontSize: '12px'
  });

  return (
    <div style={navStyle}>
      <NavLink to="/" style={linkStyle}>
        <span style={{ fontSize: '20px', marginBottom: '2px' }}>📅</span>
        打卡
      </NavLink>
      
      <NavLink to="/tools" style={linkStyle}>
        <span style={{ fontSize: '20px', marginBottom: '2px' }}>🔍</span>
        工具
      </NavLink>
      
      <NavLink to="/achievement" style={linkStyle}>
        <span style={{ fontSize: '20px', marginBottom: '2px' }}>🏆</span>
        成就
      </NavLink>
    </div>
  );
};

export default BottomNav;
