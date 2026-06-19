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

// რეცეპტის ფავორიტებში შენახვის დამხმარე ფუნქცია 
export function saveToFavorites(meal) {
  // 1. წამოვიღოთ უკვე არსებული ფავორიტები მეხსიერებიდან
  const saved = getSaved();
  
  // 2. შევამოწმოთ, ხომ არ არის ეს კერძი უკვე დამატებული (id-ის მიხედვით)
  const exists = saved.some(item => item.id === meal.idMeal);
  
  // 3. თუ არ არის დამატებული, შევქმნათ ახალი ობიექტი საჭირო მონაცემებით და დავამატოთ მასივში
  if (!exists) {
    saved.push({
      id: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strCategory: meal.strCategory
    });
    
    // 4. ჩავწეროთ განახლებული მასივი უკან localStorage-ში
    setSaved(saved);
    return true; // წარმატებით დაემატა
  }
  
  return false; // უკვე არსებობს ფავორიტებში
}
