import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllCustomers, updateCustomer } from  '../../Services/customerApi'
import React from 'react';

function EditCustomer() {
  const { customerId } = useParams()
  const [form, setForm] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getAllCustomers().then((list) => {
 const existing = list.find((c: any) => c.customerId === customerId);
      setForm(existing)
    })
  }, [customerId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    await updateCustomer(form)
    alert('לקוח עודכן')
    navigate('/customers')
  }

  if (!form) return <div>טוען...</div>

  return (
    <div>
      <h2>עריכת לקוח</h2>
      <input name="firstName" value={form.firstName} onChange={handleChange} />
      <input name="lastName" value={form.lastName} onChange={handleChange} />
      <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <button onClick={handleSubmit}>שמור שינויים</button>
    </div>
  )
}
export default EditCustomer
