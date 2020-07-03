import React from 'react'
import { message, Spin } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import sha1 from 'crypto-js/sha1'
import md5 from 'crypto-js/md5'
import { login } from 'api/user'
import { checkEmail } from 'common/js/validate'
import { setStorage } from 'common/js/localstorage'

import styles from './login.styl'

class Login extends React.Component {

  state = {
    email: '',
    password: '',
    loginText: '登录',
    loginLoading: false
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

  keyUp = e => {
    if(e.keyCode == 13) {
      this.login()
    }
  }

  login = () => {

    if(this.state.loginLoading) return

    const emailCheck = checkEmail(this.state.email)
    if(emailCheck == 1){
      message.warning('邮箱不能为空')
      return
    }
    if(emailCheck == 2){
      message.warning('邮箱格式不正确')
      return
    }

    this.setState({
      loginText: '',
      loginLoading: true
    })

    const data = {
      email: this.state.email.trim(),
      password: md5(sha1(this.state.password).toString()).toString()
    }
    login(data).then(response => {
      if(response.data.status == 200){
        message.success('登录成功')
        setStorage('user', response.data.user)
        this.props.history.push({
          pathname: '/'
        })
      }else if(response.data.status == 10000){
        message.error('密码错误')
        this.setState({
          loginText: '登录',
          loginLoading: false
        })
      }else if(response.data.status == 10003){
        message.error('邮箱不存在')
        this.setState({
          loginText: '登录',
          loginLoading: false
        })
      }
    }).catch(error => {
      console.log(error)
      message.error('网络或服务器貌似有问题')
      this.setState({
        loginText: '登录',
        loginLoading: false
      })
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
              <input type="text" value={this.state.email} onChange={this.handleEmailChange} onKeyUp={this.keyUp} placeholder="请输入邮箱" />
            </div>
            <div className={styles.password}>
              <LockOutlined />
              <input type="password" value={this.state.password}  onChange={this.handlePasswordChange} onKeyUp={this.keyUp} placeholder="请输入密码" />
            </div>
            <div className={styles.login}>
              <div className={styles.btn} onClick={this.login}>{this.state.loginText}{this.state.loginLoading ? <Spin /> : ''}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;