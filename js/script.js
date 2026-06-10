let currentMode = 'login';

function switchTab(mode) {
    currentMode = mode;
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const registerFields = document.getElementById('registerFields');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('authForm');
    const feedback = document.getElementById('feedbackMessage');

    form.reset();
    feedback.classList.add('hidden');

    if (mode === 'register') {
        tabRegister.classList.add('bg-white', 'shadow-sm', 'text-gray-900');
        tabRegister.classList.remove('text-gray-500');
        tabLogin.classList.remove('bg-white', 'shadow-sm', 'text-gray-900');
        tabLogin.classList.add('text-gray-500');
        registerFields.classList.remove('hidden');
        submitBtn.textContent = 'Create Account';
    } else {
        tabLogin.classList.add('bg-white', 'shadow-sm', 'text-gray-900');
        tabLogin.classList.remove('text-gray-500');
        tabRegister.classList.remove('bg-white', 'shadow-sm', 'text-gray-900');
        tabRegister.classList.add('text-gray-500');
        registerFields.classList.add('hidden');
        submitBtn.textContent = 'Sign In';
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        mostrarMensaje('Please fill in all required fields.', 'text-red-600');
        return;
    }

    if (currentMode === 'register') {
        const name = document.getElementById('name').value;
        const role = document.getElementById('role').value;
        const subject = document.getElementById('subject').value;

        if (!name || !role || !subject) {
            mostrarMensaje('Please fill in all 5 fields to register.', 'text-red-600');
            return;
        }

        const newUser = { name, email, role, subject };
        localStorage.setItem('tutorMX_user', JSON.stringify(newUser));

        mostrarMensaje(`¡Cuenta creada! Redirigiendo al dashboard...`, 'text-green-600');
        setTimeout(() => window.location.href = 'pages/dashboard.html', 1500);
    } else {
        mostrarMensaje(`¡Bienvenido! Redirigiendo...`, 'text-green-600');
        setTimeout(() => window.location.href = 'pages/dashboard.html', 1500);
    }
}

function mostrarMensaje(texto, colorClass) {
    const feedback = document.getElementById('feedbackMessage');
    feedback.textContent = texto;
    feedback.className = `mt-4 text-center text-sm font-medium ${colorClass} block`;
}