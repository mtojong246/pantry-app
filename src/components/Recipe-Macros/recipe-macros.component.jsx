import './recipe-macros.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons';
import { useContext, useState } from 'react';
import { NutritionContext } from '../../contexts/nutrition-context';
import { UserContext } from '../../contexts/user-context';
import Spinner from '../Spinner/spinner.component';

const RecipeMacros = ({recipe}) => {
    const categories = [['Protein','PROCNT'] , ['Carbohydrates', 'CHOCDF'], ['Fat', 'FAT']];
    const times = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    const { logValues, setLogValues, nutritionValues, foodLog, setFoodLog, servings, setServings, prevQuantities, setPrevQuantities } = useContext(NutritionContext);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const { user, isLoading } = useContext(UserContext);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const increase = () => {
        if (servings === recipe.recipe.yield) {
            return;
        } else {
            setServings(servings+1)
        }
    }

    const decrease = () => {
        if (servings === 1) {
            return;
        } else {
            setServings(servings-1)
        }
    }

    const onClickHandler = async (event, item) => {
        const prevObj = foodLog.find(foodCategories => foodCategories.category === event.target.value);
        const existingItem = prevObj.items.find(item => item.name === item.recipe.label);
        if (existingItem) {
            return;
        } else {
            const newArray = prevObj.items.concat([{name: item.recipe.label, category: event.target.value, quantity: Number(servings), calories: Math.floor(item.recipe.totalNutrients['ENERC_KCAL'].quantity), protein: Math.floor(item.recipe.totalNutrients['PROCNT'].quantity), carbs: Math.floor(item.recipe.totalNutrients['CHOCDF'].quantity), fat: Math.floor(item.recipe.totalNutrients['FAT'].quantity) }]);
            let updatedLog = foodLog.map(item => item.category === event.target.value ? {...item, items: newArray} : item)

            const response = await fetch('http://localhost:3080/food-log', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: user.email,
                    foodLog: updatedLog,
                })
            })
            const data = await response.json();
            setFoodLog(data);

            const newQuants = prevQuantities.concat([{name: item.recipe.label, quantity: Number(servings)}])

            const quantResponse = await fetch('http://localhost:3080/prev-quantities', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: user.email,
                    prevQuantities: newQuants,
                })
            })
            const quantData = await quantResponse.json();
            setPrevQuantities(quantData);
        }
    }

    const getNutritionInfo = async (item) => {
        const newObj = {
            'Total Calories': logValues[0]['Total Calories'] + ((Math.floor(item.recipe.totalNutrients['ENERC_KCAL'].quantity)*(Number(servings)))),
            'Protein': logValues[0]['Protein'] + ((Math.floor(item.recipe.totalNutrients['PROCNT'].quantity))*(Number(servings))),
            'Carbohydrates': logValues[0]['Carbohydrates'] + ((Math.floor(item.recipe.totalNutrients['CHOCDF'].quantity))*(Number(servings))),
            'Fat': logValues[0]['Fat'] + ((Math.floor(item.recipe.totalNutrients['FAT'].quantity))*(Number(servings))),
        }
        
        const logResponse = await fetch('http://localhost:3080/log-values', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                logValues: [newObj],
            })
        })
        const logData = await logResponse.json();
        setLogValues(logData);
    }

    return (
        <>
        {isLoading ? (
            <Spinner />
        ) : (
            <div className='macros-container'>
                <div className='macros-servings-container'>
                    <span>Servings <FontAwesomeIcon icon={faMinusSquare} className='servings-icon' onClick={() => decrease()}/> {servings} <FontAwesomeIcon icon={faPlusSquare} className='servings-icon' onClick={() => increase()}/></span>
                </div>
                {categories.map(category => (
                    <div className='macros-levels-container'>
                        <label>{category[0]}</label>
                        <div className='macros-level'>
                            <div className='current-level' style={{width: `${Math.floor(eval((logValues[0][category[0]])*100/nutritionValues[0][category[0]]))}%`}}/><div className='additional-level' style={{width: `${Math.floor(eval((Math.floor(recipe.recipe.totalNutrients[category[1]].quantity))*Number(servings)*100/nutritionValues[0][category[0]]))}%`}}/>
                        </div>
                        <div className='macros-quantities'>
                            <span>{logValues[0][category[0]]}</span><span>g</span><span style={{color: '#A7F4F4'}}>(+{Math.floor(recipe.recipe.totalNutrients[category[1]].quantity)*Number(servings)}g)</span><span>/{nutritionValues[0][category[0]]}</span><span>g</span>
                        </div>
                    </div>
                ))}
                <div className='macros-calories-container'>
                    <span>Total Calories: <span>{logValues[0]['Total Calories']}kcal<span style={{color: '#A7F4F4'}}>(+{Math.floor(recipe.recipe.totalNutrients['ENERC_KCAL'].quantity)*Number(servings)}kcal)</span>/{nutritionValues[0]['Total Calories']}kcal</span></span>
                </div>
                <button onClick={toggleDropdown}>Log</button>
                {isDropdownOpen ? (
                    <ul>
                    {times.map(time => (
                        <button onClick={(event) => {onClickHandler(event, recipe); getNutritionInfo(recipe)}} value={time}>{time}</button>
                    ))}
                    </ul>
                ) : (
                    <></>
                )}
            </div>
        )}
        </>
    )
}

export default RecipeMacros;