import './login.styles.scss';
import { useNavigate } from 'react-router';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/user-context';

const Login = () => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
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

    const onClickHandler = async () => {
        const response = await fetch('https://still-hollows-61456.herokuapp.com/login', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        const user = await response.json();
        if (typeof user === 'object') {
            setUser(user);
            home();
            localStorage.setItem('user', JSON.stringify(user.email));
        } else {
            alert('Wrong email or password');
        }
    }

    const onKeyPressHandler = (event) => {
        if (event.key === "Enter") {
            onClickHandler();
        } 

        return;
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className='login-title-container'>
                    <span className='login-title'>Login</span>
                </div>
                <form className='login-form'>
                    <label>Email address</label><input type='text' onChange={onEmailChange} onKeyDown={onKeyPressHandler}/>
                    <label>Password</label><input type='password' onChange={onPasswordChange} onKeyDown={onKeyPressHandler}/>
                </form>
                <div className='login-info'>
                    <span className='login-block'><span>Don't have an account?</span><Link to='/register'><span className='signup-link'>Sign up!</span></Link></span>
                </div>
                <div className='login-button-container'>
                    <button onClick={() => onClickHandler()}>Sign in</button>
                </div>
            </div>
        </div>
    )
}

export default Login;
