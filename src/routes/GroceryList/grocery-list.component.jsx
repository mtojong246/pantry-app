import './grocery-list.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import GroceryModal from '../../modals/Grocery-Modal/grocery-modal.component';
import InsideGroceryList from '../../components/Inside-Grocery-List/inside-grocery-list.component';
import { useState, useContext } from 'react';
import { GroceryContext } from '../../contexts/grocery-context';
import { UserContext } from '../../contexts/user-context';
import Spinner from '../../components/Spinner/spinner.component';


const GroceryList = () => {
    const [groceryModal, setGroceryModal] = useState(false);
    
    const { isListActive, clearItemsFromGroceries } = useContext(GroceryContext);
    const { isLoading } = useContext(UserContext);

    const toggleGroceryModal = () => setGroceryModal(!groceryModal);
    

    const style = () => {
        document.querySelector('.carrot').classList.add('style');
        document.querySelector('.message').classList.add('style');
    }

    const unstyle = () => {
        document.querySelector('.carrot').classList.remove('style');
        document.querySelector('.message').classList.remove('style');
    }

    return (
        <>
        {isLoading ? (
            <Spinner />
        ) : (
            <>
                <div className='grocery-list-container'>
                    <div className='outside-grocery-list'>
                        <label>Grocery List</label>
                        <div className='inside-grocery-list'>
                        {isListActive ? (
                            <InsideGroceryList />
                        ) : (
                            <div className='grocery-list'>
                                <FontAwesomeIcon icon={faCarrot} className='carrot' />
                                <span className='message'>Your list is empty</span>
                            </div>
                        )}
                        </div>
                        {isListActive ? (
                            <div className='list-buttons-container'>
                                <button onClick={toggleGroceryModal}>Add more</button>
                                <button onClick={() => clearItemsFromGroceries()}>Clear List</button>
                            </div>
                        ):(
                            <button onMouseEnter={style} onMouseLeave={unstyle} onClick={toggleGroceryModal} className='grocery-add-button'>Add</button>
                        )}
                        
                    </div>
                </div>
                <GroceryModal groceryModal={groceryModal} toggleGroceryModal={toggleGroceryModal}/>
            </>
            )} 
        </>
    )
}

export default GroceryList;