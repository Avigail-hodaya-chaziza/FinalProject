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
  console.log('📤 שולח DTO:', dto);
  
  const res = await fetch(`${API_URL}/AddBlockedDate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('❌ שגיאת שרת:', text);
    throw new Error(`שגיאה מהשרת: ${text}`);
  }
  return await res.text();
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

export async function blockDate(date) {
  try {
    // המרת התאריך לפורמט נכון
    let dateStr;
    if (typeof date === 'string' && date.includes('-')) {
      dateStr = date;
    } else {
      const dateObj = new Date(date);
      dateStr = dateObj.toISOString().split('T')[0];
    }
    
    const dto = {
      Date: dateStr,
      HolidayName: "תור קבוע",
      CountryCode: "IL",
      Year: new Date(dateStr).getFullYear(),
      IsHoliday: false
    };
    
    console.log('📤 שולח DTO:', dto);
    
    const res = await fetch(`${API_URL}/AddBlockedDate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      if (errorText.includes('התאריך כבר חסום')) {
        console.log('ℹ️ תאריך כבר חסום:', date);
        return 'תאריך כבר חסום';
      }
      console.error('❌ שגיאת שרת:', errorText);
      throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
    }
    
    const result = await res.text();
    console.log('✅ תאריך נחסם:', date);
    return result;
  } catch (error) {
    console.error('❌ שגיאה בחסימת תאריך:', error);
    throw error;
  }
}
