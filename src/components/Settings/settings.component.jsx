import './settings.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import BurntTheme from '../../themes/burntTheme.png';
import HulkTheme from '../../themes/hulkTheme.png';
import NeopolitanTheme from '../../themes/neopolitanTheme.png';
import PinkTheme from '../../themes/pinkTheme.png';
import YellowTheme from '../../themes/yellowTheme.png';
import OriginalTheme from '../../themes/originalTheme.png';
import { useNavigate } from 'react-router';

const Settings = () => {
    const nav = useNavigate();


    const logOut = () => {
        localStorage.removeItem('user');
        nav('/');
    }

    const recipes = () => {
        nav('/profile/recipes')
    }

    const groceryList = () => {
        nav('/profile/grocery-list')
    }

    const foodLog = () => {
        nav('/profile/food-log')
    }

    return (
        <div className='settings-container'>
            <span className='mobile' onClick={recipes}>Recipes</span>
            <span className='mobile' onClick={groceryList}>Grocery List</span>
            <span className='mobile' onClick={foodLog}>Food Log</span>
            <hr />
            <span className='option' onClick={() => logOut()}><FontAwesomeIcon icon={faArrowRightFromBracket} className='log-out'/>Log Out</span>
        </div>
    )
}

export default Settings;