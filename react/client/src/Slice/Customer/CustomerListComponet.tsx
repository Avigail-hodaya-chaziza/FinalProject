import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCustomers, contactCustomer } from '../../Services/customerApi'


function CustomersList() {
  const [customers, setCustomers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getAllCustomers().then(setCustomers)
  }, [])

  const handleContact = async (id: String) => {
    await contactCustomer(id)
    alert('סומן כלקוח שקיבלו מענה')
  }

  return (
    <div>
      <h2>לקוחות</h2>
      <button onClick={() => navigate('/customers/add')}>➕ הוסף לקוח</button>
      <ul>
        {customers.map((c: any) => (
          <li key={c.customerId}>
            {c.firstName} {c.lastName} - {c.phoneNumber}
            <button onClick={() => navigate(`/customers/edit/${c.customerId}`)}>ערוך</button>
            <button onClick={() => handleContact(c.customerId)}>✔ יצרו קשר</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default CustomersList
