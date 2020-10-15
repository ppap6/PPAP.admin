import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import Sider from './component/sider/sider'
import Header from './component/header/header'

import Home from './page/home/home'
import Login from './page/login/login'

import PostList from './page/post/list/list'
import PostBlacklist from './page/post/blacklist/blacklist'

import TopicList from './page/topic/list/list'

import UserList from './page/user/list/list'
import UserBlacklist from './page/user/blacklist/blacklist'

import RoleList from './page/role_access/role/role'
import AccessList from './page/role_access/access/access'

import './App.css'


const Inbox = props => (
  
  <React.Fragment>

    <div className="layout">

      <Sider className="sider" history={props.history}></Sider>

      <div className="right">

        <Header history={props.history} />

        <div className="content">

          <Route exact path="/" component={Home} />

          <Route exact path="/post/list" component={PostList} />
          <Route exact path="/post/blacklist" component={PostBlacklist} />

          <Route exact path="/topic/list" component={TopicList} />

          <Route exact path="/user/list" component={UserList} />
          <Route exact path="/user/blacklist" component={UserBlacklist} />
          
          <Route exact path="/role_access/role" component={RoleList} />
          <Route exact path="/role_access/access" component={AccessList} />

        </div>

      </div>

    </div>

  </React.Fragment>
  
)


const App = () => (
  <div className="App">
    <HashRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route component={Inbox} />
      </Switch>
    </HashRouter>
  </div>
)

export default App




