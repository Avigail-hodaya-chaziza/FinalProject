axios.get('http://localhost:5202/api/SomeProtectedEndpoint', { withCredentials: true });
export async function login(username, password) {
  const res = await fetch("http://localhost:5202/Account/Login", {
    method: "POST",
    credentials: "include", // חובה כדי לשמור קוקי
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const text = await res.text();
  console.log("תשובת התחברות:", res.status, text);

  if (!res.ok) {
    throw new Error("התחברות נכשלה");
  }

  return text;
}
