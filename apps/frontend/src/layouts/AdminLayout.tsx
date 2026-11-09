import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAdminMe, useLogout } from "../features/admin/api";
import { RequireAdmin } from "../features/admin/RequireAdmin";
import styles from "./AdminLayout.module.css";

function AdminBar() {
  const me = useAdminMe();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <header className={styles.bar}>
      <div className={`container ${styles.inner}`}>
        <Link to="/admin" className={styles.brand}>
          ASSETizers <span>Kitchen</span>
        </Link>
        <nav className={styles.nav} aria-label="Admin">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? styles.active : "")}>
            Menu
          </NavLink>
          <a href="/" target="_blank" rel="noreferrer">
            View site
          </a>
        </nav>
        <div className={styles.user}>
          {me.data && <span className={styles.email}>{me.data.admin.email}</span>}
          <Button
            variant="outline"
            size="sm"
            accent="var(--color-offwhite)"
            className={styles.logout}
            onClick={() => {
              logout();
              navigate("/admin/login", { replace: true });
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}

export function AdminLayout() {
  return (
    <RequireAdmin>
      <div className={styles.shell}>
        <AdminBar />
        <main className={`container ${styles.main}`}>
          <Outlet />
        </main>
      </div>
    </RequireAdmin>
  );
}
