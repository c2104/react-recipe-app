import React, { useEffect, useState, useRef, useCallback } from 'react'
import './App.css';
import Recipe from './Recipe';

function App() {
  const APP_ID = process.env.REACT_APP_APP_ID;
  const APP_KEY = process.env.REACT_APP_APP_KEY;

  // 【useRef】
  // 引数で渡した値を.currentプロパティとして保持したオブジェクトを返す
  // 初期値がnullの場合、使用目的がDOM操作となるため、.currentプロパティは書き換え不可
  // 初期値が具体的な値の場合、.currentプロパティは書き換え可能
  // - const refオブジェクト = useRef(初期値)
  const inputRef = useRef(null);

  // 【useEffect】
  // コンポーネントの初回レンダリングあるいは再レンダリングされる際に実行したい処理を制御するための機能
  // 第２引数が空配列の場合は、初回レンダリング後のみ実行される
  // 第２引数が依存データを含む配列の場合は、依存データが再レンダリングされた後に実行される
  // - const useEffect(() => {
  //     実行させたいさせたい副作用関数
  //   }, [副作用関数の実行タイミングを制御するための依存データ]);
  useEffect(() => {
    focusInput();
  }, []);

  const focusInput = () => {
    inputRef.current.focus()
  }

  // 【useState】
  // Reactのstate機能を関数コンポーネントに追加する
  // 通常の変数と違い、state変数は関数が終了してもReactによって保持される
  // - const [state変数, state変数を更新する関数] = useState(state変数の初期値);
  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('banana');
  const [recipes, setRecipes] = useState([]);

  // 【uesCallback】
  // メモ化したコールバック関数を返す
  // useEffectと同様、依存配列の要素のいずれかが変化した場合に、メモ化した値が再計算される
  // - const 変数 = useCallback(() => {コールバック関数}, [依存配列]);
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

      // foodIdで重複削除した配列作成
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
      <div className='wrapper'>
        <form onSubmit={getSearch}>
          <input ref={inputRef} type="text" value={search} onChange={updateSearch} />
          <button type="submit" onClick={focusInput}>検索</button>
        </form>
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
