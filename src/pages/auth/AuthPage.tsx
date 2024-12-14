import { useState } from 'react';
import LoginForm from './LoginForm';
import './AuthPage.css';
import SignupForm from './SignupForm';

function AuthPage() {
  const [login, setLogin] = useState<boolean>(true);

  return (
    <div className='auth-page'>
      <h1>{login ? `Log In` : `Sign Up`}</h1>
      <h3>You must be signed in to continue.</h3>
      {login ? <LoginForm /> : <SignupForm />}
      <h3
        onClick={() => {
          setLogin(!login);
        }}
        className='change-method'
      >
        {login ? `I don't have an account` : `I already have an account`}
      </h3>
    </div>
  );
}

export default AuthPage;
