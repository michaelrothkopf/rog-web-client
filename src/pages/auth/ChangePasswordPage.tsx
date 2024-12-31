import React from 'react';
import { doChangePassword } from '../../core/auth';
import { CurrentPage, useNavigationStore } from '../../hooks/navigationStore';

function ChangePasswordPage() {
  const navigate = useNavigationStore((state) => state.navigate);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    // Don't reload
    e.preventDefault();

    // Get the indiviudal fields
    const form = e.currentTarget;
    const formData = new FormData(form);
    const oldPassword = formData.get('oldPassword');
    const newPassword = formData.get('newPassword');

    // Type check the fields
    if (
      typeof oldPassword !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return alert(
        'Client software error: invalid types on username and password from form data, must be string.'
      );
    }

    // Try to change the password
    const changePasswordResult = await doChangePassword(oldPassword, newPassword);

    // If the request failed
    if (!changePasswordResult) {
      return alert(
        `Couldn't change password.`
      );
    }

    // Otherwise, redirect back to the home screen
    alert('Successfully changed password.');
    navigate(CurrentPage.HOME);
  };

  return (
    <div className='auth-page'>
      <h1>Change Password</h1>
      <form method='post' onSubmit={handleChangePassword} className='login-form'>
        <input
          type='password'
          name='oldPassword'
          id='oldPassword'
          placeholder='Old password'
        />
        <input
          type='password'
          name='newPassword'
          id='newPassword'
          placeholder='New password'
        />
        <button type='submit'>Change Password</button>
      </form>
    </div>
  );
}

export default ChangePasswordPage;
