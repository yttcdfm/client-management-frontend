import React from 'react';
import './index.css';

export default class Header extends React.Component {
    render() {
        return (<header className="my-header">
            <h1 className='my-h1'>顧客情報管理システム</h1>
            <ul className='my-ul'>
                <li className='my-li'>
                    <a href='http://localhost:3000/'>顧客管理</a>
                </li>
            </ul>
        </header>);
    }
}