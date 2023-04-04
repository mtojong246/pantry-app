import './inside-grocery-list.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { useState, useContext } from 'react';
import { GroceryContext } from '../../contexts/grocery-context';
import QuantityModal from '../../modals/Quantity-Modal/quantity-modal.component';
import { UserContext } from '../../contexts/user-context';
import Spinner from '../Spinner/spinner.component';

const InsideGroceryList = () => {
    const { groceryItems, removeItemFromGroceries, activeList, setActiveList } = useContext(GroceryContext);
    const [ itemObject, setItemObject ] = useState({});
    const [ quantityModal, setQuantityModal ] = useState(false);
    const { user, isLoading } = useContext(UserContext)

    const toggleQuantityModal = () => setQuantityModal(!quantityModal);

    const onClickHandler = async (item) => {
        let list = [];
        if(activeList.includes(item)) {
            list = activeList.filter(activeItem => activeItem !== item);
        } else {
            list = activeList.concat([item]);
        }
        const response = await fetch('http://localhost:3080/active-list', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                activeList: list,
            })
        })
        const data = await response.json();
        setActiveList(data);
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
            <div className='inside-grocery-list-container'>
                {groceryItems.map(item => (
                <>
                    <div className='grocery-item-container'>
                        <span><span onClick={() => onClickHandler(item.name)}>{activeList.includes(item.name) ? (<FontAwesomeIcon icon={faSquareCheck} className='checkbox'/>) : (<FontAwesomeIcon icon={faSquare} className='checkbox' />)}</span>{item.name} <button value={JSON.stringify(item)} onClick={changeQuantity} className='quantity-button'>({item.quantity})</button></span>
                        <span><FontAwesomeIcon icon={faXmark} className='delete-grocery-item' onClick={() => removeItemFromGroceries(item.name)}/></span>
                    </div>
                </>
                ))}
                <QuantityModal quantityModal={quantityModal} toggleQuantityModal={toggleQuantityModal} itemObject={itemObject}/>
            </div>
        )}
        </>
    )
}

export default InsideGroceryList;