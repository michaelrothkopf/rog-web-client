import { useState } from 'react';
import LoginForm from './LoginForm';
import './AuthPage.css';
import SignupForm from './SignupForm';

enum AuthMode {
  LOGIN,
  SIGNUP,
}

function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);

  if (authMode === AuthMode.LOGIN) {
    return (
      <div className='auth-page'>
        <h1>Log In</h1>
        <h3>You must be signed in to continue.</h3>
        <LoginForm />
        <h3
          onClick={() => {
            setAuthMode(AuthMode.SIGNUP);
          }}
          className='change-method'
        >
          I don't have an account
        </h3>
      </div>
    );
  }

  if (authMode === AuthMode.SIGNUP) {
    return (
      <div className='auth-page'>
        <h1>Sign Up</h1>
        <h3>You must be signed in to continue.</h3>
        <SignupForm />
        <h3
          onClick={() => {
            setAuthMode(AuthMode.LOGIN);
          }}
          className='change-method'
        >
          I already have an account
        </h3>
      </div>
    );
  }
}

export default AuthPage;
