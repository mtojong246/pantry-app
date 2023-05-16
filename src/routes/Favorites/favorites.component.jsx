import './favorites.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { RecipeContext } from '../../contexts/recipe-context';
import { useNavigate } from 'react-router';
import FilledHeart from '../../Icons/heart.png';
import EmptyHeart from '../../Icons/love.png';
import { UserContext } from '../../contexts/user-context';
import Spinner from '../../components/Spinner/spinner.component';

const Favorites = () => {
    const { favorites, setFavorites, recipeList, isFavoritesLoading, setRecipe } = useContext(RecipeContext);
    const [ filteredFavorites, setFilteredFavorites ] = useState(favorites);
    const { user, isLoading } = useContext(UserContext)

    useEffect(() => {
        setFilteredFavorites(favorites);
    }, [favorites])

    const nav = useNavigate();

    const recipeRoute = (link) => {
        nav(`/profile/recipes/${link}`);
    }

    const setRecipeDetails = async (newItem) => {
        const response = await fetch('https://still-hollows-61456.herokuapp.com/recipe', {
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

    const sort = (event) => {
        const array = [...favorites]
        if (event.target.value === 'Sort By Alphabet') {
            array.sort(function (a, b) {
                if (a.name < b.name) {
                  return -1;
                }
                if (a.name > b.name) {
                  return 1;
                }
                return 0;
            });  
            setFilteredFavorites(array);
        } else if (event.target.value === 'Sort By Date') {
            array.sort(function(a,b){
                return new Date(a.dateAdded) - new Date(b.dateAdded);
            });
            setFilteredFavorites(array);
        } else {
            setFilteredFavorites(favorites);
        }
    }

    const unfavorite = async (event) => {
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
        const response = await fetch('https://still-hollows-61456.herokuapp.com/favorites', {
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
            <>
            {favorites.length === 0 ? (
                <div className='empty-message-favorites-container'>   
                    <span><FontAwesomeIcon icon={faUtensils} id='utensils'/>Your favorites page is empty.</span>
                </div>
            ) : (
                <div className='favorites-list-container'>
                    <div className='favorites-title'>
                        <span>My Favorites</span>
                        <select onChange={sort}>
                            <option>Sort</option>
                            <option>Sort By Alphabet</option>
                            <option>Sort By Date</option>
                        </select>
                    </div>
                    <hr />
                    <div className='favorite-recipes-container'>
                    {filteredFavorites.map(favorite => (
                        <div className='favorite-recipes'>
                            <div className='favorite-recipe-title'>
                                <span>{favorite.name}</span>
                                <button onClick={() => { setTimeout(recipeRoute((favorite.name).toLowerCase().replace(/\s/g , "-")), 0); setRecipeDetails(recipeList.filter(recipes => recipes.recipe.label === favorite.name)[0]); }}>View</button>
                            </div>
                            <div className='favorite-heart'>
                                <button onClick={unfavorite} value={favorite.name}>{favorites.filter(favorites => favorites.name === favorite.name).length === 0 ? (<img src={EmptyHeart} alt='empty-heart' />) : (<img src={FilledHeart} alt='filled-heart' />)}</button>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            )}
            </>
        )}
        </>
    )
}

export default Favorites;