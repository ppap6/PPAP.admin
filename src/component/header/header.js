import React from 'react'
import { UserOutlined, AndroidOutlined, LogoutOutlined } from '@ant-design/icons'
import styles from './header.styl'

class Header extends React.Component {
  logout = () => {
    this.props.history.push('/login')
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