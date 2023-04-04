import './micronutrients.styles.scss';
import { useContext } from 'react';
import { NutritionContext } from '../../contexts/nutrition-context';

const Micronutrients = ({nutritionValues}) => {
    const micros = [['Saturated Fat', 'g'], ['Polyunsaturated Fat', 'g'], ['Monosaturated Fat'], ['Trans Fat', 'g'], ['Cholesterol', 'mg'], ['Sodium', 'mg'], ['Potassium', 'mg'], ['Vitamin A', '%'], ['Vitamin C', '%'], ['Calcium', '%'], ['Iron', '%']]
    const { logValues } = useContext(NutritionContext);
    
    return (
        <div className='micronutrients-container'>            
            {micros.map(category => (
                <div className='micronutrients'>
                    <label>{category[0]}</label>
                    <div className='micronutrient-levels'>
                        <div className='micro-fill-level' style={{width: `${Math.floor(eval((logValues[category[0]])*100/nutritionValues[category[0]]))}%`}}/>
                    </div>
                    <div className='micronutrient-quantities'>
                        <span>0</span><span>{category[1]}</span><span>/{nutritionValues[category[0]]}</span><span>{category[1]}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Micronutrients;