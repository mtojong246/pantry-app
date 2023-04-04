import './title.styles.scss';
//import Taco from '../../Icons/taco.svg';
//import Salad from '../../Icons/salad.svg';
//import Pancakes from '../../Icons/pancake.svg';
//import Enchiladas from '../../Icons/enchilada.svg';
//import AcaiBowl from '../../Icons/acai bowl.svg';
//import Burger from '../../Icons/burger.svg';
//import Croissant from '../../Icons/croissant.svg';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrumstickBite } from '@fortawesome/free-solid-svg-icons';

const Title = () => {

    useEffect(() => {
        const fetchDatabase = async () => {
            const response = await fetch('http://localhost:3080/');
            const data = await response.json();
            console.log(data);
        }
        fetchDatabase();
    }, [])

    return (
        <div className='title-page'>
            <div className='space'></div>
            <div className='title-box'>
                <span className='title animate__animated animate__fadeInLeft'>Pantry.<FontAwesomeIcon icon={faDrumstickBite} className='drumstick animate__animated animate__tada'/></span>
                <Link to='/login'>
                    <button className='get-started'>Get started</button>
                </Link>
            </div>
            <span className='title-desc animate__animated animate__fadeInUp'>Discover new recipes straight from your pantry.</span>
        </div>
    )
}

export default Title;