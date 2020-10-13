
import React from 'react'
import { ReadOutlined, UserOutlined, TagsOutlined, BookOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import Logo from 'common/img/logo.png'

import styles from './sider.styl'

const { SubMenu } = Menu

class Sider extends React.Component {

  handleClick = e => {
    this.props.history.push(e.key)
  }

  render() {
    return (
      <Menu
        className={styles.sider}
        onClick={this.handleClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['/']}
        defaultOpenKeys={[]}
        mode="inline"
      >
        <img src={Logo} className={styles.logo} alt="logo"></img>
        <Menu.Item key="/">
          <span>
            <ReadOutlined />
            <span>首页</span>
          </span>
        </Menu.Item>

        <SubMenu
          key="/user"
          title={
            <span>
              <UserOutlined />
              <span>用户管理</span>
            </span>
          }
        >
          <Menu.Item key="/user/list">所有用户</Menu.Item>
          <Menu.Item key="/user/blacklist">用户小黑屋</Menu.Item>
        </SubMenu>

        <SubMenu
          key="/topic"
          title={
            <span>
              <TagsOutlined />
              <span>话题管理</span>
            </span>
          }
        >
          <Menu.Item key="/topic/list">所有话题</Menu.Item>
        </SubMenu>

        <SubMenu
          key="/post"
          title={
            <span>
              <BookOutlined />
              <span>帖子管理</span>
            </span>
          }
        >
          <Menu.Item key="/post/list">所有帖子</Menu.Item>
          <Menu.Item key="/post/blacklist">帖子小黑屋</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

export default Sider