import './footer.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
    return (
        <div className='footer-container'>
            <div className='media-container'>
                <span><hr /></span>
                <FontAwesomeIcon className='brand' icon={faFacebook} />
                <FontAwesomeIcon className='brand' icon={faTwitter} />
                <FontAwesomeIcon className='brand' icon={faInstagram} />
                <span><hr /></span>
            </div>
        </div>
    )
}

export default Footer;