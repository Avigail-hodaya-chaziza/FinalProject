import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Bay = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // קבלת שם הלקוח מהנתונים שעוברים או localStorage
    const { firstName, lastName } = location.state || {};
    const customerName = (firstName && lastName) 
        ? `${firstName} ${lastName}` 
        : localStorage.getItem('customerName') || 'לקוח יקר';
    
    return (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            direction: 'rtl'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                maxWidth: '500px',
                width: '100%'
            }}>
                <h1 style={{
                    color: '#2c3e50',
                    marginBottom: '30px',
                    fontSize: '2.5em'
                }}>
                    שלום {customerName}! 😊
                </h1>
                
                <p style={{
                    fontSize: '1.3em',
                    color: '#34495e',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                }}>
                    שמחתי לתת שרות ולטפל בך
                </p>
                
                <p style={{
                    fontSize: '1.2em',
                    color: '#7f8c8d',
                    marginBottom: '30px'
                }}>
                    נעמוד איתך בקשר לתיאום הטיפול
                </p>
                
                <div style={{ marginTop: '40px' }}>
                    <button 
                        onClick={() => {
                            // ניקוי כל הנתונים
                            localStorage.clear();
                            navigate('/');
                        }}
                        style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            padding: '15px 30px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1em',
                            cursor: 'pointer',
                            marginRight: '15px'
                        }}
                    >
                        חזרה לדף הראשי
                    </button>
                    
                    <button 
                        onClick={() => {
                            // החזר את הנתונים ל-localStorage לפני המעבר
                            const savedTreatment = localStorage.getItem('selectedTreatment');
                            const savedDate = localStorage.getItem('selectedDate');
                            const savedEmail = localStorage.getItem('customerEmail');
                            const savedId = localStorage.getItem('customerId');
                            const savedPhone = localStorage.getItem('customerPhone');
                            
                            if (!savedTreatment || !savedDate) {
                                alert('הנתונים נמחקו. אנא התחל מחדש.');
                                navigate('/');
                                return;
                            }
                            
                            // העבר את כל הנתונים לדף הסיכום
                            navigate('/summary', {
                                state: {
                                    email: savedEmail,
                                    id: savedId,
                                    firstName,
                                    lastName,
                                    phoneNumber: savedPhone,
                                    treatment: savedTreatment
                                }
                            });
                        }}
                        style={{
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            padding: '15px 30px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1em',
                            cursor: 'pointer'
                        }}
                    >
                        צפייה בסיכום
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Bay;