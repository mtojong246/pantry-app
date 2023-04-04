import './reset-modal.styles.scss';
import { useContext } from 'react';
import { NutritionContext } from '../../contexts/nutrition-context';

const ResetModal = ({resetModal, toggleResetModal, toggleNutritionModal }) => {
    const { resetValues } = useContext(NutritionContext);

    const onClickHandler = () => {
        toggleResetModal();
        toggleNutritionModal();
        resetValues();
    }

    return (
        <>
        {resetModal && (
            <div className='reset-modal-container'>
                <div className='reset-modal-overlay' onClick={toggleResetModal}></div>
                <div className='reset-modal-content popup'>
                    <div className='reset-options-container'>
                        <div className='reset-options-title'>
                            <span>Are you sure?</span>
                        </div>
                        <div className='reset-options-buttons'>
                            <button className='reset-yes' onClick={onClickHandler}>Yes</button>
                            <button className='reset-no' onClick={toggleResetModal}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default ResetModal;