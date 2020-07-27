import React from 'react';
import MyButton from '../utils/button';
import Login from './login'
const RegisterLogin = () => {
    return (
        <div className="page_wrapper">
            <div className="container">
                <div className="register_login_container">
                    <div className="left">
                        <h1>new customers</h1>
                        <p>
                            some string for description
                        </p>
                        <MyButton
                            type="default"
                            title="Create an account"
                            linkTo="/register"
                            addStyles={{
                                margin: '10px 0 0 0'


                            }}
                        />
                    </div>
                    <div className="right">
                        <h2>Register costumers</h2>
                        <p>if you have an account please log in</p>
                        <Login />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLogin;