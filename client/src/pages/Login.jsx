    import { useState } from 'react';
    import api from '../api/axios';

    export default function Login({ onLogin }) {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
        const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
        const res = await api.post(endpoint, form);
        onLogin(res.data.agent, res.data.token);
        } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="login-page">
        <div className="login-card">
            <div className="login-brand">
            <div className="brand-indicator" />
            <span className="brand-name">RapidDispatch</span>
            <span className="brand-sub">Live Ops</span>
            </div>

            <h1 className="login-title">
            {mode === 'login' ? 'Agent Sign In' : 'Create Account'}
            </h1>
            <p className="login-subtitle">
            {mode === 'login'
                ? 'Sign in to access the live helpdesk'
                : 'Register as a support agent'}
            </p>

            {error && <div className="login-error">{error}</div>}

            <form className="login-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
                <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                    className="form-input"
                    placeholder="Agent name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                </div>
            )}
            <div className="form-group">
                <label className="form-label">Email</label>
                <input
                className="form-input"
                type="email"
                placeholder="agent@rapiddispatch.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Password</label>
                <input
                className="form-input"
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                />
            </div>
            <button className="btn-login" type="submit" disabled={loading}>
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            </form>

            <p className="login-switch">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
                className="btn-switch"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
            </p>
        </div>
        </div>
    );
    }