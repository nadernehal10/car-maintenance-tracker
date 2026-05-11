// auth.jsx — Local account system. Uses localStorage so accounts persist
// across reloads. Each account has its own isolated garage data, keyed by
// email under `garage.data.<email>`.

const AUTH_USERS_KEY = 'garage.users';

// ── localStorage helpers ──────────────────────────────────────────────
function loadUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY)) || {}; }
  catch { return {}; }
}
function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

// Per-user data load/save. New users get a fresh deep-copy of the demo
// CAR_DATA so each account starts in a sensible state but is then
// independent from every other account.
function loadUserData(email) {
  try {
    const raw = localStorage.getItem('garage.data.' + email);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Seed a new account with a clone of the demo data.
  const seed = JSON.parse(JSON.stringify(window.CAR_DATA));
  localStorage.setItem('garage.data.' + email, JSON.stringify(seed));
  return seed;
}
function saveUserData(email, data) {
  localStorage.setItem('garage.data.' + email, JSON.stringify(data));
}

// ── useAuth ─────────────────────────────────────────────────────────
// Each frame manages its own session — that way you can sign in to
// different accounts on the mobile and desktop artboards to compare
// isolation. (Sessions don't auto-restore; sign in once per frame.)
function useAuth() {
  const [user, setUser] = React.useState(null);
  const [data, setData] = React.useState(null);

  const signIn = (email, password) => {
    const users = loadUsers();
    const u = users[email.toLowerCase()];
    if (!u) return { error: 'No account with that email. Create one below.' };
    if (u.password !== password) return { error: 'Incorrect password. Try again.' };
    setUser(u);
    setData(loadUserData(u.email));
    return { ok: true };
  };

  const signUp = (name, email, password) => {
    if (!name.trim()) return { error: 'Please enter your name.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email.' };
    if (password.length < 6) return { error: 'Password must be at least 6 characters.' };
    const users = loadUsers();
    const key = email.toLowerCase();
    if (users[key]) return { error: 'An account with that email already exists. Try signing in.' };
    const u = { email: key, name: name.trim(), password, createdAt: new Date().toISOString() };
    users[key] = u;
    saveUsers(users);
    setUser(u);
    setData(loadUserData(u.email));
    return { ok: true };
  };

  const signOut = () => {
    setUser(null);
    setData(null);
  };

  // Mutate the current account's data (e.g. add a service). Persists.
  const updateData = (mut) => {
    setData((prev) => {
      const next = typeof mut === 'function' ? mut(prev) : mut;
      if (user) saveUserData(user.email, next);
      return next;
    });
  };

  return { user, data, signIn, signUp, signOut, updateData };
}

// ── AuthScreen ──────────────────────────────────────────────────────
function AuthScreen({ auth, layout }) {
  const isDesktop = layout === 'desktop';
  const [mode, setMode] = React.useState('signin');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const submit = (e) => {
    if (e) e.preventDefault();
    setErr('');
    if (mode === 'signup' && password !== confirm) {
      setErr('Passwords don\'t match.');
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const r = mode === 'signin'
        ? auth.signIn(email, password)
        : auth.signUp(name, email, password);
      setBusy(false);
      if (r.error) setErr(r.error);
    }, 220);
  };

  const flip = (next) => {
    setErr('');
    setMode(next);
    setConfirm('');
  };

  return (
    <div style={{
      height: '100%', width: '100%', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      padding: isDesktop ? '48px 80px' : '92px 28px 28px',
      fontFamily: 'var(--font-sans)', color: 'var(--ink)', overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: isDesktop ? 48 : 32 }}>
        <div className="cmt-sidebar-brand-mark" style={{ width: 32, height: 32, borderRadius: 9, fontSize: 14 }}>G</div>
        <div style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.02em' }}>Garage</div>
      </div>

      <div style={{ maxWidth: 380, width: '100%', margin: isDesktop ? '0' : '0 auto' }}>
        <div style={{ fontSize: isDesktop ? 30 : 24, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8 }}>
          {mode === 'signin' ? 'Welcome back' : 'Create your garage'}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 24 }}>
          {mode === 'signin'
            ? 'Sign in to your account to access your vehicles and history.'
            : 'Set up a personal garage to track services, fuel, and reminders.'}
        </div>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <div className="field">
              <div className="field-label">Name</div>
              <input className="field-input" placeholder="Jane Doe" autoComplete="name"
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div className="field">
            <div className="field-label">Email</div>
            <input className="field-input" placeholder="you@example.com" type="email"
              autoComplete={mode === 'signin' ? 'username' : 'email'}
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <div className="field-label">Password</div>
            <input className="field-input" placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {mode === 'signup' && (
            <div className="field">
              <div className="field-label">Confirm password</div>
              <input className="field-input" placeholder="Repeat your password" type="password"
                autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          )}

          {err && (
            <div style={{
              padding: '10px 12px', background: 'var(--bad-bg)', color: 'var(--bad)',
              borderRadius: 10, fontSize: 12.5, marginBottom: 12, fontWeight: 500,
              border: '0.5px solid color-mix(in srgb, var(--bad) 25%, transparent)',
            }}>{err}</div>
          )}

          <button type="submit" disabled={busy} className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: 6, opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Working…' : (mode === 'signin' ? 'Sign in' : 'Create account')}
          </button>
        </form>

        <div style={{ marginTop: 22, fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
          {mode === 'signin' ? (
            <>New here? <button className="section-action" onClick={() => flip('signup')}
              style={{ color: 'var(--ink)', fontWeight: 500 }}>Create an account</button></>
          ) : (
            <>Already have an account? <button className="section-action" onClick={() => flip('signin')}
              style={{ color: 'var(--ink)', fontWeight: 500 }}>Sign in</button></>
          )}
        </div>

        <div style={{ marginTop: 24, fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center', lineHeight: 1.5 }}>
          Demo only · accounts stored locally in your browser
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { useAuth, AuthScreen, loadUserData, saveUserData });
