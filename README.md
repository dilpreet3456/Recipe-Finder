# Recipe-Finder

# Happy Tummy Recipe Finder

A **React + TypeScript** recipe finder that helps you discover meals based on what ingredients you have — and even tailors results to your mood.  
It fetches recipes from [TheMealDB API](https://www.themealdb.com/api.php), applies fuzzy ingredient matching, and filters results dynamically.

---

## Features
 **Search by ingredient** – Quickly find recipes using whatever you’ve got in your kitchen.  
 **Smart suggestions** – If an ingredient doesn’t match, the app automatically suggests or retries with related ones.  
**Mood filtering** – Pick your mood (Comfort Food, Light Meal, Quick Snack) to refine results.  
**Recipe details** – View full recipe info on a dedicated detail page.  
**Responsive UI** – Clean, minimal layout that adapts across devices.  
**Built with TypeScript** – Type safety, clean structure, and better maintainability.

---

##  Tech Stack

| Category | Technology |
|-----------|-------------|
| **Language** | TypeScript |
| **Framework** | React (with Hooks) |
| **Routing** | React Router DOM |
| **Styling** | CSS (custom styles in `index.css`) |
| **API Source** | [TheMealDB API](https://www.themealdb.com/api.php) |

---

API Reference

The app uses TheMealDB API
:

Endpoint	Description
https://www.themealdb.com/api/json/v1/1/filter.php?i=<ingredient>	Fetches meals that include a given ingredient
https://www.themealdb.com/api/json/v1/1/lookup.php?i=<meal_id>	Fetches full meal details


Mood Filtering Logic

Each mood applies keyword-based filtering on recipe categories and names.

Mood	Keywords
Comfort Food	Beef, Pork, Chicken, Lamb, Pasta
Light Meal	Seafood, Vegetarian, Salad
Quick Snack	Dessert, Breakfast, Snack, Side
 Smart Ingredient Matching

The app uses two layers of fallback:

Related ingredients map (e.g. paneer → cheese, curd → yogurt)

Fuzzy matching — finds close matches like “chiken” → “chicken”.

If no recipes exist, it automatically retries with the next best option.

Upcoming Enhancements

 Add “Favorite Recipes” feature (localStorage support)

 Add category-based filtering (e.g., cuisine type)

 Enhance fuzzy search using Levenshtein distance

 Add image lazy loading for performance
License

This project is released under the MIT License.

👨‍💻 Author

Dilpreet Kaur

 • dilpreetmutreja33@gmail.com



Live Demo

Experience the app in action here:  
 **[Happy Tummy Recipe Finder – Live Preview](https://g8p9h2.csb.app/)**  
*(Hosted via CodeSandbox)*
