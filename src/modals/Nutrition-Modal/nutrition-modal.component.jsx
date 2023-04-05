import './nutrition-modal.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { NutritionContext } from '../../contexts/nutrition-context';
import ResetModal from '../Reset-Modal/reset-modal.component';
import { UserContext } from '../../contexts/user-context';

const NutritionModal = ({ nutritionModal, toggleNutritionModal }) => {
    const nutritionQuantities = [['Total Calories', 'kcal'], ['Protein', 'g'], ['Carbohydrates', 'g'], ['Fat', 'g']];
    const { nutritionValues, setNutritionValues } = useContext(NutritionContext);
    const [ resetModal, setResetModal ] = useState(false);
    const { user, isLoading } = useContext(UserContext)

    const toggleResetModal = () => setResetModal(!resetModal);

    const onSubmitHandler = async (event) => {
        const newFormData = new FormData(event.target);
        
        const formDataObj = {};
        newFormData.forEach((value, key) => (formDataObj[key] = value));
        const response = await fetch('https://still-hollows-61456.herokuapp.com/nutrition-values', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                nutritionValues: [formDataObj],
            })
        })
        const data = await response.json();
        setNutritionValues(data);
    }




    return (
        <>
        {nutritionModal && (
            <div className='nutrition-modal-container'>
            {isLoading ? (
                <h1>Loading...</h1>
            ) : (
                <>
                    <div className='nutrition-modal-overlay' onClick={toggleNutritionModal}></div>
                    <div className='nutrition-modal-content popup'>
                        <div className='nutrition-values-container'>
                            <div className='nutrition-values-title'>
                                <span>Set Nutrition Goals</span>
                                <FontAwesomeIcon icon={faXmark} className='exit-nutrition-modal' onClick={toggleNutritionModal}  />
                            </div>
                            <form onSubmit={onSubmitHandler}>
                                <div className='nutrition-values'>
                                    {nutritionQuantities.map(value => (
                                        <div className='individual-values'>
                                            <span>{value[0]}</span>
                                            <span><input type='text' name={value[0]} defaultValue={nutritionValues[0][value[0]]}/><span>{value[1]}</span></span>
                                        </div>
                                    ))}
                                    <button type='button' onClick={() => toggleResetModal()}>Reset</button>
                                </div>
                                <div className='nutrition-values-set'>
                                    <button>Set Values</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ResetModal resetModal={resetModal} toggleResetModal={toggleResetModal} toggleNutritionModal={toggleNutritionModal} />
                </>
            )}
            </div>
        )}
        </>
    )
}

export default NutritionModal;