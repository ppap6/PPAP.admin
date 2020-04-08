import React from 'react';
// import './login.styl';
import styles from './login.styl'; // 使用 CSS Modules 的方式引入


class Login extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.mainContainer}>
                    <img className={styles.closeBtn} src={require("../../common/img/close.png")} />
                    <div className={styles.header}>PPAP</div>
                    <div className={styles.main}>
                        <div className={styles.account}>
                            <img src={require('../../common/img/account.png')} alt />
                            <input type="text" v-model="account" placeholder="请输入账号" />
                        </div>
                        <div className={styles.password}>
                            <img src={require("../../common/img/password.png")} alt />
                            <input type="password" v-model="password" placeholder="请输入密码" />
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