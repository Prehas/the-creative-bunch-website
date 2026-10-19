(() => {
    const form = document.getElementById('reset-password-form');
    const status = document.getElementById('reset-status');
    const tokenHash = new URLSearchParams(location.hash.slice(1)).get('token_hash');
    // Keep the one-time credential in memory only, with no analytics or external assets.
    history.replaceState(null, '', location.pathname);
    const message = (text, error = false) => { status.textContent = text; status.dataset.error = String(error); };
    if (!tokenHash) {
        form.hidden = true;
        message('Open the link in your invitation or password-change email. If it has expired, ask a studio admin to send a new one.', true);
        return;
    }
    let saving = false;
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (saving) return;
        if (form.elements.password.value !== form.elements.confirm.value) { message('The passwords do not match.', true); form.elements.confirm.focus(); return; }
        saving = true;
        const button = form.querySelector('button'); button.disabled = true;
        message('Saving your password…');
        try {
            const response = await fetch('https://the-creative-bunch-content-api.vercel.app/api/auth/reset', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenHash, password: form.elements.password.value }), signal: AbortSignal.timeout(20000)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Password could not be saved.');
            form.reset(); form.hidden = true;
            localStorage.removeItem('tcb_content_api_token'); localStorage.removeItem('tcb_admin_session');
            message('Password saved. You can now sign in with your new password.');
            document.querySelector('a').focus();
        } catch (error) { message(error.message || 'Could not connect. Please try again.', true); }
        finally { saving = false; button.disabled = false; }
    });
})();
