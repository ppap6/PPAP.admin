import React from 'react'
import { Link } from 'react-router-dom'
import styles from './home.styl'

class Home extends React.Component {
  render() {
    return (
      <div className={styles.home}>
        <p>
          <a href='#/user/list'>a 标签跳转</a>
        </p>

        <p>
          <Link to='/user/list'>link 组件跳转</Link>
        </p>

        <p>
          <Link to={`/user/list?name=陈&id=63`}>link 组件跳转传参</Link>
        </p>

        <p>
          <button onClick={() => {
            console.log(this)
            console.log(this.props)
            console.log(this.props.history)
            this.props.history.push('/user/list')
          }}>通过函数跳转</button>
        </p>

        <p>
          <button onClick={() => this.props.history.push({
            pathname: '/user/list',
            state: {
              id: 3
            }
          })}>通过函数跳转,隐式传参</button>
        </p>

      </div>
    )
  }
}

export default Home;