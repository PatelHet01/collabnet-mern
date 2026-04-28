import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavItems = () => {
    if (user.role === 'admin') {
      return (
        <>
          <div className="nav-item active"><i className="ri-dashboard-line"></i> Overview</div>
          <div className="nav-item"><i className="ri-group-line"></i> Users</div>
          <div className="nav-item"><i className="ri-funds-line"></i> Financials</div>
        </>
      );
    } else if (user.role === 'brand') {
      return (
        <>
          <div className="nav-item active"><i className="ri-dashboard-line"></i> Overview</div>
          <div className="nav-item"><i className="ri-megaphone-line"></i> Campaigns</div>
          <div className="nav-item"><i className="ri-search-eye-line"></i> Discover</div>
        </>
      );
    } else if (user.role === 'creator') {
      return (
        <>
          <div className="nav-item active"><i className="ri-dashboard-line"></i> Overview</div>
          <div className="nav-item"><i className="ri-briefcase-line"></i> My Collabs</div>
          <div className="nav-item"><i className="ri-bank-card-line"></i> Earnings</div>
        </>
      );
    } else if (user.role === 'agency') {
        return (
          <>
            <div className="nav-item active"><i className="ri-dashboard-line"></i> Overview</div>
            <div className="nav-item"><i className="ri-team-line"></i> Roster</div>
            <div className="nav-item"><i className="ri-building-4-line"></i> Clients</div>
          </>
        );
      }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">CollabNet.</div>
        <nav className="nav-menu">
          {renderNavItems()}
        </nav>
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{fontWeight: 600, fontSize: '0.9rem'}}>{user.name}</div>
            <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{user.role}</div>
          </div>
          <button className="btn btn-outline" style={{padding: '0.4rem'}} onClick={handleLogout}>
            <i className="ri-logout-box-r-line"></i>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
