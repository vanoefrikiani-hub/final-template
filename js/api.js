const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function searchMeals(query) {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error searching meals for query "${query}":`, error);
    throw error;
  }
}

export async function filterByCategory(category) {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error filtering by category "${category}":`, error);
    throw error;
  }
}

// localStorage-ის დამხმარე ფუნქციები — იმპორტი გააკეთე სადაც ჩანაწერები გჭირდება
export function getSaved() {
  const raw = localStorage.getItem('savedItems');
  return raw ? JSON.parse(raw) : [];
}

export function setSaved(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}
