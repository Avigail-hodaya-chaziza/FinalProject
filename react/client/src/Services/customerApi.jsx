const API_URL = process.env.REACT_APP_API_URL + "/api/Customer";

// פונקציה לתיקון קידוד עברי
function fixHebrewEncoding(text) {
  if (!text || typeof text !== 'string') return text;
  
  // אם הטקסט כבר בעברית או באנגלית, נחזיר אותו
  if (/[\u0590-\u05FF]/.test(text) || /^[a-zA-Z\s]+$/.test(text)) return text;
  
  // אם הטקסט מכיל רק סימני שאלה, נחזיר אותו כמו שהוא
  if (text.match(/^\?+$/)) return text;
  
  return text;
}


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
  console.log("נתונים שנשלחו:", JSON.stringify(customer));

  if (!res.ok) {
    let errorMessage = text;
    try {
      const errorObj = JSON.parse(text);
      errorMessage = errorObj.details || errorObj.message || text;
    } catch (e) {
      // אם לא JSON, נשאיר את הטקסט המקורי
    }
    throw new Error(`שגיאה מהשרת: ${errorMessage}`);
  }

  return text;
}

export async function updateCustomer(customer) {
  const token = localStorage.getItem('token');
  
  // המרת השדות לפורמט שהשרת מצפה
  const customerDto = {
    customerId: customer.CustomerId || customer.customerId,
    FirstName: customer.FirstName,
    LastName: customer.LastName,
    PhoneNumber: customer.PhoneNumber,
    Email: customer.Email
  };
  
  const res = await fetch(`${API_URL}/UpdateCustomer`, {
    method: "PUT",
    credentials: "include",
    headers: { 
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(customerDto),
  });
  
  if (!res.ok) {
    throw new Error(`שגיאה בעדכון לקוח: ${res.status}`);
  }
  
  return await res.text();
}

export async function contactCustomer(Id) {
  const res = await fetch(`${API_URL}/contact/${Id}`, {
    method: "PUT",
    credentials: "include",
    headers: { 
      "Content-Type": "application/json" 
    }
  });
  
  if (!res.ok) {
    throw new Error(`שגיאה בעדכון לקוח: ${res.status}`);
  }
  
  return await res.text();
}

export async function getUncontactedCustomers() {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_URL}/GetUncontactedCustomers`, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json; charset=utf-8'
    },
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error(`שגיאה בטעינת לקוחות: ${res.status}`);
  }
  
  const text = await res.text();
  const data = JSON.parse(text);
  
  // תיקון קידוד עברי לכל לקוח
  return data.map(customer => ({
    ...customer,
    FirstName: fixHebrewEncoding(customer.FirstName),
    LastName: fixHebrewEncoding(customer.LastName)
  }));
}

export async function FindByIdAndEmail(Id, email) {
  const url = `${API_URL}/FindByIdAndemail?customerId=${Id}&email=${encodeURIComponent(email)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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

export async function FindByNameAndEmail(name, email) {
  const url = `${API_URL}/FindByNameAndEmail?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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



