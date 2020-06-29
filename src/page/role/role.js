import React from 'react'
import { Popconfirm, message, Modal } from 'antd'
import styles from './role.styl'

const deleteText = '是否确定删除角色?'

class Role extends React.Component {
  // 009688
  // 4170ea

  /****************挂载阶段******************/
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      roleList: [
        {
          "id": 2,
          "name": "管理员",
          "create_time": "2019-06-06 10:32:00",
          "update_time": "2019-06-06 10:34:00",
          "description": "全站管理、权限：用户、帖子、话题全权限"
        },
        {
          "id": 3,
          "name": "运营",
          "create_time": "2019-06-06 10:33:00",
          "update_time": "2019-06-06 10:34:00",
          "description": "管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码管理版主与普通用户、权限：话题创建、用户标签认证、删除修改用户帖子、重置用户密码"
        },
        {
          "id": 4,
          "name": "版主",
          "create_time": "2019-06-06 10:34:00",
          "update_time": "2019-06-06 10:34:00",
          "description": "负责管理话题板块、权限：删除用户帖子、修改用户帖子、合并帖子、更改帖子话题分区"
        },
        {
          "id": 5,
          "name": "普通用户",
          "create_time": "2019-07-02 00:06:26",
          "update_time": "2019-07-02 23:35:24",
          "description": "不能删除帖子，只能编辑"
        }
      ]
    }
  }

  //点击删除
  clickDelete = () => {
    //
    message.info('点击删除角色')
  }

  //点击角色
  clickItem = () => {
    message.info('点击角色')
  }

  //点击增加角色
  handleAdd = () => {
    message.info('点击增加角色')
  }

  //鸡肋
  componentWillMount() {

  }
  render() {
    return (
      <div className={styles.container}>
        {this.state.roleList.map(item =>
          <div key={item.id} className={styles.roleItem} onClick={this.clickItem}>

            <Popconfirm placement="bottom" title={deleteText} onConfirm={this.clickDelete} okText="确定" cancelText="取消">
              <img className={styles.closeImg} src={require("../../common/img/close.png")} />
            </Popconfirm>

            <div className={styles.role}>
              {
                item.name == "管理员" ? <img className={styles.roleImg} src={require("../../common/img/admin.jpg")} /> : item.name == "运营" ? <img className={styles.roleImg} src={require("../../common/img/operator.jpg")} /> : item.name == "版主" ? <img className={styles.roleImg} src={require("../../common/img/moderator.jpg")} /> : <img className={styles.roleImg} src={require("../../common/img/avatar.gif")} />
              }

              <div className={styles.roleName}>{item.name}</div>
            </div>
            <div className={styles.roleDescription}>{item.description}</div>
          </div>

        )}
        <div className={styles.add} onClick={() => this.setState({
          modalVisible: true,
        })}>
          <img className={styles.addImg} src={require("../../common/img/add.png")} />
        </div>
        <Modal
          title="Basic Modal"
          visible={this.state.modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.setState({
            modalVisible: false,
          })}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    )
  }

  //可以获取dom
  componentDidMount() { }


  /****************更新阶段******************/
  compontentWillReceviceProps(nextProps) {

  }
  shouldCompententUpdate(nextProps, nextState) { }
  compontentWillUpdate(nextProps, nextState) {
    // return false
    //阻止更新
  }
  // reder(){}之后的state才是新的state
  compontentDidUpdate(prevProps, prevState) { }

  /****************卸载阶段******************/
  //清理工作
  compontentWillUnmount() { }
}

export default Role;