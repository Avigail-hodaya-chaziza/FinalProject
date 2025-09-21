const API_URL = process.env.REACT_APP_API_URL + "/api/BlockedSlot";

export async function getBlockedDates() {
  try {
    const res = await fetch(`${API_URL}/GetBlockedDates`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    throw error;
  }
}

export async function isDateAvailable(date) {
  const res = await fetch(`${API_URL}/IsDateAvailable?date=${date}`);
  return await res.json();
}

export async function addBlockedDate(dto) {
  const res = await fetch(`${API_URL}/AddBlockedDate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`שגיאה מהשרת: ${text}`);
  return text;
}

export async function testApiConnection() {
  try {
    const res = await fetch(`${API_URL}/TestApiConnection`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error testing API connection:', error);
    throw error;
  }
}
