import React, { useState } from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { Layout, Menu, Dropdown, message } from 'antd';
import Products from './Products';
import Categories from './Categories';
import Users from './Users';
import MainInfo from './MainInfo';
import '../assets/css/main.css';
import { removeToken } from '../utils/tools';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

function Main() {
  let count = 0;
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const menu = (
    <Menu>
      <Menu.Item
        key="id"
        danger
        onClick={() => {
          count++;
          if (count <= 1) {
            message.info('请再次点击退出登录！');
          }
          if (count > 1) {
            removeToken();
            sessionStorage.removeItem('managerName');
            message.info('退出成功！请重新登录！');
            history.push('/login');
          }
        }}
      >
        退出登录
      </Menu.Item>
    </Menu>
  );
  const managerName = sessionStorage.getItem('managerName');
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <img src="./images/duola.png" alt="" style={{ width: '100%' }} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={({ key }) => {
            history.push(key);
          }}
        >
          <Menu.Item key="/main/products" icon={<UserOutlined />}>
            &nbsp;&nbsp;&nbsp;&nbsp;商品管理
          </Menu.Item>
          <Menu.Item key="/main/categories" icon={<VideoCameraOutlined />}>
            &nbsp;&nbsp;&nbsp;&nbsp;分类管理
          </Menu.Item>
          <Menu.Item key="/main/users" icon={<UploadOutlined />}>
            &nbsp;&nbsp;&nbsp;&nbsp;用户管理
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <h1
            style={{
              display: 'inline-block',
              marginLeft: '21px',
              fontWeight: 'bold',
            }}
          >
            哆啦后台管理系统
          </h1>
          <Dropdown overlay={menu}>
            <p
              style={{
                fontWeight: 'bold',
                display: 'inline-block',
                cursor: 'pointer',
                float: 'right',
                marginRight: '30px',
              }}
              className="ant-dropdown-link"
              onClick={(e) => {
                e.preventDefault();
                //   console.log('ok');
              }}
            >
              {managerName + '↓'}
            </p>
          </Dropdown>
          <Link
            to="/main/maininfo"
            style={{ float: 'right', marginRight: '30px' }}
          >
            数据看板
          </Link>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            padding: 12,
            minHeight: 280,
            width: '100%',
            overflow: 'auto',
          }}
        >
          <Route path="/main" exact>
            <MainInfo />
          </Route>
          <Route path="/main/maininfo">
            <MainInfo />
          </Route>
          <Route path="/main/products">
            <Products />
          </Route>
          <Route path="/main/categories">
            <Categories />
          </Route>
          <Route path="/main/users">
            <Users />
          </Route>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Main;
