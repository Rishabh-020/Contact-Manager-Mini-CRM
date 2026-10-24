import { NavLink, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>{' | '}
        <NavLink to="/contacts">Contacts</NavLink>{' | '}
        <NavLink to="/lists">Lists</NavLink>{' | '}
        <NavLink to="/follow-ups">Follow-ups</NavLink>{' | '}
        <NavLink to="/import">Import</NavLink>{' | '}
        <NavLink to="/deleted">Deleted</NavLink>{' | '}
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
