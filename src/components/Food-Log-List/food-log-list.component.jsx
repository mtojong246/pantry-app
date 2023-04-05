import './food-log.list.styles.scss';
import PlusCircle from '../../Icons/plus-circle.svg';
import FoodLogModal from '../../modals/Food-Log-Modal/food-log-modal.component';
import { useState, useContext } from 'react';
import { NutritionContext } from '../../contexts/nutrition-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import LogQuantityModal from '../../modals/Log-Quantity-Modal/log-quantity-modal.component';
import { UserContext } from '../../contexts/user-context';
import Spinner from '../Spinner/spinner.component';


const FoodLogList = () => {
    const [ foodLogModal, setFoodLogModal ] = useState(false);
    const [ quantityModal, setQuantityModal ] = useState(false);
    const [ itemObject, setItemObject ] = useState({});
    const { setFoodCategory, foodLog, logValues, setLogValues, removeItemFromLog, prevQuantities, setPrevQuantities } = useContext(NutritionContext);
    const { user, isLoading } = useContext(UserContext);

    const toggleFoodLogModal = () => setFoodLogModal(!foodLogModal);
    const toggleQuantityModal = () => setQuantityModal(!quantityModal);

    const onClickHandler = (event) => {
        setTimeout(toggleFoodLogModal, 0);
        setFoodCategory(event.currentTarget.value);        
    }


    const removeNutritionInfo = async (item) => {
        const result = JSON.parse(item); 
        const newObj = {
            'Total Calories': logValues[0]['Total Calories'] - (result.quantity*result.calories),
            'Protein': logValues[0]['Protein'] - (result.quantity*result.protein),
            'Carbohydrates': logValues[0]['Carbohydrates'] - (result.quantity*result.carbs),
            'Fat': logValues[0]['Fat'] - (result.quantity*result.fat),
        }

        const response = await fetch('https://still-hollows-61456.herokuapp.com/log-values', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                logValues: [newObj],
            })
        })
        const data = await response.json();
        setLogValues(data);

        const updatedQuants = prevQuantities.filter(prev => prev.name !== result.name);

        const quantResponse = await fetch('https://still-hollows-61456.herokuapp.com/prev-quantities', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                prevQuantities: updatedQuants,
            })
        })
        const quantData = await quantResponse.json();
        setPrevQuantities(quantData);
    }

    
    const changeQuantity = (event) => {
        const selected = JSON.parse(event.target.value);
        setItemObject(selected);
        toggleQuantityModal();
    }
    

    return (
        <>
        {isLoading ? (
            <Spinner />
        ) : (
            <>
                <div className='food-log-list-container'>
                    {foodLog.map(categories => (
                        <div className='food-log-categories'>
                            <div className='food-category-box'>
                                <span>{categories.category}</span>
                            </div>
                            {categories.items.length !== 0 ? (
                                <>
                                    <div className='food-item-box'>
                                        {categories.items.map(item => (
                                            <div className='food-item'>
                                                <span>{item.name}<button id='food-item-quantity' value={JSON.stringify(item)} onClick={changeQuantity}>({item.quantity})</button></span><FontAwesomeIcon icon={faXmark} onClick={() => {removeItemFromLog(categories.category, item.name); removeNutritionInfo(JSON.stringify(item))}} className='remove-from-log'/>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='add-food-box move-up'>
                                        <button onClick={onClickHandler} value={categories.category}>
                                            <span className='add-food'>Add more</span><img src={PlusCircle} alt='plus' />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className='add-food-box'>
                                    <button onClick={onClickHandler} value={categories.category}>
                                        <span className='add-food'>Add food</span><img src={PlusCircle} alt='plus' />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <FoodLogModal foodLogModal={foodLogModal} toggleFoodLogModal={toggleFoodLogModal}/>
                <LogQuantityModal quantityModal={quantityModal} toggleQuantityModal={toggleQuantityModal} itemObject={itemObject} />
            </>
            )}
        </>
    )
}

export default FoodLogList;