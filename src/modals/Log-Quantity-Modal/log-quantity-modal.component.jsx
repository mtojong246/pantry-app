import './log-quantity-modal.styles.scss';
import { useContext, useState } from 'react';
import { NutritionContext } from '../../contexts/nutrition-context';
import { UserContext } from '../../contexts/user-context';

const LogQuantityModal = ({quantityModal, toggleQuantityModal, itemObject}) => {
    const { foodLog, setFoodLog, prevQuantities, setPrevQuantities, logValues, setLogValues } = useContext(NutritionContext);
    const [input, setInput] = useState('');
    const { user } = useContext(UserContext)

    const onChangeHandler = (event) => {
        let newInput = event.target.value;
        setInput(newInput);
    }

    const onClickHandler = async (input) => {
        const oldObj = foodLog.filter(foodCategory => foodCategory.category === itemObject.category)
        const newArray = oldObj[0].items.map(item => item.name === itemObject.name ? {...item, quantity: Number(input)} : item);
        const newObj = foodLog.map(foodCategory => foodCategory.category === itemObject.category ? {...foodCategory, items: newArray} : foodCategory);

        updateNutritionInfo(input);

        const response = await fetch('https://still-hollows-61456.herokuapp.com/food-log', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                foodLog: newObj,
            })
        })
        const data = await response.json();
        setFoodLog(data);
    }

    const updateNutritionInfo = async (input) => {
        const prevQuant = prevQuantities.find(prev => prev.name === itemObject.name);
        let newObj = {
            'Total Calories': (Number(input)*itemObject.calories) + Math.abs(logValues[0]['Total Calories'] - (prevQuant.quantity*itemObject.calories)),
            'Protein': (Number(input)*itemObject.protein) + Math.abs(logValues[0]['Protein'] - (prevQuant.quantity*itemObject.protein)),
            'Carbohydrates': (Number(input)*itemObject.carbs) + Math.abs(logValues[0]['Carbohydrates'] - (prevQuant.quantity*itemObject.carbs)),
            'Fat': (Number(input)*itemObject.fat) + Math.abs(logValues[0]['Fat'] - (prevQuant.quantity*itemObject.fat)),
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

        const updatedQuants = prevQuantities.map(prev => prev.name === itemObject.name ? {...prev, quantity: Number(input)} : prev);
        
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
        
    
    return (
    <>
    {quantityModal && (
        <div className='log-quantity-modal-container'>
            <div className='log-quantity-modal-overlay' onClick={toggleQuantityModal}></div>
            <div className='log-quantity-modal-content popup'>
                <div className='log-quantity-values-container'>
                    <div className='log-quantity-container'>
                        <span>{itemObject.name}</span>
                        <input type='text' defaultValue={itemObject.quantity} onChange={onChangeHandler}/>
                    </div>
                    <button onClick={() => onClickHandler(input)}>Set Quantity</button>
                </div>
            </div>
        </div>
    )}
    </>
    )
}

export default LogQuantityModal;