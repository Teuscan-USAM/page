const form = document.getElementById('access-form');
const copyButtons = document.querySelectorAll('.copy-button');
const collapseButtons = document.querySelectorAll('.siap-toggle');

const replaceVowels = (value) => value
    .replaceAll('a', '4')
    .replaceAll('e', '3')
    .replaceAll('i', '1')
    .replaceAll('o', '0');

const getHostname = (value) => {
    const normalizedUrl = value.startsWith('http://') || value.startsWith('https://')
        ? value
        : `https://${value}`;

    return new URL(normalizedUrl).hostname;
};

if (form) {
    const urlInput = document.getElementById('url');
    const credentialsPanel = document.getElementById('credentials-panel');
    const sshValue = document.getElementById('ssh-generated');
    const siapValue = document.getElementById('siap-generated');
    const sisValue = document.getElementById('sis-generated');

    const resetResults = () => {
        sshValue.textContent = '—';
        siapValue.textContent = '—';
        sisValue.textContent = '—';
        credentialsPanel.classList.add('hidden');
        copyButtons.forEach((button) => { button.disabled = true; });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        try {
            const hostname = getHostname(urlInput.value.trim());
            const serverName = hostname.replace(/^sis/, '').split('.')[0].replace(/^-+/, '');
            const transformedServerName = replaceVowels(serverName);

            sshValue.textContent = `ssh siap@${hostname}`;
            sisValue.textContent = `s14p${transformedServerName}-s14p`;
            siapValue.textContent = `s1s${transformedServerName}-s14p`;
            credentialsPanel.classList.remove('hidden');
            copyButtons.forEach((button) => { button.disabled = false; });
        } catch {
            resetResults();
            urlInput.setCustomValidity('Ingresa una URL válida.');
            urlInput.reportValidity();
        }
    });

    urlInput.addEventListener('input', () => { urlInput.setCustomValidity(''); });
}

copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        const target = document.getElementById(button.dataset.copyTarget);
        const value = button.dataset.copyValue ?? target?.textContent;

        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);
            button.textContent = button.dataset.copyValue ? 'Copiado' : 'Copiado';
            setTimeout(() => { button.textContent = button.dataset.copyValue ? 'Copiar URL' : 'Copiar'; }, 1800);
        } catch {
            button.textContent = 'No disponible';
            setTimeout(() => { button.textContent = 'Copiar'; }, 1800);
        }
    });
});

collapseButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.collapseTarget);
        const icon = button.querySelector('.siap-toggle-icon');
        const isCollapsed = button.getAttribute('aria-expanded') === 'false';

        target.hidden = !isCollapsed;
        button.setAttribute('aria-expanded', String(isCollapsed));
        icon.textContent = isCollapsed ? '−' : '+';
    });
});
