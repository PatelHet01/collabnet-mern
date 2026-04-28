import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (user.role === 'admin') {
    return (
      <>
        <div className="header">
          <div>
            <h1>Admin Command Center</h1>
            <p className="text-muted">Platform overview</p>
          </div>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card"><div className="kpi-title">Total Users</div><div className="kpi-value">12,450</div></div>
          <div className="kpi-card"><div className="kpi-title">Active Campaigns</div><div className="kpi-value">342</div></div>
        </div>
        <div className="data-section">
          <h3>Recent Users</h3>
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Acme Corp</td><td>Brand</td><td><span className="badge">Active</span></td></tr>
              <tr><td>Sarah Mitchell</td><td>Creator</td><td><span className="badge">Active</span></td></tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (user.role === 'brand') {
    return (
      <>
        <div className="header">
          <div>
            <h1>Brand Campaign HQ</h1>
            <p className="text-muted">Manage your influencer marketing</p>
          </div>
          <button className="btn btn-primary"><i className="ri-add-line"></i> New Campaign</button>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card"><div className="kpi-title">Active Campaigns</div><div className="kpi-value">3</div></div>
          <div className="kpi-card"><div className="kpi-title">Total Spend</div><div className="kpi-value">$45k</div></div>
        </div>
        <div className="data-section">
          <h3>Live Campaigns</h3>
          <table>
            <thead><tr><th>Campaign Name</th><th>Budget</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Winter Collection Launch</td><td>$15,000</td><td><span className="badge" style={{background: 'black', color: 'white'}}>Live</span></td></tr>
              <tr><td>Tech Review Series</td><td>$8,000</td><td><span className="badge">Draft</span></td></tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (user.role === 'creator') {
    return (
      <>
        <div className="header">
          <div>
            <h1>Creator Studio</h1>
            <p className="text-muted">Track your collaborations</p>
          </div>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card"><div className="kpi-title">Active Collabs</div><div className="kpi-value">4</div></div>
          <div className="kpi-card"><div className="kpi-title">Earnings (MTD)</div><div className="kpi-value">$6,200</div></div>
        </div>
        <div className="data-section">
          <h3>My Tasks</h3>
          <table>
            <thead><tr><th>Brand</th><th>Campaign</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Acme Corp</td><td>Winter Launch</td><td><span className="badge" style={{background: 'black', color: 'white'}}>In Progress</span></td></tr>
              <tr><td>FreshFit</td><td>Apparel Promo</td><td><span className="badge">Pending Brief</span></td></tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (user.role === 'agency') {
    return (
      <>
        <div className="header">
          <div>
            <h1>Agency Hub</h1>
            <p className="text-muted">Manage your roster and clients</p>
          </div>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card"><div className="kpi-title">Managed Creators</div><div className="kpi-value">45</div></div>
          <div className="kpi-card"><div className="kpi-title">Pipeline Value</div><div className="kpi-value">$180k</div></div>
        </div>
        <div className="data-section">
          <h3>Top Talent</h3>
          <table>
            <thead><tr><th>Creator</th><th>Niche</th><th>Current Client</th></tr></thead>
            <tbody>
              <tr><td>Sarah Mitchell</td><td>Tech</td><td>NeoTech</td></tr>
              <tr><td>Marcus J.</td><td>Fitness</td><td>FreshFit</td></tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return <div>Unknown Role</div>;
}
