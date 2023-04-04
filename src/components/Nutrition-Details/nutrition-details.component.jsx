import './nutrition-details.styles.scss';
import { useContext } from 'react';
import { NutritionContext } from '../../contexts/nutrition-context';
import { UserContext } from '../../contexts/user-context';
import Spinner from '../Spinner/spinner.component';

const NutritionDetails = () => {
    const macros = [['Total Calories', 'kcal'], ['Protein', 'g'], ['Carbohydrates', 'g'], ['Fat', 'g']]
    const { nutritionValues, logValues } = useContext(NutritionContext);
    const { isLoading } = useContext(UserContext)    

    return (
        <>
        {isLoading ? (
            <Spinner />
        ) : (
            <div className='nutrition-details-container'>
                {macros.map(category => (
                    <div className='nutrition-details-categories'>
                        <label>{category[0]}</label>
                        <div className='nutrition-level'>
                            <div className='fill-level' style={{width: `${Math.floor(eval((logValues[0][category[0]])*100/nutritionValues[0][category[0]]))}%`}}/>
                        </div>
                        <div className='nutrition-quantities'>
                            <span>{logValues[0][category[0]]}</span><span>{category[1]}</span><span>/{nutritionValues[0][category[0]]}</span><span>{category[1]}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
        </>
    )
}

export default NutritionDetails;