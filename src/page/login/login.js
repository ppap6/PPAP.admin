import React from 'react'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
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
              <div >登录</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;