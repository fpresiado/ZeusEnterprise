import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [state, setState] = React.useState<any>(null);
  const [name, setName] = React.useState('ZE');
  const token = 'dev-admin-token';

  async function refresh() {
    const r = await fetch('/admin/state', { headers: { Authorization: `Bearer ${token}` }});
    setState(await r.json());
  }

  async function runHello() {
    const r = await fetch('/admin/task/hello-world', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name }),
    });
    await refresh();
    return r.json();
  }

  React.useEffect(() => { refresh(); }, []);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>ZE Operator Console</h1>
      <p>Minimal UI wired to the real orchestrator.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={runHello}>Run hello-world</button>
        <button onClick={refresh}>Refresh</button>
      </div>

      <pre style={{ marginTop: 16, background: '#111', color: '#0f0', padding: 16, borderRadius: 8 }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
