import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  DatePicker, 
  message, 
  Dropdown,
  Empty,
  Spin,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  LogoutOutlined, 
  UserOutlined,
  GiftOutlined,
  HeartFilled,
  TrophyOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
  HomeOutlined,
  BookOutlined,
  CompassOutlined,
  MoreOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import './MainPage.css';

const { TextArea } = Input;

const API_BASE = 'http://localhost:9000/api/gifts';

// 配置 axios 拦截器
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

function MainPage({ user, onLogout }) {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordsRes, statsRes] = await Promise.all([
        axios.get(API_BASE),
        axios.get(`${API_BASE}/stats`)
      ]);
      setRecords(recordsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('获取数据失败:', error);
      if (error.response?.status !== 401) {
        message.error('获取数据失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const data = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        amount: parseFloat(values.amount),
      };

      if (editingRecord) {
        await axios.put(`${API_BASE}/${editingRecord.id}`, data);
        message.success('✨ 更新成功！');
      } else {
        await axios.post(API_BASE, data);
        message.success('✨ 添加成功！');
      }

      setModalOpen(false);
      form.resetFields();
      setEditingRecord(null);
      setSelectedType(null);
      fetchData();
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      message.success('🗑️ 删除成功！');
      fetchData();
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setSelectedType(record.type);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingRecord(null);
    setSelectedType(null);
    setModalOpen(true);
    // 延迟重置表单，确保 Modal 已渲染
    setTimeout(() => {
      form.resetFields();
    }, 0);
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: onLogout
    }
  ];

  // 事件类型配置
  const eventTypes = [
    { value: '婚礼', icon: <HeartFilled />, color: '#ff6b6b' },
    { value: '生日', icon: <GiftOutlined />, color: '#1890ff' },
    { value: '满月', icon: <TrophyOutlined />, color: '#52c41a' },
    { value: '升学', icon: <BookOutlined />, color: '#722ed1' },
    { value: '乔迁', icon: <HomeOutlined />, color: '#fa8c16' },
    { value: '丧事', icon: <CompassOutlined />, color: '#8c8c8c' },
    { value: '其他', icon: <FileTextOutlined />, color: '#13c2c2' },
  ];

  const getEventIcon = (eventType) => {
    const event = eventTypes.find(e => e.value === eventType);
    return event?.icon || <FileTextOutlined />;
  };

  // 渲染统计卡片
  const renderStats = () => {
    if (!stats) return null;
    
    const statCards = [
      {
        key: 'give',
        icon: <GiftOutlined />,
        label: '累计送礼',
        value: stats.totalGive || 0,
        prefix: '-¥',
        className: 'give'
      },
      {
        key: 'receive',
        icon: <HeartFilled />,
        label: '累计收礼',
        value: stats.totalReceive || 0,
        prefix: '+¥',
        className: 'receive'
      },
      {
        key: 'balance',
        icon: <DollarOutlined />,
        label: '净余额',
        value: Math.abs(stats.netBalance || 0),
        prefix: stats.netBalance < 0 ? '-¥' : '¥',
        className: 'balance',
        isNegative: stats.netBalance < 0
      },
      {
        key: 'count',
        icon: <FileTextOutlined />,
        label: '记录总数',
        value: records.length,
        prefix: '',
        className: 'count'
      }
    ];

    return (
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div 
            key={card.key} 
            className={`stat-card ${card.className}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="stat-icon">
              {card.icon}
            </div>
            <div className="stat-label">{card.label}</div>
            <div className={`stat-value ${card.isNegative ? 'negative' : ''}`}>
              {card.prefix}{card.value.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染时间线记录
  const renderTimeline = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
          <p>加载中...</p>
        </div>
      );
    }

    if (records.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p className="empty-text">暂无往来记录</p>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={openAddModal}
            size="large"
          >
            添加第一条记录
          </Button>
        </div>
      );
    }

    // 按日期排序
    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    return (
      <div className="timeline-container">
        {sortedRecords.map((record, index) => (
          <div 
            key={record.id} 
            className="timeline-item"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="timeline-marker">
              <div className={`timeline-dot ${record.type === 'GIVE' ? 'give' : 'receive'}`}>
              </div>
              <div className="timeline-date">
                {dayjs(record.date).format('MM/DD')}
              </div>
            </div>
            
            <div className="timeline-content">
              <div className="timeline-info">
                <h3>
                  <span className={`timeline-tag ${record.type === 'GIVE' ? 'give' : 'receive'}`}>
                    {record.type === 'GIVE' ? '🎁 送礼' : '💝 收礼'}
                  </span>
                  <span className="person-name">{record.personName}</span>
                </h3>
                <p className="timeline-meta">
                  {getEventIcon(record.eventType)} {record.eventType} · {record.date}
                </p>
                {record.remark && (
                  <p className="timeline-remark">"{record.remark}"</p>
                )}
              </div>
              
              <div className="timeline-actions">
                <div className={`timeline-amount ${record.type === 'GIVE' ? 'give' : 'receive'}`}>
                  {record.type === 'GIVE' ? '-' : '+'}¥{record.amount.toFixed(2)}
                </div>
                <div className="timeline-btn-group">
                  <Button 
                    size="small" 
                    icon={<EditOutlined />} 
                    onClick={() => handleEdit(record)}
                    type="text"
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确定要删除这条记录吗？"
                    onConfirm={() => handleDelete(record.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button 
                      size="small" 
                      danger 
                      icon={<DeleteOutlined />}
                      type="text"
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* 头部 */}
      <header className="header">
        <div className="header-content">
          <h1>
            <span className="header-icon">💰</span>
            人情往来账
          </h1>
          <p>记录每一份人情，珍惜每一份往来</p>
        </div>
        
        <Dropdown 
          menu={{ items: userMenuItems }} 
          placement="bottomRight"
          trigger={['click']}
        >
          <div className="user-dropdown">
            <div className="user-avatar">
              {(user?.nickname || user?.username || '用').charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.nickname || user?.username}</div>
              <div className="user-role">记录员</div>
            </div>
          </div>
        </Dropdown>
      </header>

      {/* 统计卡片 */}
      {renderStats()}

      {/* 记录列表 */}
      <div className="record-list-container">
        <div className="record-list">
          <div className="record-list-header">
            <h2>
              <TeamOutlined /> 往来记录
            </h2>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={openAddModal}
            >
              添加记录
            </Button>
          </div>
          {renderTimeline()}
        </div>
      </div>

      {/* 浮动添加按钮 */}
      <button className="fab-button" onClick={openAddModal}>
        <PlusOutlined />
      </button>

      {/* 添加/编辑弹窗 */}
      <Modal
        title={editingRecord ? '✏️ 编辑记录' : '➕ 添加记录'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingRecord(null);
          setSelectedType(null);
        }}
        onOk={() => form.submit()}
        okText={editingRecord ? '保存修改' : '添加'}
        cancelText="取消"
        width={560}
        className="record-modal"
        centered
        maskClosable={true}
        keyboard={true}
        closable={true}
        styles={{
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)'
          }
        }}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          requiredMark={false}
        >
          {/* 类型选择卡片 */}
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select hidden>
              <Select.Option value="GIVE">送礼</Select.Option>
              <Select.Option value="RECEIVE">收礼</Select.Option>
            </Select>
          </Form.Item>
          
          <div className="type-cards">
            <div 
              className={`type-card give ${selectedType === 'GIVE' ? 'selected' : ''}`}
              onClick={() => {
                setSelectedType('GIVE');
                form.setFieldValue('type', 'GIVE');
              }}
            >
              <div className="type-card-icon">🎁</div>
              <div className="type-card-label">送礼</div>
              <div className="type-card-desc">我送出的礼金</div>
            </div>
            <div 
              className={`type-card receive ${selectedType === 'RECEIVE' ? 'selected' : ''}`}
              onClick={() => {
                setSelectedType('RECEIVE');
                form.setFieldValue('type', 'RECEIVE');
              }}
            >
              <div className="type-card-icon">💝</div>
              <div className="type-card-label">收礼</div>
              <div className="type-card-desc">我收到的礼金</div>
            </div>
          </div>

          <Form.Item 
            name="personName" 
            label={<><TeamOutlined /> 对方姓名</>} 
            rules={[{ required: true, message: '请输入对方姓名' }]}
          >
            <Input 
              placeholder="例如：张三" 
              size="large"
              className="form-input"
            />
          </Form.Item>

          <Form.Item 
            name="eventType" 
            label={<><CalendarOutlined /> 事件类型</>} 
            rules={[{ required: true, message: '请选择事件类型' }]}
          >
            <Select 
              placeholder="请选择事件类型" 
              size="large"
              className="form-input"
            >
              {eventTypes.map(type => (
                <Select.Option key={type.value} value={type.value}>
                  {type.icon} {type.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="form-row">
            <Form.Item 
              name="amount" 
              label={<><DollarOutlined /> 金额</>} 
              rules={[{ required: true, message: '请输入金额' }]}
              style={{ flex: 1 }}
            >
              <InputNumber 
                style={{ width: '100%' }}
                prefix={<span style={{ fontSize: 18, fontWeight: 600 }}>¥</span>}
                min={0}
                step={100}
                size="large"
                placeholder="0.00"
                className="form-input"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item 
              name="date" 
              label={<><CalendarOutlined /> 日期</>} 
              rules={[{ required: true, message: '请选择日期' }]}
              style={{ flex: 1 }}
            >
              <DatePicker 
                style={{ width: '100%' }}
                size="large"
                className="form-input"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </div>

          <Form.Item name="remark" label={<><FileTextOutlined /> 备注</>}>
            <TextArea 
              rows={3} 
              placeholder="添加备注信息（可选）"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MainPage;