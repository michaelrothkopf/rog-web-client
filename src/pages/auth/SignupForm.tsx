import React from 'react';
import { doSignup } from '../../core/auth';
import { useAuthStore } from '../../hooks/authStore';

function SignupForm() {
  const authenticate = useAuthStore((state) => state.authenticate);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    // Don't reload
    e.preventDefault();

    // Get the indiviudal fields
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');

    // Type check the username and password
    if (
      typeof email !== 'string' ||
      typeof username !== 'string' ||
      typeof password !== 'string'
    ) {
      return alert(
        'Client software error: invalid types on username and password from form data, must be string.'
      );
    }

    // Try to log in to the server
    const authResult = await doSignup(username, password, email);

    // If the authentication failed
    if (!authResult) {
      return alert(
        `Incorrect username or password, or account doesn't exist. If you don't have an account, sign up instead.`
      );
    }

    // Authentication successful
    authenticate(authResult);
  };

  return (
    <form method='post' onSubmit={handleSignup} className='login-form'>
      <input type='email' name='email' id='email' placeholder='Email' />
      <input type='text' name='username' id='username' placeholder='Username' />
      <input
        type='password'
        name='password'
        id='password'
        placeholder='Password'
      />
      <button type='submit'>Sign Up</button>
    </form>
  );
}

export default SignupForm;
