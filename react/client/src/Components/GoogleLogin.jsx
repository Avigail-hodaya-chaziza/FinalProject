import React, { useEffect } from 'react';

const GoogleLogin = ({ onSuccess, onError }) => {
  // החליפי ב-Client ID שלך שיש לו הרשאה ל-localhost:3000
  const CLIENT_ID = '787460878575-dsii6n0tchb1i9ptm3o32pjvlddusv28.apps.googleusercontent.com';
  
  console.log('🔍 Google Login Component loaded');
  
  useEffect(() => {
    // בדוק אם הסקריפט כבר נטען
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      if (window.google && window.google.accounts) {
        initializeGoogleSignIn();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✅ Google script loaded');
      setTimeout(() => {
        try {
          initializeGoogleSignIn();
        } catch (error) {
          console.error('❌ שגיאה:', error);
        }
      }, 500);
    };
    document.head.appendChild(script);

    return () => {
      // לא להסיר את הסקריפט כי זה יכול לגרום לבעיות
    };
  }, []);

  const initializeGoogleSignIn = () => {
    console.log('🔍 Google available:', !!window.google);
    if (window.google && window.google.accounts) {
      console.log('✅ Initializing Google Sign-In');
      try {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false
        });
      } catch (error) {
        console.error('❌ שגיאה באיניציאליזציה של Google:', error);
        if (error.message && error.message.includes('origin')) {
          console.error('❌ הדומיין localhost:3000 לא מורשה עבור Client ID זה');
        }
        return;
      }

      const buttonElement = document.getElementById('google-signin-button');
      if (buttonElement) {
        try {
          window.google.accounts.id.renderButton(
            buttonElement,
            {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: '100%'
            }
          );
        } catch (error) {
          console.error('❌ שגיאה ביצירת כפתור Google:', error);
          // אם נכשל, נציג הודעה
          buttonElement.innerHTML = `
            <div style="
              padding: 15px;
              text-align: center;
              background: #f8f9fa;
              border: 1px solid #dadce0;
              border-radius: 8px;
              color: #666;
            ">
              התחברות Google לא זמינה כרגע<br>
              <small>אנא השתמש בהתחברות רגילה</small>
            </div>
          `;
        }
      }
    } else {
      console.error('❌ Google not available');
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
    <div style={{ 
      width: '100%', 
      margin: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div 
        id="google-signin-button" 
        style={{ 
          width: '100%',
          maxWidth: '400px',
          minHeight: '50px'
        }}
      ></div>
    </div>
  );
};

export default GoogleLogin;