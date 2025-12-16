import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import '../css/StarRating.css';

const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [allReviews, setAllReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchReviews(), fetchAverageRating()]);
      } catch (error) {
        console.error('שגיאה בטעינת נתונים:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  const fetchReviews = async () => {
    try {
      const response = await api.get('/Review/GetAllReviews');
      setAllReviews(response.data || []);
    } catch (error) {
      console.error('שגיאה בטעינת ביקורות:', error);
      setAllReviews([]);
    }
  };
  
  const fetchAverageRating = async () => {
    try {
      const response = await api.get('/Review/GetAverageRating');
      setAverageRating(response.data?.averageRating || 0);
      setTotalReviews(response.data?.totalReviews || 0);
    } catch (error) {
      console.error('שגיאה בטעינת ממוצע דירוג:', error);
      setAverageRating(0);
      setTotalReviews(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('אנא הכנס את שמך');
      return;
    }
    if (rating === 0) {
      alert('אנא בחר דירוג');
      return;
    }
    
    try {
      const reviewData = {
        CustomerName: customerName,
        Rating: rating,
        Comment: comment.trim() || null
      };
      
      await api.post('/Review/AddReview', reviewData);
      alert('הביקורת נוספה בהצלחה!');
      
      setRating(0);
      setComment('');
      setCustomerName('');
      setShowForm(false);
      
      fetchReviews();
      fetchAverageRating();
    } catch (error) {
      console.error('שגיאה בהוספת ביקורת:', error);
      alert('שגיאה בהוספת ביקורת');
    }
  };

  if (loading) {
    return (
      <div className="rating-container">
        <p>טוען נתונים...</p>
      </div>
    );
  }

  return (
    <div className="rating-container">
      <h2>דירוגי לקוחות ({allReviews.length} ביקורות)</h2>
      
      {/* ממוצע דירוג */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div className="stars" style={{ fontSize: '2rem' }}>
          {[...Array(5)].map((_, index) => {
            const fillPercentage = Math.max(0, Math.min(100, (averageRating - index) * 100));
            
            return (
              <span key={index} style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ color: '#ddd' }}>&#9733;</span>
                <span 
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    color: '#FFD700',
                    overflow: 'hidden',
                    width: `${fillPercentage}%`
                  }}
                >
                  &#9733;
                </span>
              </span>
            );
          })}
        </div>
        <p>ממוצע: {averageRating.toFixed(1)} מתוך 5 ({totalReviews} ביקורות)</p>

      </div>

      {/* ביקורות */}
      <div style={{ marginBottom: '20px' }}>
        {allReviews.slice(0, visibleCount).map((review, index) => (
          <div key={index} style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '10px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <strong>{review?.CustomerName || review?.customerName || 'לקוח אנונימי'}</strong>
              <div className="stars">
                {[...Array(5)].map((_, i) => {
                  const rating = review?.Rating || review?.rating || 0;
                  return (
                    <span key={i} style={{ color: i < rating ? '#ffc107' : '#ccc' }}>
                      &#9733;
                    </span>
                  );
                })}
              </div>
            </div>
            {(review?.Comment || review?.comment) && (
              <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>
                "{review?.Comment || review?.comment}"
              </p>
            )}
          </div>
        ))}
        
        {/* כפתור הצג עוד */}
        {allReviews.length > visibleCount && (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button
              onClick={() => setVisibleCount(prev => prev + 8)}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              הצג עוד
            </button>
          </div>
        )}
      </div>

      {/* כפתור הוספת ביקורת */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="submit-button"
        >
          הוסף ביקורת ⭐
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="השם שלך"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}
          />
          
          <div className="stars">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={index <= (hover || rating) ? 'on' : 'off'}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
          
          <textarea
            placeholder="הוסף הערה (אופציונלי)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="submit-button">
              שלח ביקורת
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ביטול
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StarRating;