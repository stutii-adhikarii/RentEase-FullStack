import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="site">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            ⌂ Rent Ease
          </Link>

          <nav className="nav">
            {user ? (
              <>
                <NavLink to="/apartments">Apartments</NavLink>
                <NavLink to="/favourites">Favourites</NavLink>
                <NavLink to="/inquiries">Inquiries</NavLink>
                {user.role === "landlord" ? (
                  <NavLink to="/my-listings">My Listings</NavLink>
                ) : null}
              </>
            ) : (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/apartments">Apartments</NavLink>
                <NavLink to="/inquiries">Inquiries</NavLink>
              </>
            )}
          </nav>

          <div className="header-actions">
            {user ? (
              <>
                <button type="button" className="link-quiet" onClick={handleLogout}>
                  Logout
                </button>
                <Link to="/profile" className="btn btn-primary">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="link-quiet">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="logo">Rent Ease</span>
          <div className="footer-links">
            <a href="#contact">Contact</a>
            <a href="#about">About</a>
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
          </div>
          <span>© 2024 Rent Ease. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
