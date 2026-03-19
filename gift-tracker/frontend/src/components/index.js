// 动画组件库
import React from 'react';
import './Animations.css';

// 淡入动画包装器
export function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <div 
      className={`fade-in-wrapper ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// 滑入动画包装器
export function SlideIn({ children, direction = 'up', delay = 0, className = '' }) {
  return (
    <div 
      className={`slide-in-wrapper slide-in-${direction} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// 缩放动画包装器
export function ScaleIn({ children, delay = 0, className = '' }) {
  return (
    <div 
      className={`scale-in-wrapper ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// 悬停卡片组件
export function HoverCard({ children, className = '', onClick }) {
  return (
    <div 
      className={`hover-card ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// 加载骨架屏
export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px' }) {
  return (
    <div 
      className="skeleton"
      style={{ width, height, borderRadius }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <Skeleton width="40px" height="40px" borderRadius="50%" />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height="16px" />
        <Skeleton width="40%" height="14px" />
      </div>
    </div>
  );
}

// 浮动按钮组件
export function FloatingActionButton({ icon, onClick, color = 'primary' }) {
  return (
    <button 
      className={`fab ${color}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

// 统计卡片组件
export function StatCard({ 
  icon, 
  label, 
  value, 
  prefix = '', 
  type = 'default',
  className = '' 
}) {
  return (
    <div className={`stat-card stat-card-${type} ${className}`}>
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${parseFloat(value) < 0 ? 'negative' : ''}`}>
        {prefix}{typeof value === 'number' ? value.toFixed(2) : value}
      </div>
    </div>
  );
}

// 时间线项组件
export function TimelineItem({ 
  type, 
  title, 
  meta, 
  amount, 
  remark, 
  date, 
  actions 
}) {
  return (
    <div className="timeline-item">
      <div className="timeline-marker">
        <div className={`timeline-dot ${type}`}>
        </div>
        <div className="timeline-date">
          {date}
        </div>
      </div>
      
      <div className="timeline-content">
        <div className="timeline-info">
          <h3>
            <span className={`timeline-tag ${type}`}>
              {type === 'give' ? '🎁 送礼' : '💝 收礼'}
            </span>
            <span className="person-name">{title}</span>
          </h3>
          <p className="timeline-meta">{meta}</p>
          {remark && <p className="timeline-remark">"{remark}"</p>}
        </div>
        
        <div className="timeline-actions">
          <div className={`timeline-amount ${type}`}>
            {type === 'give' ? '-' : '+'}¥{amount.toFixed(2)}
          </div>
          <div className="timeline-btn-group">
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}