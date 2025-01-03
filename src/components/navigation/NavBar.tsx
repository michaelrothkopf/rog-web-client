import { useAuthStore } from '../../hooks/authStore';
import { CurrentPage, useNavigationStore } from '../../hooks/navigationStore';
import './NavBar.css';
import NavLink from './NavLink';

function NavBar() {
  const navigate = useNavigationStore((state) => state.navigate);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className='nav-bar'>
      <span className='site-title'>ROG</span>
      <NavLink
        pageName='Home'
        action={() => {
          navigate(CurrentPage.HOME);
        }}
      />
      <div className="nav-bar-separator"></div>
      <NavLink
        pageName='Log Out'
        action={() => {
          logout();
        }}
      />
    </div>
  );
}

export default NavBar;
