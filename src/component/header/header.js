import React from 'react'
import { message } from 'antd'
import { UserOutlined, AndroidOutlined, LogoutOutlined } from '@ant-design/icons'
import { getStorage, removeStorage } from 'common/js/localstorage'

import styles from './header.styl'

class Header extends React.Component {
  
  logout = () => {
    removeStorage('user')
    this.props.history.push('/login')
    message.info('已退出登录')
  }

  render() {
    const user = getStorage('user')
    if(user === ''){
      this.props.history.push({
        pathname: '/login'
      })
      message.info('请先登录')
      return null
    }

    const roleName = () => {
      if(user.identity === 1){
        return '超级管理员'
      }else if(user.identity === 2){
        return '管理员'
      }else if(user.identity === 3){
        return '运营'
      }else if(user.identity === 4){
        return '版主'
      }else{
        return '普通用户'
      }
    }

    const nickName = () => {
      return user.uname
    }

    return (
      <div className={styles.header}>
        <div className={styles.user}>
          <div className={styles.role}>
            <AndroidOutlined />
            <span>{roleName()}</span>
          </div>
          <div className={styles.name}>
            <UserOutlined />
            <span>{nickName()}</span>
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