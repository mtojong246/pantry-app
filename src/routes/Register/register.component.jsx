import './register.styles.scss';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { UserContext } from '../../contexts/user-context';

const Register = () => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const { setUser } = useContext(UserContext);

    const nav = useNavigate();

    const home = () => {
        nav('/profile')
    }

    const onEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail)
    }

    const onPasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
    }

    const onConfirmPasswordChange = (event) => {
        const newPassword = event.target.value;
        setConfirmPassword(newPassword);
    }

    const onClickHandler = async () => {
        const response = await fetch('https://still-hollows-61456.herokuapp.com/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
                confirmPassword: confirmPassword
            })
        })
        const user = await response.json();
        if (typeof user === 'object') {
            setUser(user);
            home();
            localStorage.setItem('user', JSON.stringify(user.email));
        } else {
            alert('passwords do not match');
        }
    }

    const onKeyPressHandler = (event) => {
        if (event.key === "Enter") {
            onClickHandler();
        } 

        return;
    }


    return (
        <div className='register-container'>
            <div className='register-box'>
                <span className='register-title'>Register</span>
                <form className='register-form'>
                    <label>Email address</label><input type='text' onChange={onEmailChange} onKeyDown={onKeyPressHandler}/>
                    <label>Password</label><input type='password' onChange={onPasswordChange}  onKeyDown={onKeyPressHandler}/>
                    <label>Confirm Password</label><input type='password' onChange={onConfirmPasswordChange} onKeyDown={onKeyPressHandler}/>
                </form>
                <div className='register-info'>
                    <span>Already have an account?</span><Link to='/login'><span className='signin-link'>Sign in!</span></Link>  
                </div>  
                <button onClick={() => onClickHandler()}>Sign up</button>
            </div>     
        </div>
    )
}

export default Register;