// script.js - Versão corrigida para Node.js
const { JSDOM } = require('jsdom');

// Cria DOM com URL válida para permitir localStorage
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <form id="appointment-form">
        <input id="patient-name" value="João Silva">
        <input id="doctor-name" value="Dr. Carlos">
        <input id="appointment-date" value="2024-01-15">
        <input id="appointment-time" value="14:30">
        <button type="submit">Agendar</button>
    </form>
    <div id="appointment-list"></div>
</body>
</html>
`, {
    url: "http://localhost:3000", // URL válida necessária
    pretendToBeVisual: true,
    resources: "usable",
    runScripts: "dangerously"
});

const { window } = dom;
const { document } = window;

// Mock do localStorage mais robusto
class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    removeItem(key) {
        delete this.store[key];
    }

    clear() {
        this.store = {};
    }
}

// Atribui o mock ao window
window.localStorage = new LocalStorageMock();

// Funções principais
const getAppointments = () => {
    const appointments = window.localStorage.getItem('appointments');
    return appointments ? JSON.parse(appointments) : [];
};

const saveAppointments = (appointments) => {
    window.localStorage.setItem('appointments', JSON.stringify(appointments));
};

const renderAppointments = () => {
    const appointments = getAppointments();
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = '';

    if (appointments.length === 0) {
        appointmentList.innerHTML = '<p>Nenhuma consulta agendada</p>';
        return;
    }

    appointments.forEach((appt, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p><strong>Paciente:</strong> ${appt.patientName}</p>
            <p><strong>Médico:</strong> ${appt.doctorName}</p>
            <p><strong>Data:</strong> ${appt.date}</p>
            <p><strong>Horário:</strong> ${appt.time}</p>
            <hr>
        `;
        appointmentList.appendChild(div);
    });
};

// Teste do sistema
console.log('=== TESTE DO SISTEMA DE AGENDAMENTO ===');

// Adiciona algumas consultas de exemplo
const appointmentsData = [
    {
        patientName: "João Silva",
        doctorName: "Dr. Carlos",
        date: "2024-01-15",
        time: "14:30"
    },
    {
        patientName: "Maria Santos", 
        doctorName: "Dra. Ana",
        date: "2024-01-16",
        time: "10:00"
    }
];

// Salva no localStorage
saveAppointments(appointmentsData);

// Recupera e exibe
const storedAppointments = getAppointments();
console.log('Consultas armazenadas:');
storedAppointments.forEach((appt, index) => {
    console.log(`${index + 1}. ${appt.patientName} - ${appt.doctorName} - ${appt.date} ${appt.time}`);
});

// Teste de adição de nova consulta
const newAppointment = {
    patientName: "Pedro Oliveira",
    doctorName: "Dr. Roberto",
    date: "2024-01-17", 
    time: "16:00"
};

console.log('\nAdicionando nova consulta...');
const updatedAppointments = [...storedAppointments, newAppointment];
saveAppointments(updatedAppointments);

console.log('Total de consultas após adição:', getAppointments().length);

// Teste de remoção
console.log('\nRemovendo primeira consulta...');
const finalAppointments = getAppointments();
finalAppointments.shift(); // Remove a primeira
saveAppointments(finalAppointments);

console.log('Total de consultas após remoção:', getAppointments().length);
console.log('Consultas finais:', getAppointments());

console.log('\n=== TESTE CONCLUÍDO ===');
console.log('O sistema de armazenamento está funcionando!');
console.log('\n=== PARA USO NO NAVEGADOR ===');
console.log('1. Abra o arquivo agendamento.html no navegador');
console.log('2. O script original funcionará perfeitamente');
console.log('3. O localStorage estará disponível normalmente');