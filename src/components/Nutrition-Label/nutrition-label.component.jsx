import './nutrition-label.styles.scss';
import { useContext} from 'react';
import { NutritionContext } from '../../contexts/nutrition-context';

const NutritionLabel = ({recipe}) => {
    const { servings } = useContext(NutritionContext);

    return (
        <div className='nutrition-label-container'>
            <div className='nutrition-label-title-container'>
                <span style={{display: 'block'}}>Nutrition Facts</span>
                <p>Serving Size: {recipe.recipe.yield}</p>
                <p>Calories: {Math.floor(recipe.recipe.calories)*Number(servings)}</p>
            </div>
            <hr className='first-line'/>
            <p className='daily-value'>% Daily Value *</p>
            <hr className='one-pixel second-line' />
            <div className='nutrition-label-quantities-container'>
                <div className='nutrition-label-quantities space'>
                    <span>Total Fat: {Math.floor(recipe.recipe.totalNutrients.FAT.quantity)*Number(servings)}g</span>
                    <span>{Math.floor(recipe.recipe.totalDaily.FAT.quantity)*Number(servings)}%</span>
                </div>
                <hr />
                <div className='nutrition-label-quantities'>
                    <span>Saturated Fat: {Math.floor(recipe.recipe.totalNutrients.FASAT.quantity)*Number(servings)}g</span>
                    <span>{Math.floor(recipe.recipe.totalDaily.FASAT.quantity)*Number(servings)}%</span>
                </div>
                <hr className='one-pixel'/>
                <div className='nutrition-label-quantities'>
                    <span>Cholesterol: {Math.floor(recipe.recipe.totalNutrients.CHOLE.quantity)*Number(servings)}g</span>
                    <span>{Math.floor(recipe.recipe.totalDaily.CHOLE.quantity)*Number(servings)}%</span>
                </div>
                <hr />
                <div className='nutrition-label-quantities'>
                    <span>Total Carbohydrate: {Math.floor(recipe.recipe.totalNutrients.CHOCDF.quantity)*Number(servings)}g</span>
                    <span>{Math.floor(recipe.recipe.totalDaily.CHOCDF.quantity)*Number(servings)}%</span>
                </div>
                <hr />
                <div className='nutrition-label-quantities'>
                    <span>Dietary Fiber: {Math.floor(recipe.recipe.totalNutrients.FIBTG.quantity)*Number(servings)}g</span>
                    <span>{Math.floor(recipe.recipe.totalDaily.FIBTG.quantity)*Number(servings)}%</span>
                </div>
                <hr />
                <div className='nutrition-label-quantities'>
                    <span>Protein: {Math.floor(recipe.recipe.totalNutrients.PROCNT.quantity)*Number(servings)}g</span>
                    <span></span>
                </div>
                <hr className='one-pixel'/>
                <div className='nutrition-label-quantities'>
                    <span>Vitamin C: {Math.floor(recipe.recipe.totalNutrients.VITC.quantity)*Number(servings)}g</span>
                    <span>{Math.floor(recipe.recipe.totalDaily.VITC.quantity)*Number(servings)}%</span>
                </div>
                <hr />
                <div className='nutrition-label-quantities'>
                    <span>Calcium: {Math.floor(recipe.recipe.totalNutrients.CA.quantity)*Number(servings)}g</span>
                    <span>{Math.floor(recipe.recipe.totalDaily.CA.quantity)*Number(servings)}%</span>
                </div>
                <hr />
                <div className='nutrition-label-quantities'>
                    <span>Iron: {Math.floor(recipe.recipe.totalNutrients.FE.quantity)*Number(servings)}g</span>
                    <span>{Math.floor(recipe.recipe.totalDaily.FE.quantity)*Number(servings)}%</span>
                </div>
                <hr className='one-pixel'/>
                <div className='nutrition-label-quantities'>
                    <span>Potassium: {Math.floor(recipe.recipe.totalNutrients.K.quantity)*Number(servings)}g</span>
                    <span>{Math.floor(recipe.recipe.totalNutrients.K.quantity)*Number(servings)}%</span>
                </div>
                <hr />
            </div>
            <p style={{color: '#828282', fontSize: '1.5vh'}}>* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.</p>
            <p style={{color: '#828282', fontSize: '1.5vh'}}>** Nutrient information is not available for all ingredients. Amount is based on available nutrient data.</p>
            <p style={{color: '#828282', fontSize: '1.5vh'}}>(-) Information is not currently available for this nutrient. If you are following a medically restrictive diet, please consult your doctor or registered dietitian before preparing this recipe for personal consumption.</p>
        </div>
    )
}

export default NutritionLabel;