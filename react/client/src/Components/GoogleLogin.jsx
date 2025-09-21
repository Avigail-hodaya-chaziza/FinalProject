import React, { useEffect } from 'react';

const GoogleLogin = ({ onSuccess, onError }) => {
  const CLIENT_ID = '13990398172-ss8pscnksrjln81sjnrrt76u2pa3lg7e.apps.googleusercontent.com';
  
  useEffect(() => {
    // טעינת Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: 250
        }
      );
    }
  };

  const handleCredentialResponse = (response) => {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userInfo = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture
      };

      onSuccess(userInfo);
    } catch (error) {
      console.error('שגיאה בפענוח Google token:', error);
      onError(error);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <div id="google-signin-button"></div>
      <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
        אם הכפתור לא מופיע, בדוק את הגדרות Google Console
      </p>
    </div>
  );
};

export default GoogleLogin;