import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './Components/ErrorBoundary'; // Assuming you have an ErrorBoundary component
import { Provider } from 'react-redux';
import store from '../src/Store/store';
import Navbar from './pages/Navbar';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
            {/* <GoogleOAuthProvider clientId="🔑 ה-CLIENT_ID שלך מגוגל"> */}

      <ErrorBoundary>
        <BrowserRouter>
          <Navbar />
          <App />
        </BrowserRouter>
      </ErrorBoundary>
      {/* </GoogleOAuthProvider> */}
    </Provider>
    
  </React.StrictMode>
);

reportWebVitals();
