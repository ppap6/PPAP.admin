
import React from 'react';
// import ReactDOM from 'react-dom';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const { SubMenu } = Menu;

class Sider extends React.Component {
    handleClick = e => {
        console.log('click ', e);

        window.location.href = '#' + e.key;
        //没有props.history，无法使用函数跳转
        // this.props.history.push(e.key);
    };

    render() {
        return (
            <Menu
                onClick={this.handleClick}
                style={{ width: 256 }}
                defaultSelectedKeys={['/home']}
                defaultOpenKeys={[]}
                mode="inline"
            >
                {/* <SubMenu
                    key="sub1"
                    title={
                        <span>
                            <MailOutlined />
                            <span>Navigation One</span>
                        </span>
                    }
                >
                    <Menu.ItemGroup key="g1" title="Item 1">
                        <Menu.Item key="1">Option 1</Menu.Item>
                        <Menu.Item key="2">Option 2</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup key="g2" title="Item 2">
                        <Menu.Item key="3">Option 3</Menu.Item>
                        <Menu.Item key="4">Option 4</Menu.Item>
                    </Menu.ItemGroup>
                </SubMenu> */}
                <Menu.Item key="/home">首页</Menu.Item>
                <Menu.Item key="/role">角色管理</Menu.Item>
                <SubMenu
                    key="/user"
                    title={
                        <span>
                            <AppstoreOutlined />
                            <span>用户管理</span>
                        </span>
                    }
                >
                    <Menu.Item key="/user/list">所有用户</Menu.Item>
                    <Menu.Item key="/user/blacklist">用户小黑屋</Menu.Item>
                </SubMenu>
                <SubMenu
                    key="/topic"
                    title={
                        <span>
                            <SettingOutlined />
                            <span>话题管理</span>
                        </span>
                    }
                >
                    <Menu.Item key="/topic/list">所有话题</Menu.Item>
                    <Menu.Item key="/topic/blacklist">话题小黑屋</Menu.Item>
                </SubMenu>
                <SubMenu
                    key="/post"
                    title={
                        <span>
                            <SettingOutlined />
                            <span>帖子管理</span>
                        </span>
                    }
                >
                    <Menu.Item key="/post/list">所有帖子</Menu.Item>
                    <Menu.Item key="/post/blacklist">帖子小黑屋</Menu.Item>
                    <Menu.Item key="/post/comment/blacklist">评论小黑屋</Menu.Item>
                </SubMenu>
                <SubMenu
                    key="/advertisement"
                    title={
                        <span>
                            <SettingOutlined />
                            <span>广告管理</span>
                        </span>
                    }
                >
                    <Menu.Item key="/advertisement/none">暂无</Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}

// ReactDOM.render(<Sider />, document.querySelector('#root'));

export default Sider;