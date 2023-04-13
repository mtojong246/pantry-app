import './navigation.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faBars } from '@fortawesome/free-solid-svg-icons';
import { Outlet } from 'react-router';
import Settings from '../../components/Settings/settings.component';
import Footer from '../../components/Footer/footer.component';
import { useNavigate } from 'react-router';
import { useState } from 'react';


const Navigation = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    

    const navigate = useNavigate();

    const home = () => {
        navigate('/profile')
    }
    
    const recipes = () => {
        navigate('/profile/recipes')
    }

    const groceryList = () => {
        navigate('/profile/grocery-list')
    }

    const foodLog = () => {
        navigate('/profile/food-log')
    }

    return (
        <div className='page-container'>
            <div className='nav-bar-container'>
                <span className='logo' onClick={home}>Pantry.</span>
                <div className='nav-bar'>
                    <span onClick={recipes}>Recipes</span>
                    <span onClick={groceryList}>Grocery List</span>
                    <span onClick={foodLog}>Food Log</span>
                </div>
                <FontAwesomeIcon icon={faGear} className='gear' onClick={toggleDropdown}/>
                <FontAwesomeIcon icon={faBars} className='bars' onClick={toggleDropdown}/>
            </div>
            <div className={`settings animate__animated ${isDropdownOpen ? "animate__slideInRight" : "animate__slideOutRight"}`}>
                <Settings />
            </div>
            <Outlet />
            <Footer />
        </div>
    )
}

export default Navigation;
