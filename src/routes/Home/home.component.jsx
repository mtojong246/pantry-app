import './home.styles.scss';
import PlusCircle from '../../Icons/plus-circle.svg';
import PantryModal from '../../modals/Pantry-Modal/pantry-modal.component';
import InsidePantry from '../../components/Inside-Pantry/inside-pantry.component';
import { useState, useContext, useEffect } from 'react';
import { PantryContext } from '../../contexts/pantry-context';
import { RecipeContext } from '../../contexts/recipe-context';
import { useNavigate } from 'react-router';
import { recipeApiLinks } from '../../api-data/recipe-data';
import { UserContext } from '../../contexts/user-context';


const Home = () => {
    const { isPantryActive, clearItemsFromPantry, pantryItems } = useContext(PantryContext);
    const { recipeList, setRecipeList, setPantryRecipes } = useContext(RecipeContext);
    const { user } = useContext(UserContext)

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

    const goToRecipeList = () => {
        nav('/profile/recipes')
    }

    useEffect(() => {
        if (pantryItems.length === 0) {
            setPantryRecipes([]);
        } else {
            return;
        }
    }, [pantryItems])


    const [pantryModal, setPantryModal] = useState(false);

    const togglePantryModal = () => setPantryModal(!pantryModal);

    const onClickHandler = async () => {
        clearItemsFromPantry();
        const response = await fetch('http://localhost:3080/pantry-recipes', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                pantryRecipes: [],
            })
        })
        const data = await response.json();
        setPantryRecipes(data);
    }

    const storeRecipes = async () => {
        const newRecipes = pantryItems.reduce((acc, item) => {
            const currentList = recipeList.filter(ind => (ind.recipe.ingredients.map(ingredient => ingredient.food)).includes(item));
            const uniqueList = [...new Set(currentList)];
            return acc.concat(uniqueList);
        }, []);

        const response = await fetch('http://localhost:3080/pantry-recipes', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                pantryRecipes: newRecipes
            })
        })
        const data = await response.json();
        setPantryRecipes(data);
    }

    return (
        <>
            <div className='pantry-container'>
                <div className='outside-pantry'>
                    <label>My Pantry</label>
                    <div className='inside-pantry'>
                        {isPantryActive ? (
                            <InsidePantry />
                        ) : (
                            <div className='add-food' onClick={togglePantryModal}>
                                <img src={PlusCircle} alt='plus'/>
                                <span>Add food</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className='pantry-buttons-container'>
                {isPantryActive ? (
                    <>
                        <button onClick={togglePantryModal}>Add more</button>
                        <button onClick={() => {storeRecipes(); setTimeout(goToRecipeList, 0)}}>Get Recipes</button>
                        <button onClick={() => onClickHandler()}>Clear Pantry</button>
                    </>  
                ) : (
                    <div className='pantry-message'>
                        <p>Add ingredient from your pantry to discovery new recipes!</p>
                    </div>
                )}
                </div>
            </div>
            <PantryModal pantryModal={pantryModal} togglePantryModal={togglePantryModal}/>
        </>
    )
}

export default Home;