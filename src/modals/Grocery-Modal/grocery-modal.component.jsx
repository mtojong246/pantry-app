import './grocery-modal.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useContext } from 'react';
import { GroceryContext } from '../../contexts/grocery-context';

const GroceryModal = ({groceryModal, toggleGroceryModal}) => {
    const { addItemToGroceries } = useContext(GroceryContext)
    const [searchGroceries, setSearchGroceries] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const onSearchGroceries = (event) => {
        const newSearch = event.target.value.toLowerCase();
        setSearchGroceries(newSearch);
    }

    const onSearchEnter = async (searchGroceryItem) => {
        const response = await fetch(`https://api.edamam.com/auto-complete?app_id=a2f5c533&app_key=aea75c33426935311aa46ffbf39282a7&q=${searchGroceryItem}`);
        const data = await response.json();
        setSearchResults(data);
    }


    const exitGroceryModal = () => {
        toggleGroceryModal();
        setSearchGroceries('');
        setSearchResults([]);
    }
    return (
        <>
        {groceryModal && (
            <div className='grocery-modal-container'>
                <div className='grocery-modal-overlay' onClick={exitGroceryModal}></div>
                <div className='grocery-modal-content popup'>
                    <div className='grocery-search-container'>
                        <div className='grocery-search-title'>
                            <span>Grocery Lookup</span>
                            <FontAwesomeIcon icon={faXmark} onClick={exitGroceryModal} className='exit-grocery' />        
                        </div>
                        <div className='grocery-search-bar'>
                            <input type='text' placeholder='Search' onChange={onSearchGroceries}/>
                            <button onClick={() => onSearchEnter(searchGroceries)}><FontAwesomeIcon icon={faMagnifyingGlass} className='grocery-search-button'/></button>
                        </div>
                        <div className='grocery-search-results-container'>
                            <div className='grocery-search-results-box'>
                                {searchResults.map(result => (
                                    <div className='grocery-search-results'>
                                        <span>{result}</span>
                                        <button className='add-item-to-grocery' onClick={() => addItemToGroceries(result)} value='✓'>Add</button>
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

export default GroceryModal;