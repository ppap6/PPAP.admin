import React from 'react'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import sha1 from 'crypto-js/sha1'
import md5 from 'crypto-js/md5'
import { login } from 'api/user'

import styles from './login.styl'

class Login extends React.Component {

  state = {
    email: '',
    password: ''
  }

  handleEmailChange = e => {
    this.setState({
      email: e.target.value
    })
  }

  handlePasswordChange = e => {
    this.setState({
      password: e.target.value
    })
  }

  login = () => {
    const data = {
      email: this.state.email.trim(),
      password: md5(sha1(this.state.password).toString()).toString()
    }
    login(data).then(response => {
      console.log(response.data)
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.header}>PPAP</div>
          <div className={styles.main}>
            <div className={styles.email}>
              <UserOutlined />
              <input type="text" value={this.state.email} onChange={this.handleEmailChange} placeholder="请输入邮箱" />
            </div>
            <div className={styles.password}>
              <LockOutlined />
              <input type="password" value={this.state.password}  onChange={this.handlePasswordChange} placeholder="请输入密码" />
            </div>
            <div className={styles.login}>
              <div onClick={this.login}>登录</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;