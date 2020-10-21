
import React from 'react'
import { ReadOutlined, UserOutlined, TagsOutlined, BookOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Menu, message } from 'antd'
import { getUserAuthList } from 'api/user'
import Logo from 'common/img/logo.png'

import styles from './sider.styl'

const { SubMenu } = Menu

const menuIcons = [
  UserOutlined,
  TagsOutlined,
  BookOutlined,
  ShoppingOutlined,
  ReadOutlined
]

class Sider extends React.Component {

  state = {
    menuList: []
  }

  componentDidMount(){
    this.getUserAuthList()
  }

  getUserAuthList = () => {
    getUserAuthList().then(response => {
      if(response.data.status === 200){
        if(response.data.message.list){
          this.setState({
            menuList: response.data.message.list
          })
        }else{
          this.setState({
            menuList: response.data.message
          })
        }
      }else{
        message.warning(response.data.message)
        message.error('获取用户权限失败')
      }
    }).catch(error => {
      console.log(error)
      message.error('网络或服务器貌似有问题')
      message.error('获取用户权限失败')
    })
  }

  handleClickMenu = e => {
    this.props.history.push(e.key)
  }

  handleClickLogo = () => {
    this.props.history.push('/')
  }

  renderSubMenu = (menuList) => {
    return menuList.map((menu, index) => {
      return (
        <SubMenu
          className={styles.subMenu}
          key={menu.code}
          title={
            <span>
              {React.createElement(menuIcons[index] ? menuIcons[index] : menuIcons[5])}
              <span>{menu.name}</span>
            </span>
          }
        >
          {
            menu.child.map(item => (
              <Menu.Item key={item.code}>{item.name}</Menu.Item>
            ))
          }
        </SubMenu>
      )
    })
  }

  render() {
    const menuList = this.state.menuList
    return (

      <Menu
        className={styles.sider}
        onClick={this.handleClickMenu}
        style={{ width: 256 }}
        defaultSelectedKeys={['/']}
        defaultOpenKeys={[]}
        mode="inline"
      >
        <img src={Logo} className={styles.logo} onClick={this.handleClickLogo} alt="logo"></img>
        {this.renderSubMenu(menuList)}
      </Menu>

    )
  }
}

export default Sider