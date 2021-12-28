import React, { useEffect, useState, useRef, useCallback } from 'react'
import './App.css';
import Recipe from './Recipe';

function App() {
  const APP_ID = process.env.REACT_APP_APP_ID;
  const APP_KEY = process.env.REACT_APP_APP_KEY;

  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus()
  }, []);

  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('banana');
  const [recipes, setRecipes] = useState([]);

  const getRecipes = useCallback(async () => {
    const response = await fetch(`https://api.edamam.com/search?q="${query}"&app_id=${APP_ID}&app_key=${APP_KEY}`);
    const data = await response.json();

    //材料の重複を削除
    const recipeList = distinctIngredient(data.hits);

    setRecipes(recipeList);
  }, [APP_ID, APP_KEY, query]);

  const getSearch = e => {
    e.preventDefault();   // htmlの<form>のaction実行を防止
    setQuery(search);
    setSearch('');
  };

  const updateSearch = e => {
    setSearch(e.target.value);
  };

  const distinctIngredient = (recipeList) => {
    for (let i = 0; i < recipeList.length; i++) {
      // 材料取得
      const ingredients = recipeList[i].recipe.ingredients;

      // foodIdで重複削除した配列作成githu
      const distincted = [...new Map(ingredients.map(item => [item["foodId"], item])).values()];

      // 材料を更新する
      recipeList[i].recipe.ingredients = distincted;
    }

    return recipeList;
  };

  useEffect(() => {
    getRecipes();
  }, [query, getRecipes]);

  return (
    <div className="App">
      <form onSubmit={getSearch}>
        <input ref={inputRef} type="text" value={search} onChange={updateSearch} />
        <button type="submit">検索</button>
      </form>
      <div>
        {recipes.map(recipe => (
          <Recipe
            key={recipe.recipe.uri}
            title={recipe.recipe.label}
            calories={recipe.recipe.calories}
            image={recipe.recipe.image}
            ingredients={recipe.recipe.ingredients}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
