import React, { useState, useEffect } from 'react';
import api from '../Services/api';

const RealRating = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: '',
    rating: 5,
    comment: '',
    email: ''
  });

  useEffect(() => {
    fetchReviews();
    fetchAverageRating();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/Review/GetAllReviews');
      setReviews(response.data.slice(0, 3)); // הצג רק 3 ביקורות אחרונות
    } catch (error) {
      console.error('שגיאה בטעינת ביקורות:', error);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await api.get('/Review/GetAverageRating');
      setAverageRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error('שגיאה בטעינת ממוצע דירוג:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/Review/AddReview', newReview);
      alert('הביקורת נוספה בהצלחה!');
      setNewReview({ customerName: '', rating: 5, comment: '', email: '' });
      setShowAddReview(false);
      fetchReviews();
      fetchAverageRating();
    } catch (error) {
      console.error('שגיאה בהוספת ביקורת:', error);
      alert('שגיאה בהוספת ביקורת');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        style={{
          color: index < rating ? '#FFD700' : '#ddd',
          fontSize: '1.5rem',
          cursor: interactive ? 'pointer' : 'default'
        }}
        onClick={interactive ? () => onStarClick(index + 1) : undefined}
      >
        ★
      </span>
    ));
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      margin: '20px 0',
      direction: 'rtl'
    }}>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>דירוגי לקוחות</h3>
      
      {/* ממוצע דירוג */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>
          {averageRating.toFixed(1)}
        </div>
        <div style={{ marginBottom: '10px' }}>
          {renderStars(Math.round(averageRating))}
        </div>
        <div style={{ color: '#666' }}>
          מבוסס על {totalReviews} ביקורות
        </div>
      </div>

      {/* ביקורות אחרונות */}
      <div style={{ marginBottom: '20px' }}>
        {reviews.map((review, index) => (
          <div key={index} style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '10px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <strong>{review.customerName}</strong>
              <div>{renderStars(review.rating)}</div>
            </div>
            {review.comment && (
              <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>
                "{review.comment}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* כפתור הוספת ביקורת */}
      {!showAddReview ? (
        <button
          onClick={() => setShowAddReview(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          הוסף ביקורת ⭐
        </button>
      ) : (
        /* טופס הוספת ביקורת */
        <form onSubmit={handleSubmitReview} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="השם שלך"
              value={newReview.customerName}
              onChange={(e) => setNewReview({...newReview, customerName: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="אימייל (אופציונלי)"
              value={newReview.email}
              onChange={(e) => setNewReview({...newReview, email: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              דירוג:
            </label>
            {renderStars(newReview.rating, true, (rating) => 
              setNewReview({...newReview, rating})
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <textarea
              placeholder="תגובה (אופציונלי)"
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              שלח ביקורת
            </button>
            <button
              type="button"
              onClick={() => setShowAddReview(false)}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '1rem'
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

export default RealRating;