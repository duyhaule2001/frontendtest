import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import App from './App.jsx';
import './index.css';
import 'nprogress/nprogress.css';
import { ConfigProvider } from 'antd';
import jaJP from 'antd/es/locale/ja_JP';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

// Set global locale for dayjs
dayjs.locale('ja');

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <Provider store={store}>
        <ConfigProvider locale={jaJP}>
            <App />
        </ConfigProvider>
    </Provider>,
    // </React.StrictMode>,
);
