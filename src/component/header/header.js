import React from 'react';
// import './header.css';
import styles from './header.styl';

class Header extends React.Component {
    render() {
        return (
            <div className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.headerLeft}>
                        <img className={styles.logo} src={require("../../common/img/logo.png")} alt="" />
                        <div>
                            <a>
                                <img className={styles.searchIcon} src={require("../../common/img/search.png")} alt="" />
                            </a>
                            <input className={styles.searchInput} type="text" v-model="keywords" placeholder="搜索" />
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <ul>
                            <li>
                                <router-link to="/follow">关注</router-link>
                            </li>
                            <li>
                                <router-link to="/new-post">发帖</router-link>
                            </li>
                            <li>
                                <router-link to="/notice">通知</router-link>
                            </li>
                            <li>
                                <img className={styles.avatar} src="avatar" alt="" />
                                <span>lixianjie</span>

                            </li>
                        </ul>
                        <ul>
                            <li>
                                <a>注册</a>
                            </li>
                            <li>
                                <a>登录</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>


        )
    }
}

export default Header;