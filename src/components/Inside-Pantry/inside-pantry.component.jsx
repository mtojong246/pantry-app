import './inside-pantry.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { PantryContext } from '../../contexts/pantry-context';
import { UserContext } from '../../contexts/user-context';
import Spinner from '../Spinner/spinner.component';

const InsidePantry = () => {
    const { pantryItems, removeItemFromPantry } = useContext(PantryContext);
    const { isLoading } = useContext(UserContext)

    return (
        <>
        {isLoading ? (
            <Spinner />
        ) : (
            <div className='inside-pantry-container'>
                {pantryItems.map(item => (
                    <div className='pantry-items'>
                        <span>{item}</span>
                        <FontAwesomeIcon icon={faCircleXmark} className='delete-pantry-item' onClick={() => removeItemFromPantry(item)}/>
                    </div>
                ))}
            </div>
        )}
        </>
    )
}

export default InsidePantry;