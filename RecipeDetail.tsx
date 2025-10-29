import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./index.css";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();
        if (data.meals && data.meals[0]) {
          setRecipe(data.meals[0]);
        } else {
          setRecipe(null);
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading recipe details...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="recipe-detail-page">
      <div className="recipe-detail">
        <button
          className="back-btn"
          onClick={() => navigate("/", { replace: true })}
        >
          ← Back
        </button>

        <h1>{recipe.strMeal}</h1>
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="recipe-img"
        />
        <p>
          <strong>Category:</strong> {recipe.strCategory}
        </p>
        <p>
          <strong>Area:</strong> {recipe.strArea}
        </p>

        <h3>Instructions:</h3>
        <p>{recipe.strInstructions}</p>

        <h3>Ingredients:</h3>
        <ul>
          {Array.from({ length: 20 }, (_, i) => i + 1)
            .map((n) => {
              const ing = recipe[`strIngredient${n}`];
              const measure = recipe[`strMeasure${n}`];
              return ing ? (
                <li key={n}>
                  {ing} {measure ? `- ${measure}` : ""}
                </li>
              ) : null;
            })
            .filter(Boolean)}
        </ul>

        {recipe.strYoutube && (
          <a
            href={recipe.strYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="view-btn"
          >
            Watch on YouTube
          </a>
        )}
      </div>
    </div>
  );
}

export default RecipeDetail;
