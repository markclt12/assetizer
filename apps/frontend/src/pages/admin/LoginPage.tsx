import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { useLogin } from "../../features/admin/api";
import { FormError, TextField, adminStyles } from "../../features/admin/ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useIsAdminSignedIn } from "../../lib/auth";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  useDocumentTitle("Admin login");
  const signedIn = useIsAdminSignedIn();
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (signedIn && !login.isPending) return <Navigate to={from} replace />;

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Kitchen staff only</h1>
        <p className={styles.subtitle}>Sign in to manage the ASSETizers menu.</p>
        <form
          className={adminStyles.form}
          onSubmit={(event) => {
            event.preventDefault();
            login.mutate({ email, password }, { onSuccess: () => navigate(from, { replace: true }) });
          }}
        >
          <TextField
            label="Email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <FormError error={login.error} />
          <Button type="submit" size="lg" disabled={login.isPending}>
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
