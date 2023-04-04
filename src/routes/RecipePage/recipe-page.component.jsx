import './recipe.page.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faPinterest } from '@fortawesome/free-brands-svg-icons';
import { useState, useEffect, useContext } from 'react';
import NutritionLabel from '../../components/Nutrition-Label/nutrition-label.component';
import RecipeMacros from '../../components/Recipe-Macros/recipe-macros.component';
import { PantryContext } from '../../contexts/pantry-context';
import { GroceryContext } from '../../contexts/grocery-context';
import { RecipeContext } from '../../contexts/recipe-context';
import FilledHeart from '../../Icons/heart.png';
import EmptyHeart from '../../Icons/love.png';
import { UserContext } from '../../contexts/user-context';
import { Link, animateScroll as scroll } from 'react-scroll'
import Spinner from '../../components/Spinner/spinner.component';


const RecipePage = () => {
    const { pantryItems } = useContext(PantryContext);
    const { addItemToGroceries } = useContext(GroceryContext);
    const { favorites, setFavorites, recipe, setRecipe } = useContext(RecipeContext);
    const { user, isLoading } = useContext(UserContext);
    const [ isRecipeLoading, setIsRecipeLoading ] = useState(true);
    
    const loadPage = () => setIsRecipeLoading(false);

    useEffect(() => {
        isLoading ? setRecipe([]) : setRecipe(user.recipe);
        setTimeout(loadPage, 1000)
    }, [isLoading, user])

    const defaultRecipeDetails = {
        cuisine: '',
        dietPreferences: [],
        dietRestrictions: [],
        yield: [],
    }

    const [ recipeDetails, setRecipeDetails ] = useState(defaultRecipeDetails)

    const favorite = async (event) => {
        let newFavorites = [];
        const existing = favorites.filter(favorite => favorite.name === event.currentTarget.value);
        if (existing.length === 0) {
            newFavorites = favorites.concat([{name: event.currentTarget.value, dateAdded: Date()}]);
        } else {
            if (favorites.length > 1) {
                newFavorites = favorites.filter(favorite => favorite.name !== event.currentTarget.value);

            } else {
                newFavorites = [];
            }
        }
        const response = await fetch('http://localhost:3080/favorites', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                favorites: newFavorites,
            })
        })
        const data = await response.json();
        setFavorites(data);
        
    }

    useEffect(() => {
        if (!isRecipeLoading) {
            const cuisine = recipe[0].recipe.cuisineType[0]
            const capitalized = cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
            const dietPreferences = recipe[0].recipe.healthLabels.filter(label => label === 'Sugar-Conscious' | label === 'Vegetarian' || label === 'Vegan' || label === "Pescatarian");
            const dietRestrictions = recipe[0].recipe.healthLabels.filter(label => label === 'Egg-Free' || label === 'Peanut-Free'|| label === 'Soy-Free' || label === 'Shellfish-Free');
            const yieldArray = Array.from({length: Number(recipe[0].recipe.yield)}, (_, i) => i + 1);
            setRecipeDetails({
                cuisine: capitalized,
                dietPreferences: dietPreferences,
                dietRestrictions: dietRestrictions,
                yield: yieldArray,
            })
        } else {
            setRecipeDetails(defaultRecipeDetails);
        }
    }, [recipe, isRecipeLoading])
    
    return (
        <>
        {isRecipeLoading ? (
            <Spinner />
        ) : (
            <div className='recipe-page-container'>
                <div className='recipe-title-container'>
                    <span>{recipe[0].recipe.label}</span>
                    <button onClick={favorite} value={recipe[0].recipe.label}>{favorites.filter(favorite => favorite.name === recipe[0].recipe.label).length === 0 ? (<img src={EmptyHeart} alt='empty-heart' className='recipe-favorite'/>) : (<img src={FilledHeart} alt='filled-heart' className='recipe-favorite'/>)}</button>
                </div>
                <div className='recipe-servings-container'>
                    <span>Feeds</span>
                    <div className='recipe-servings'>
                        {recipeDetails.yield.map(num => (
                            <FontAwesomeIcon icon={faUser} key={num}/>
                        ))}
                    </div>
                </div>
                <div className='recipe-time-container'>
                    <div className='recipe-time'>
                        <span>Total time: {recipe[0].recipe.totalTime} min</span>
                        <span>Calories: {Math.floor(recipe[0].recipe.calories)} kcal</span>
                        <span>Cuisine: {recipeDetails.cuisine}</span>
                    </div>
                    <hr />
                    <span id='jump'><Link activeClass="active" to="nutrition" spy={true} smooth={true} offset={-50} duration={1000} delay={100}>Jump to Nutrition Facts</Link></span>
                </div>
                <div className='bottom-section'>
                    <div>
                        <div className='recipe-ingredients-image-container'>
                            <div className='recipe-ingredients-directions-container'>
                            <span className='ingredients-title'>Ingredients</span>
                                <div className='recipe-ingredients-container'>
                                    {recipe[0].recipe.ingredients.map(ingredient => (
                                        <span>
                                            {pantryItems.includes(ingredient.food.toLowerCase()) ? (<FontAwesomeIcon icon={faCircleCheck} className='circle-check' />) : (<FontAwesomeIcon icon={faCircleXmark} className='circle-x' />)}{ingredient.text}
                                            {pantryItems.includes(ingredient.food.toLowerCase()) ? (<></>) : (<button onClick={() => addItemToGroceries(ingredient.food.toLowerCase())}>Add to list</button>)}
                                        </span>
                                    ))}
                                </div>
                                <span className='block'>View Recipe: <a href={recipe[0].recipe.url}>{recipe[0].recipe.source}</a><FontAwesomeIcon icon={faPinterest} className='pinterest'/></span>
                                <div className='diet-info'>Diet Information</div>  
                                <span className='block'>Preferences: {recipeDetails.dietPreferences.map(pref => <span className='indent'>{pref},</span>)}</span>
                                <span className='block'>Restrictions: {recipeDetails.dietRestrictions.map(pref => <span className='indent'>{pref},</span>)}</span>
                                <span className='block'>Contains: <span className='indent'>{recipe[0].recipe.cautions}</span></span>
                            </div>
                            <div className='recipe-image'>
                                <img src={recipe[0].recipe.image} alt='recipe' />
                            </div>  
                        </div>
                        <div className='recipe-nutrition-facts-macros-container' id="nutrition">
                            <div className='recipe-nutrition-facts-container'>
                                <NutritionLabel recipe={recipe[0]}/>
                            </div>
                            <div className='recipe-macros-container'>
                                <span>Macros</span>
                                <RecipeMacros recipe={recipe[0]}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default RecipePage;