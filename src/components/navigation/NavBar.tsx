import { CurrentPage, useNavigationStore } from '../../hooks/navigationStore';
import './NavBar.css';
import NavLink from './NavLink';

function NavBar() {
  const navigate = useNavigationStore((state) => state.navigate);

  return (
    <div className='nav-bar'>
      <span className='site-title'>ROG</span>
      <NavLink
        pageName='Home'
        action={() => {
          navigate(CurrentPage.HOME);
        }}
      />
    </div>
  );
}

export default NavBar;
