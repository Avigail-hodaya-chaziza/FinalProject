import { useEffect, useState } from 'react'
import { getUncontactedCustomers, contactCustomer } from '../../Services/customerApi'


function UncontactedCustomers() {
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    getUncontactedCustomers().then(setCustomers)
  }, [])

  const handleContact = async (id: String) => {
    await contactCustomer(id)
    alert(`לקוח ${id} סומן כטופל`)
    setCustomers(customers.filter((c: any) => c.customerId !== id))
  }

  return (
    <div>
      <h2>לקוחות שטרם יצרו איתם קשר</h2>
      {customers.length === 0 ? (
        <p>אין לקוחות כרגע</p>
      ) : (
        <ul>
          {customers.map((c: any) => (
            <li key={c.customerId}>
              {c.firstName} {c.lastName} - {c.phoneNumber}
              <button onClick={() => handleContact(c.customerId)}>✔ סימון כטופל</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default UncontactedCustomers
