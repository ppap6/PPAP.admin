import React from 'react';
import Sider from './component/sider/sider';
import Header from './component/header/header';
import { HashRouter, Route, Switch, } from 'react-router-dom';

import Home from './page/home/home';
import Login from './page/login/login';
import Role from './page/role/role';

import PostList from './page/post/list/list';
import PostBlacklist from './page/post/blacklist/blacklist';
import PostCommentBlacklist from './page/post/comment-blacklist/blacklist';

import TopicList from './page/topic/list/list';
import TopicBlacklist from './page/topic/blacklist/blacklist';

import UserList from './page/user/list/list';
import UserBlacklist from './page/user/blacklist/blacklist';

// import { Layout } from 'antd';

import './common/css/reset.css';
import './App.css';


const Inbox = ({ }) => (
  <React.Fragment>
    <Header className="header"></Header>
    <div className="main">
      <Sider className="sider"></Sider>
      <div className="content">
        <Route exact path="/" component={Home} />
        <Route exact path="/role" component={Role} />

        <Route exact path="/post/list" component={PostList} />
        <Route exact path="/post/blacklist" component={PostBlacklist} />
        <Route exact path="/post/comment-blacklist" component={PostCommentBlacklist} />

        <Route exact path="/topic/list" component={TopicList} />
        <Route exact path="/topic/blacklist" component={TopicBlacklist} />

        <Route exact path="/user/list" component={UserList} />
        <Route exact path="/user/blacklist" component={UserBlacklist} />

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
);
export default App;




