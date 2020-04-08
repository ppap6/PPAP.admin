import React from 'react';
import styles from './home.styl';

import { Link } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return (
            <div>
                <a href='#/role'>role</a>
                <Link to='role'>link</Link>
                <button onClick={() => {
                    console.log(this);
                    console.log(this.props);
                    console.log(this.props.history); this.props.history.push('role');
                }}>通过函数跳转</button>
                <button onClick={() => this.props.history.push({
                    pathname: '/role',
                    state: {
                        id: 3
                    }
                })}>通过函数跳转,隐式传参</button>
            </div>
        )
    }
}

export default Home;