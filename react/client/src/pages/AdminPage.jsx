import React from 'react';
import AddTreatmentForm from '../Components/AddTreatmentForm';
import { useSelector } from 'react-redux';
import TreatmentsList from '../Components/TreatmentsList'; 


const AdminPage = () => {
  const user = useSelector(state => state.auth.user);

  if (!user || user.role !== 'Admin') {
    return <div>אין לך גישה לעמוד הזה</div>;
  }

  return (
    <div>
      <h1>ניהול טיפולים</h1>
      <AddTreatmentForm />
    </div>
  );
};

export default AdminPage;
