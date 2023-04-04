import './recipe-list.styles.scss';
import { useContext, useEffect} from 'react';
import { RecipeContext } from '../../contexts/recipe-context';
import { useNavigate } from 'react-router'; 
import FilledHeart from '../../Icons/heart.png';
import EmptyHeart from '../../Icons/love.png';
import { recipeApiLinks } from '../../api-data/recipe-data';
import { UserContext } from '../../contexts/user-context';
import Spinner from '../Spinner/spinner.component';


const RecipeList = () => {    
    const { setPantryRecipes, isRecipeListActive, favorites, setFavorites, recipeList, setRecipeList, filteredRecipes, setRecipe } = useContext(RecipeContext);
    const { user, isLoading } = useContext(UserContext)

    useEffect(() => {
        const fetchRecipeData = async () => {
            const data = await Promise.all(recipeApiLinks.map(async url => {
                const response = await fetch(url);
                return response.json();
            }))
            setRecipeList(data.map(recipe => recipe.hits).flat())
        }
        fetchRecipeData();
    }, [])
    
    const nav = useNavigate();

    const recipeRoute = (link) => {
        nav(`/profile/recipes/${link}`);
    }

    const setRecipeDetails = async (item) => {
        const newItem = JSON.parse(item);
        const response = await fetch('http://localhost:3080/recipe', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                recipe: [newItem],
            })
        })
        const data = await response.json();
        setRecipe(data)
    }

    const onClickHandler = () => {
        setPantryRecipes(recipeList)
    }

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

    

    return (
        <>
        {isLoading ? (
            <Spinner />
        ) : (
            <div className='recipe-list-container'>
                {isRecipeListActive ? (
                <>
                {filteredRecipes.map(ind => (
                    <div className='recipe-list-item-container' key={ind.recipe.uri}>
                        <div className='recipe-item-title'>
                            <div className='recipe-title-box'>
                                <span>{ind.recipe.label}</span>
                            </div>
                            <button onClick={() => { setTimeout(recipeRoute((ind.recipe.label).toLowerCase().replace(/\s/g , "-")), 0); setRecipeDetails(JSON.stringify(ind)) }}>View</button>
                        </div>
                        <div className='recipe-item-attributes'>
                            <button onClick={favorite} value={ind.recipe.label}>{favorites.filter(favorite => favorite.name === ind.recipe.label).length === 0 ? (<img src={EmptyHeart} alt='empty-heart' />) : (<img src={FilledHeart} alt='filled-heart' />)}</button>                                
                        </div>
                    </div>
                ))}
                </>
                ) : (
                    <div className='empty-message-container'>
                        <p>Your recipe list is currently empty. Add ingredients to your pantry or</p>
                        <button onClick={onClickHandler}>View All Recipes</button>
                    </div>
                )}
            </div>
        )}
        </>
    )
}

export default RecipeList;