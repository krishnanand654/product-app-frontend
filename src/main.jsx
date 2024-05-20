import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { NextUIProvider } from '@nextui-org/react'
import { BrowserRouter } from 'react-router-dom'
import TokenRefreshHandler from './util/RefreshTokenHandler'
import { Provider } from 'react-redux';
import store from './redux/store.js';


import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <BrowserRouter>
        <TokenRefreshHandler />
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </NextUIProvider>
  </React.StrictMode>,
)
