// Función para mostrar los servicios existentes en la base de datos
function loadServices() {
    fetch('http://localhost:5000/services')
        .then(response => response.json())
        .then(data => {
            // Limpiar la lista actual
            const serviceList = document.getElementById('serviceList');
            serviceList.innerHTML = '';

            // Mostrar los servicios existentes
            data.forEach(service => {
                const li = document.createElement('li');
                li.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'flex', 'justify-between', 'items-center');
                li.textContent = `${service.name} (${service.category}) - $${service.price} - ${service.duration} minutos`;

                // Crear el botón de eliminar
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('bg-red-600', 'text-white', 'py-1', 'px-3', 'rounded-lg', 'hover:bg-red-700', 'transition', 'duration-300');
                deleteButton.textContent = 'Eliminar';
                deleteButton.onclick = function () {
                    // Enviar solicitud DELETE al backend
                    fetch(`http://localhost:5000/services/${service.id}`, { method: 'DELETE' })
                        .then(() => li.remove());
                };

                // Añadir el botón de eliminar al ítem
                li.appendChild(deleteButton);

                // Añadir el servicio a la lista
                serviceList.appendChild(li);
            });
        })
        .catch(err => console.error('Error al cargar los servicios:', err));
}

// Funcionalidad para limpiar el formulario
document.getElementById('clearButton').addEventListener('click', function () {
    // Limpiar los valores de todos los campos del formulario
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceCategory').value = '';
    document.getElementById('servicePrice').value = '';
    document.getElementById('serviceDuration').value = '';
});

// Código para agregar servicios
document.getElementById('serviceForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenir el envío del formulario

    const serviceName = document.getElementById('serviceName').value;
    const serviceCategory = document.getElementById('serviceCategory').value;
    const servicePrice = document.getElementById('servicePrice').value;
    const serviceDuration = document.getElementById('serviceDuration').value;

    if (serviceName && serviceCategory && servicePrice && serviceDuration) {
        const serviceData = {
            name: serviceName,
            category: serviceCategory,
            price: parseFloat(servicePrice),
            duration: parseInt(serviceDuration)
        };

        // Enviar solicitud POST al backend para agregar el servicio
        fetch('http://localhost:5000/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serviceData)
        })
        .then(response => response.json())
        .then(data => {
            // Crear el ítem de la lista para el nuevo servicio
            const li = document.createElement('li');
            li.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'flex', 'justify-between', 'items-center');
            li.textContent = `${data.name} (${data.category}) - $${data.price} - ${data.duration} minutos`;

            // Crear el botón de eliminar
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('bg-red-600', 'text-white', 'py-1', 'px-3', 'rounded-lg', 'hover:bg-red-700', 'transition', 'duration-300');
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = function () {
                // Enviar solicitud DELETE al backend
                fetch(`http://localhost:5000/services/${data.id}`, { method: 'DELETE' })
                    .then(() => li.remove());
            };

            // Añadir el botón de eliminar al ítem
            li.appendChild(deleteButton);

            // Añadir el nuevo servicio a la lista
            document.getElementById('serviceList').appendChild(li);

            // Resetear el formulario
            document.getElementById('serviceForm').reset();
        })
        .catch(err => console.error('Error al agregar el servicio:', err));
    } else {
        alert('Por favor, complete todos los campos.');
    }
});

// Cargar los servicios al cargar la página
window.addEventListener('load', loadServices);
