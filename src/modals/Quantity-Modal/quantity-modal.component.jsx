import './quantity.modal.styles.scss';
import { useContext, useState } from 'react';
import { GroceryContext } from '../../contexts/grocery-context';
import { UserContext } from '../../contexts/user-context';

const QuantityModal = ({ quantityModal, toggleQuantityModal, itemObject }) => {
    const [ input, setInput ] = useState('');
    const { groceryItems, setGroceryItems } = useContext(GroceryContext);
    const { user } = useContext(UserContext)

    const onChangeHandler = (event) => {
        let newInput = event.target.value;
        setInput(newInput);
    }

    const onClickHandler= async (input) => {
        const updatedItems = groceryItems.map(item => item.name === itemObject.name ? {...item, quantity: Number(input)} : item)
        const response = await fetch('https://still-hollows-61456.herokuapp.com/grocery-list', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                groceryItems: updatedItems,
            })
        })
        const data = await response.json();
        setGroceryItems(data);
        toggleQuantityModal();
    }


 
    return (
        <>
        {quantityModal && (
            <div className='quantity-modal-container'>
                <div className='quantity-modal-overlay' onClick={toggleQuantityModal}></div>
                <div className='quantity-modal-content popup'>
                    <div className='quantity-values-container'>
                        <div className='quantity-container'>
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

export default QuantityModal;