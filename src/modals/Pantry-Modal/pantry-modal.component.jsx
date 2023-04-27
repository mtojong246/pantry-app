import './pantry-model.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState, useContext } from 'react';
import { PantryContext } from '../../contexts/pantry-context';

const PantryModal = ({pantryModal, togglePantryModal}) => {
    const { addItemToPantry } = useContext(PantryContext)
    const [searchPantry, setSearchPantry] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    

    const onSearchPantry = (event) => {
        const newSearch = event.target.value.toLowerCase();
        setSearchPantry(newSearch);
    }

    const onSearchEnter = async (searchPantryItem) => {
        const response = await fetch(`https://api.edamam.com/auto-complete?app_id=a2f5c533&app_key=aea75c33426935311aa46ffbf39282a7&q=${searchPantryItem}`);
        const data = await response.json();
        setSearchResults(data);
    }

    const onKeyPressHandler = (event) => {
        if (event.key === 'Enter') {
            onSearchEnter(searchPantry)
        }
    }


    const exitPantryModal = () => {
        togglePantryModal();
        setSearchPantry('');
        setSearchResults([]);
    }

    const onClickHandler = (event) => {
        let button = event.target;
        button.style.backgroundColor = '#90F1B7';
        button.style.borderColor = '#90F1B7';
        button.textContent = button.value;
    }

 
    return (
        <>
        {pantryModal && (
            <div className='pantry-modal-container'>
                <div className='pantry-modal-overlay' onClick={exitPantryModal}></div>
                <div className='pantry-modal-content popup'>
                    <div className='pantry-search-container'>
                        <div className='pantry-search-title'>
                            <span>Pantry Lookup</span>
                            <FontAwesomeIcon icon={faXmark} onClick={exitPantryModal} className='exit-pantry' />        
                        </div>
                        <div className='pantry-search-bar'>
                            <input type='text' placeholder='Search' onChange={onSearchPantry} onKeyDown={onKeyPressHandler}/>
                            <button onClick={() => onSearchEnter(searchPantry)}><FontAwesomeIcon icon={faMagnifyingGlass} className='pantry-search-button'/></button>
                        </div>
                        <div className='pantry-search-results-container'>
                            <div className='pantry-search-results-box'>
                                {searchResults.map(result => (
                                    <div className='pantry-search-results'>
                                        <span>{result}</span>
                                        <button onClick={(event) => {addItemToPantry(result); onClickHandler(event)}} className='add-item-to-pantry' value='✓'>Add</button>
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

export default PantryModal;