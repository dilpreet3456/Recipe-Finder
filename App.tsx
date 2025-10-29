import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function App() {
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mood, setMood] = useState("");
  const timeoutRef = useRef(null);
  React.useEffect(() => {
    if (ingredient) {
      fetchRecipes(ingredient);
    }
  }, [mood]);

  const ingredientSuggestions = [
    "chicken",
    "beef",
    "pork",
    "egg",
    "milk",
    "cheese",
    "banana",
    "tomato",
    "potato",
    "onion",
    "rice",
    "fish",
    "bread",
    "chocolate",
    "carrot",
    "spinach",
    "beans",
    "mushroom",
    "corn",
    "broccoli",
  ];

  const relatedIngredients = {
    paneer: "cheese",
    curd: "yogurt",
    yogurt: "milk",
    mutton: "beef",
    beef: "chicken",
  };
  const moodMap: Record<string, string[]> = {
    "Comfort Food": ["Beef", "Pork", "Chicken", "Lamb", "Pasta"],
    "Light Meal": ["Seafood", "Vegetarian", "Salad"],
    "Quick Snack": ["Dessert", "Breakfast", "Side", "Snack"],
  };

  const getClosestMatch = (word, list) => {
    const similarity = (a, b) => {
      a = a.toLowerCase();
      b = b.toLowerCase();
      let matches = 0;
      for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] === b[i]) matches++;
      }
      return matches / Math.max(a.length, b.length);
    };
    let best = list[0];
    let bestScore = 0;
    for (const item of list) {
      const score = similarity(word, item);
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }
    return bestScore > 0.6 ? best : null;
  };

  const fetchRecipes = async (query, isFallback = false) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!query.trim()) {
      setLoading(false);
      setMessage("");
      setRecipes([]);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`
      );
      const data = await response.json();

      if (data.meals) {
        const fullRecipes = await Promise.all(
          data.meals.map(async (meal) => {
            const res = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            );
            const detail = await res.json();
            return detail.meals ? detail.meals[0] : null;
          })
        );

        const validRecipes = fullRecipes.filter(Boolean);

        // ✅ Apply mood filtering on full recipe data
        let filteredMeals = validRecipes;
        if (mood && moodMap[mood]) {
          filteredMeals = validRecipes.filter((meal) =>
            moodMap[mood].some(
              (keyword) =>
                meal.strCategory
                  ?.toLowerCase()
                  .includes(keyword.toLowerCase()) ||
                meal.strMeal?.toLowerCase().includes(keyword.toLowerCase())
            )
          );
        }

        if (filteredMeals.length > 0) {
          setRecipes(filteredMeals);
          setMessage(
            `Showing ${mood ? mood + " " : ""}recipes for "${query}".`
          );
        } else {
          setRecipes(validRecipes);
          setMessage(
            `No ${mood} recipes found. Showing all recipes for "${query}".`
          );
        }
      } else {
        const fallback = relatedIngredients[query.toLowerCase()];
        const closeMatch = getClosestMatch(query, ingredientSuggestions);

        if (!isFallback && (fallback || closeMatch)) {
          const next = fallback || closeMatch;
          setMessage(
            `No recipes found for "${query}". Trying "${next}" instead...`
          );
          timeoutRef.current = setTimeout(() => {
            fetchRecipes(next, true);
          }, 800);
          return;
        }

        setMessage(`No recipes found for "${query}". Try another ingredient.`);
        setRecipes([]);
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again later.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (item) => {
    setIngredient(item);
    setShowSuggestions(false);
    fetchRecipes(item);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchRecipes(ingredient);
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = ingredientSuggestions.filter((item) =>
    item.toLowerCase().includes(ingredient.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Happy Tummy Recipe Finder</h1>
      <p className="subtitle">
        Find what to cook based on what’s in your fridge.
      </p>
      <div className="mood-filter">
        <label htmlFor="mood">Select your mood: </label>
        <select
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="">-- Choose Mood --</option>
          <option value="Comfort Food">Comfort Food</option>
          <option value="Light Meal">Light Meal</option>
          <option value="Quick Snack">Quick Snack</option>
        </select>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter an ingredient (e.g. chicken)"
          value={ingredient}
          onChange={(e) => {
            setIngredient(e.target.value);
            setShowSuggestions(true);
            setMessage("");
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => fetchRecipes(ingredient)}>Search</button>

        {showSuggestions && ingredient && filteredSuggestions.length > 0 && (
          <ul className="suggestions">
            {filteredSuggestions.map((item) => (
              <li key={item} onClick={() => handleSuggestionClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {!loading && message && <p className="message">{message}</p>}

      <div className="grid">
        {recipes.map((meal) => (
          <div key={meal.idMeal} className="card">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <div className="card-info">
              <h3>{meal.strMeal}</h3>
              <button
                className="view-btn"
                onClick={() => navigate(`/recipe/${meal.idMeal}`)}
              >
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
