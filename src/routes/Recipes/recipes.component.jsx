import './recipes.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import RecipeList from '../../components/Recipe-List/recipe-list.component';
import { useContext, useState } from 'react';
import { RecipeContext } from '../../contexts/recipe-context';
import { Link } from 'react-router-dom';

const Recipes = () => {
    const [ selection, setSelection ] = useState('');
    const preferences = ['Sugar-Conscious', 'Vegetarian', 'Vegan', 'Pescatarian'];
    const restrictions = ['Egg-Free', 'Peanut-Free', 'Soy-Free', 'Shellfish-Free'];
    const cuisines = ['american', 'asian', 'caribbean', 'italian', 'kosher'];
    const times = [1,10,20,30];

    const { pantryRecipes, setFilteredRecipes } = useContext(RecipeContext);  

    const onChangeHandler = (event) => {
        if (event.target.value === '') {
            setSelection('')
        } else {   
            const select = JSON.parse(event.target.value);
            setSelection(select);
        }    
    }

    const onClickHandler = () => {
        if (selection === '') {
            setFilteredRecipes(pantryRecipes)
        } else if (preferences.includes(selection)) {
            setFilteredRecipes(pantryRecipes.filter(recipes => recipes.recipe.healthLabels.includes(selection)))
        } else if (restrictions.includes(selection)) {
            setFilteredRecipes(pantryRecipes.filter(recipes => recipes.recipe.healthLabels.includes(selection)))
        } else if (cuisines.includes(selection)) {
            setFilteredRecipes(pantryRecipes.filter(recipes => recipes.recipe.cuisineType.includes(selection)))
        } else if (times.includes(selection)) {
            setFilteredRecipes(pantryRecipes.filter(recipes => recipes.recipe.totalTime <= selection))
        }
    }

    

    return (
        <div className='main-recipe-page-container'>
            <div className='recipe-title-container'>
                <span className='recipe-title'>Recipes</span>
                <Link to='/profile/favorites' style={{textDecoration: 'none'}}>
                    <div className='favorites-container'>
                        <FontAwesomeIcon icon={faHeart} />
                        <span>My Favorites</span>
                    </div>
                </Link>
            </div>
            <hr className='recipe-page-border'/>
            <div className='recipe-body-container'>
                <div className='recipe-filter-container'>
                    <span>Filter</span>
                    <hr />
                    <div className='recipe-filters'>
                        <div className='filter'>
                            <select onChange={onChangeHandler}>
                                <option value=''>Diet Preferences</option>
                                {preferences.map(preference => (
                                    <option value={JSON.stringify(preference)}>{preference}</option>
                                ))}
                            </select>
                            <button onClick={onClickHandler}>Apply</button>
                        </div>
                        <div className='filter'>
                            <select onChange={onChangeHandler}>
                                <option value=''>Diet Restrictions</option>
                                {restrictions.map(restriction => (
                                    <option value={JSON.stringify(restriction)}>{restriction}</option>
                                ))}
                            </select>
                            <button onClick={onClickHandler}>Apply</button>
                        </div>
                        <div className='filter'>
                            <select onChange={onChangeHandler}>
                                <option value=''>Cuisines</option>
                                {cuisines.map(cuisine => (
                                    <option value={JSON.stringify(cuisine)}>{cuisine}</option>
                                ))}
                            </select>
                            <button onClick={onClickHandler}>Apply</button>
                        </div>
                        <div className='filter'>
                            <select onChange={onChangeHandler}>
                                <option value=''>Max Cook Time</option>
                                {times.map(time => (
                                    <option value={JSON.stringify(time)}>{'≤'}{time}min</option>
                                ))}
                            </select>
                            <button onClick={onClickHandler}>Apply</button>
                        </div>
                    </div>
                </div>
                <div className='recipe-body-list'>
                    <RecipeList />
                </div>
            </div>
        </div>
    )
}

export default Recipes;