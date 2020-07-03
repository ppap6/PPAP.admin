import React from 'react'
import { message } from 'antd'
import { UserOutlined, AndroidOutlined, LogoutOutlined } from '@ant-design/icons'
import { removeStorage } from 'common/js/localstorage'

import styles from './header.styl'

class Header extends React.Component {
  
  logout = () => {
    removeStorage('user')
    this.props.history.push('/login')
    message.info('已退出登录')
  }

  render() {
    return (
      <div className={styles.header}>
        <div className={styles.user}>
          <div className={styles.role}>
            <AndroidOutlined />
            <span>超级管理员</span>
          </div>
          <div className={styles.name}>
            <UserOutlined />
            <span>飘香豆腐</span>
          </div>
          <div className={styles.logout} onClick={this.logout}>
            <LogoutOutlined />
            <span>退出</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Header