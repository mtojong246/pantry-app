import './food-log-modal.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { NutritionContext } from '../../contexts/nutrition-context';
import { UserContext } from '../../contexts/user-context';

const FoodLogModal = ({ foodLogModal, toggleFoodLogModal }) => {
    const { foodCategory, logValues, setLogValues, addItemToLog, setPrevQuantities, prevQuantities } = useContext(NutritionContext);
    const [searchLog, setSearchLog] = useState('');
    const [searchResults, setSearchResults] = useState([]);    
    const { user } = useContext(UserContext)

    const onSearchLog = (event) => {
        const newSearch = event.target.value.toLowerCase();
        setSearchLog(newSearch);
    }

    const onSearchEnter = async (searchLogItem) => {
        const response = await fetch(`https://api.edamam.com/auto-complete?app_id=a2f5c533&app_key=aea75c33426935311aa46ffbf39282a7&q=${searchLogItem}`);
        const data = await response.json();
        setSearchResults(data);
    }


    const exitLogModal = () => {
        toggleFoodLogModal();
        setSearchLog('');
        setSearchResults([]);
    }

    const addNutritionInfo = async (result) => {
        const newResult = JSON.parse(result).toLowerCase();
        const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=a2f5c533&app_key=aea75c33426935311aa46ffbf39282a7&ingr=${newResult}&nutrition-type=cooking`)
        const data = await response.json();
        
        const newObj = {
            'Total Calories': logValues[0]['Total Calories'] + Math.floor(data.parsed[0].food.nutrients['ENERC_KCAL']),
            'Protein': logValues[0]['Protein'] + Math.floor(data.parsed[0].food.nutrients['PROCNT']),
            'Carbohydrates': logValues[0]['Carbohydrates'] + Math.floor(data.parsed[0].food.nutrients['CHOCDF']),
            'Fat': logValues[0]['Fat'] + Math.floor(data.parsed[0].food.nutrients['FAT']),
        }

        const logResponse = await fetch('https://still-hollows-61456.herokuapp.com/log-values', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                logValues: [newObj],
            })
        })
        const logData = await logResponse.json();
        setLogValues(logData);

        const newQuants = prevQuantities.concat([{name: newResult, quantity: 1}])
        
        const quantResponse = await fetch('https://still-hollows-61456.herokuapp.com/prev-quantities', {
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

    const onKeyPressHandler = (event) => {
        if (event.key === 'Enter') {
            onSearchEnter(searchLog)
        }
    }

    const onClickHandler = (event) => {
        let button = event.target;
        button.style.backgroundColor = '#90F1B7';
        button.style.borderColor = '#90F1B7';
        button.textContent = button.value;
    }


    return (
        <>
        {foodLogModal && (
            <div className='food-log-modal-container'>
                <div className='food-log-modal-overlay' onClick={exitLogModal}></div>
                <div className='food-log-modal-content popup'>
                    <div className='log-container'>
                        <div className='log-title'>
                            <span>{foodCategory}</span>
                            <FontAwesomeIcon icon={faXmark} className='exit-food-log-modal' onClick={exitLogModal}/>
                        </div>
                        <div className='log-search-container'>
                            <input type='text' onChange={onSearchLog} onKeyDown={onKeyPressHandler}/>
                            <button onClick={() => onSearchEnter(searchLog)}><FontAwesomeIcon icon={faMagnifyingGlass} className='search-log' /></button>
                        </div>
                        <div className='log-results-larger-container'>
                            <div className='log-results-container'>
                                {searchResults.map(result => (
                                    <div className='log-search-results'>
                                        <span>{result}</span>
                                        <button className='add-item-to-log' value='✓' onClick={(event) => {addItemToLog(foodCategory, JSON.stringify(result)); addNutritionInfo(JSON.stringify(result)); onClickHandler(event)}}>Add</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
} 


export default FoodLogModal;