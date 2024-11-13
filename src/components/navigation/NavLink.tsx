import './NavLink.css';

interface NavLinkProps {
  pageName: string;
  action(): void;
}

function NavLink(props: NavLinkProps) {
  return (
    <span className='nav-button' onClick={props.action}>
      {props.pageName}
    </span>
  );
}

export default NavLink;
