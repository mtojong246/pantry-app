import './food-log.styles.scss';
import FoodLogList from '../../components/Food-Log-List/food-log-list.component';
import NutritionDetails from '../../components/Nutrition-Details/nutrition-details.component';
import NutritionModal from '../../modals/Nutrition-Modal/nutrition-modal.component';
import { useState } from 'react';


const FoodLog = () => {
    const [nutritionModal, setNutritionModal] = useState(false);

    const toggleNutritionModal = () => setNutritionModal(!nutritionModal)

    return (
        <>
            <div className='food-log-container'>
                <div className='food-log'>
                    <span className='food-log-title'>Food Log</span>
                    <FoodLogList />
                </div>
                <div className='nutrition-details'>
                    <div className='edit-nutrition-details'>
                        <span className='nutrition-details-title'>Nutrition</span>
                        <button onClick = {toggleNutritionModal}>Edit</button>
                    </div>
                    <NutritionDetails />
                </div> 
            </div>
            <NutritionModal nutritionModal={nutritionModal} toggleNutritionModal={toggleNutritionModal}/>
        </>
    )
}

export default FoodLog;