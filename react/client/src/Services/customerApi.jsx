const API_URL = process.env.REACT_APP_API_URL + "/api/Customer";


// export async function getAllCustomers() {
//   const res = await fetch(`${API_URL}/GetAllCustomers`);
//   return await res.json();
// }
export async function getAllCustomers() {
  const token = localStorage.getItem('token'); 

  if (!token) {
    throw new Error("לא נמצא אסימון אימות. אנא התחבר מחדש.");
  }

  const res = await fetch(`${API_URL}/GetAllCustomers`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `השרת החזיר סטטוס: ${res.status}`);
  }

  return await res.json();
}

export async function addCustomer(customer) {
  const res = await fetch(`${API_URL}/AddCustomer`, {
    method: "POST",
      credentials: "include",
headers: { "Content-Type": "application/json" },

    body: JSON.stringify(customer),
  });

  const text = await res.text();
  console.log("תגובה מהשרת:", res.status, text);

  if (!res.ok) {
    throw new Error(`שגיאה מהשרת: ${text}`);
  }

  return text;
}

export async function updateCustomer(customer) {
  const res = await fetch(`${API_URL}/UpdateCustomer`, {
    method: "PUT",
      credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  return await res.text();
}

export async function contactCustomer(Id) {
  const res = await fetch(`${API_URL}/contact/${Id}`, {
    method: "PUT",
      credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Id),
  });
  return await res.text();
}

export async function getUncontactedCustomers() {
  const res = await fetch(`${API_URL}/GetUncontactedCustomers`);
  return await res.json();
}

export async function FindByIdAndEmail(Id, email) {
  const url = `${API_URL}/FindByIdAndemail?customerId=${Id}&email=${encodeURIComponent(email)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ⬅️ הוסיפי את זה
    });

    const text = await res.text();
    console.log("תשובת השרת:", text);

    if (!res.ok) {
      return { error: text };
    }

    return { data: JSON.parse(text) };
  } catch (err) {
    console.error("שגיאה בתקשורת עם השרת:", err);
    return { error: "שגיאה בתקשורת עם השרת" };
  }
}



