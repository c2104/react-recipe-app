import React from 'react'

const Recipe = (props) => {
    return (
        <div>
            <h1>{props.title}</h1>
            <ol>
                {props.ingredients.map((ingredient, i) => {
                    return <Ingredient ingredient={ingredient} key={ingredient.foodId} />
                })}
            </ol>
            <p>{props.calories} cal</p>
            <img src={props.image} alt="" />
        </div>
    )
}
const Ingredient = ({ingredient}) => {
    return(
        <li>
            {ingredient.text}
        </li>
    )
}

export default Recipe
