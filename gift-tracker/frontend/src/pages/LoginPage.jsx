import React, { useState } from 'react';
import { Form, Input, Button, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, HeartFilled, GiftOutlined, SafetyOutlined } from '@ant-design/icons';
import axios from 'axios';
import './LoginPage.css';

const API_BASE = 'http://localhost:9000/api/auth';

function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/login`, values);
      const { token, userId, username, nickname } = response.data;
      
      message.success({
        content: '登录成功',
        duration: 2,
        className: 'success-toast'
      });
      
      setTimeout(() => {
        onLogin({ id: userId, username, nickname }, token);
      }, 500);
    } catch (error) {
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || '登录失败';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/register`, values);
      const { token, userId, username, nickname } = response.data;
      
      message.success({
        content: '注册成功',
        duration: 2,
        className: 'success-toast'
      });
      
      setTimeout(() => {
        onLogin({ id: userId, username, nickname }, token);
      }, 500);
    } catch (error) {
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || '注册失败';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'login',
      label: '登录',
      children: (
        <Form form={loginForm} onFinish={handleLogin} layout="vertical" requiredMark={false}>
          <div className="input-wrapper">
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
            </Form.Item>
          </div>
          
          <div className="input-wrapper">
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
            </Form.Item>
          </div>
          
          <Form.Item className="submit-wrapper">
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {loading ? '登录中' : '登录'}
            </Button>
          </Form.Item>
          
          <div className="form-hint">
            <SafetyOutlined /> 安全登录，数据加密传输
          </div>
        </Form>
      )
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <Form form={registerForm} onFinish={handleRegister} layout="vertical" requiredMark={false}>
          <div className="input-wrapper">
            <Form.Item 
              name="username" 
              rules={[{ required: true, message: '请输入用户名' }, { min: 3, message: '至少3个字符' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名（至少3个字符）" size="large" />
            </Form.Item>
          </div>
          
          <div className="input-wrapper">
            <Form.Item 
              name="password" 
              rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '至少6个字符' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码（至少6个字符）" size="large" />
            </Form.Item>
          </div>
          
          <div className="input-wrapper">
            <Form.Item name="email" rules={[{ type: 'email', message: '邮箱格式不正确' }]}>
              <Input prefix={<MailOutlined />} placeholder="邮箱（可选）" size="large" />
            </Form.Item>
          </div>
          
          <div className="input-wrapper">
            <Form.Item name="nickname">
              <Input prefix={<HeartFilled />} placeholder="昵称（可选）" size="large" />
            </Form.Item>
          </div>
          
          <Form.Item className="submit-wrapper">
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {loading ? '注册中' : '注册'}
            </Button>
          </Form.Item>
          
          <div className="form-hint">
            <SafetyOutlined /> 注册即表示同意服务条款
          </div>
        </Form>
      )
    }
  ];

  return (
    <div className="login-page">
      {/* 背景装饰 */}
      <div className="bg-gradient" />
      <div className="bg-grid" />
      <div className="floating-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>
      
      <div className="login-container">
        {/* 左侧品牌区 */}
        <div className="brand-section">
          <div className="brand-content">
            <div className="brand-icon">
              <span className="icon-emoji">💰</span>
              <div className="icon-ring" />
            </div>
            <h1 className="brand-title">人情往来账</h1>
            <p className="brand-desc">记录每一份人情<br />珍惜每一份往来</p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-dot" />
                <span>智能记账</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot" />
                <span>往来分析</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot" />
                <span>提醒待办</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧表单区 */}
        <div className="form-section">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            centered
            size="large"
            className="auth-tabs"
          />
          
          <div className="form-footer">
            <span className="footer-line" />
            <span className="footer-text">安全可靠</span>
            <span className="footer-line" />
          </div>
        </div>
      </div>
      
      <div className="copyright">
        <span>© 2026 人情往来账 · 用心记录每一份情谊</span>
      </div>
    </div>
  );
}

export default LoginPage;