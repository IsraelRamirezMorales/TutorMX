// Base de datos simulada
const tutores = [
    {
        id: 1,
        nombre: "Jorge Mateo Rangel Moreno",
        materia: "Bases de Datos (PostgreSQL / MongoDB)",
        calificacion: 4.9,
        precio: "$150/hr",
        foto: "https://i.pravatar.cc/150?img=11"
    },
    {
        id: 2,
        nombre: "Ana Sofía Valdez",
        materia: "Desarrollo Web (Vue & Laravel)",
        calificacion: 5.0,
        precio: "$180/hr",
        foto: "https://i.pravatar.cc/150?img=5"
    },
    {
        id: 3,
        nombre: "Carlos Mendoza",
        materia: "Redes y Protocolos Cisco",
        calificacion: 4.7,
        precio: "$130/hr",
        foto: "https://i.pravatar.cc/150?img=8"
    },
    {
        id: 4,
        nombre: "Elena Ríos",
        materia: "Estructuras de Datos y Algoritmos",
        calificacion: 4.8,
        precio: "$140/hr",
        foto: "https://i.pravatar.cc/150?img=9"
    }
];

// Referencias al DOM principales
const contenedorTutores = document.getElementById('contenedor-tutores');
const buscador = document.getElementById('buscador');
const contenedorCitas = document.getElementById('contenedor-citas');
const contadorCitas = document.getElementById('contador-citas');

// Referencias al Modal en el DOM
const modal = document.getElementById('modal-agendar');
const formCita = document.getElementById('form-cita');

// --- LÓGICA DE TUTORES --- //

function renderizarTutores(listaTutores) {
    contenedorTutores.innerHTML = '';

    if (listaTutores.length === 0) {
        contenedorTutores.innerHTML = `<p class="text-gray-500 col-span-full text-center py-8">No se encontraron tutores con esa búsqueda.</p>`;
        return;
    }

    listaTutores.forEach(tutor => {
        const tarjeta = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div class="p-6">
                    <div class="flex items-center gap-4 mb-4">
                        <img src="${tutor.foto}" alt="${tutor.nombre}" class="w-16 h-16 rounded-full object-cover border-2 border-gray-50">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">${tutor.nombre}</h3>
                            <div class="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                <span class="text-gray-600 font-medium">${tutor.calificacion}</span>
                            </div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <span class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                            ${tutor.materia}
                        </span>
                    </div>
                    <div class="flex items-center justify-between mt-6">
                        <span class="text-lg font-bold text-gray-900">${tutor.precio}</span>
                        <button onclick="agendarTutor(${tutor.id})" class="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                            Agendar
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedorTutores.innerHTML += tarjeta;
    });
}

buscador.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    const tutoresFiltrados = tutores.filter(tutor =>
        tutor.nombre.toLowerCase().includes(termino) ||
        tutor.materia.toLowerCase().includes(termino)
    );
    renderizarTutores(tutoresFiltrados);
});

// --- LÓGICA DEL MODAL --- //

function agendarTutor(id) {
    const tutor = tutores.find(t => t.id === id);
    document.getElementById('nombre-tutor-modal').textContent = tutor.nombre;
    document.getElementById('tutor-id-modal').value = tutor.id;
    modal.classList.remove('hidden');
}

function cerrarModal() {
    modal.classList.add('hidden');
    formCita.reset();
    document.getElementById('mensaje-error-modal').classList.add('hidden');
}

function guardarCita(event) {
    event.preventDefault();

    const idTutor = document.getElementById('tutor-id-modal').value;
    const fecha = document.getElementById('fecha-cita').value;
    const hora = document.getElementById('hora-cita').value;
    const tema = document.getElementById('tema-cita').value;
    const errorDiv = document.getElementById('mensaje-error-modal');

    if (!fecha || !hora || !tema) {
        errorDiv.textContent = "Por favor, completa todos los campos correctamente.";
        errorDiv.classList.remove('hidden');
        return;
    }

    const tutor = tutores.find(t => t.id === parseInt(idTutor));

    const nuevaCita = {
        idReserva: Date.now(),
        tutor: tutor.nombre,
        materia: tutor.materia,
        fecha: fecha,
        hora: hora,
        tema: tema
    };

    let misCitas = JSON.parse(localStorage.getItem('tutorMX_citas')) || [];
    misCitas.push(nuevaCita);
    localStorage.setItem('tutorMX_citas', JSON.stringify(misCitas));

    cerrarModal();
    renderizarCitas();
}

// --- LÓGICA DE CITAS AGENDADAS --- //

function renderizarCitas() {
    let misCitas = JSON.parse(localStorage.getItem('tutorMX_citas')) || [];

    // Actualización dinámica del contador
    contadorCitas.textContent = `${misCitas.length} tutoría${misCitas.length !== 1 ? 's' : ''}`;

    contenedorCitas.innerHTML = '';

    if (misCitas.length === 0) {
        contenedorCitas.innerHTML = `<p class="text-gray-500 col-span-full py-4">Aún no tienes tutorías agendadas.</p>`;
        return;
    }

    misCitas.forEach(cita => {
        const tarjetaCita = `
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                    <h4 class="font-bold text-gray-900">${cita.tutor}</h4>
                    <p class="text-sm text-[#2563EB] font-medium">${cita.materia}</p>
                    <div class="flex gap-4 mt-3 text-sm text-gray-600">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 
                            ${cita.fecha}
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
                            ${cita.hora}
                        </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded border border-gray-100">Tema: ${cita.tema}</p>
                </div>
                <!-- Botón para eliminar el elemento dinámico -->
                <button onclick="cancelarCita(${cita.idReserva})" class="text-red-500 hover:text-white bg-red-50 hover:bg-red-500 p-3 rounded-lg transition-colors" title="Cancelar cita">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;
        contenedorCitas.innerHTML += tarjetaCita;
    });
}

function cancelarCita(idReserva) {
    if (confirm("¿Estás seguro de que deseas cancelar esta tutoría?")) {
        let misCitas = JSON.parse(localStorage.getItem('tutorMX_citas')) || [];

        misCitas = misCitas.filter(cita => cita.idReserva !== idReserva);

        localStorage.setItem('tutorMX_citas', JSON.stringify(misCitas));
        renderizarCitas();
    }
}

function cargarDatosUsuario() {
    const userData = localStorage.getItem('tutorMX_user');
    if (userData) {
        const user = JSON.parse(userData);
        document.getElementById('userGreeting').textContent = `Hola, ${user.name}`;
    }
}

cargarDatosUsuario();
renderizarTutores(tutores);
renderizarCitas();