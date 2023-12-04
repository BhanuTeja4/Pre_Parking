//Entry Class: Represent each entry in the parking lot
class Entry {
    constructor(owner, car, licensePlate, entryTime, exitTime) {
        this.owner = owner;
        this.car = car;
        this.licensePlate = licensePlate;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
    }
}

//UI Class: Handle User Interface Tasks
class UI {
    static displayEntries() {
        const entries = Store.getEntries();
        entries.forEach((entry) => UI.addEntryToTable(entry));
    }

    static addEntryToTable(entry) {
        const tableBody = document.querySelector('#tableBody');
        const row = document.createElement('tr');
        row.innerHTML = `   <td>${entry.owner}</td>
                            <td>${entry.car}</td>
                            <td>${entry.licensePlate}</td>
                            <td>${entry.entryTime}</td>
                            <td>${entry.exitTime}</td>
                            <td><button class="btn btn-danger delete">X</button></td>
                        `;
        tableBody.appendChild(row);
    }

    static clearInput() {
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach((input) => (input.value = ''));
    }

    static deleteEntry(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} w-50 mx-auto`;
        div.appendChild(document.createTextNode(message));
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('#entryForm');
        formContainer.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static validateInputs() {
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryTime = document.querySelector('#entryTime').value;
        const exitTime = document.querySelector('#exitTime').value;
        var licensePlateRegex = /^(?:[A-Z]{2}-\d{2}-\d{2})|(?:\d{2}-[A-Z]{2}-\d{2})|(?:\d{2}-\d{2}-[A-Z]{2})$/;
        if (owner === '' || car === '' || licensePlate === '' || entryTime === '' || exitTime === '') {
            UI.showAlert('All fields must be filled!', 'danger');
            return false;
        }
        if (exitTime < entryTime) {
            UI.showAlert('Exit Time cannot be lower than Entry Time', 'danger');
            return false;
        }
        if (!licensePlateRegex.test(licensePlate)) {
            UI.showAlert('License Plate must be like NN-NN-LL, NN-LL-NN, LL-NN-NN', 'danger');
            return false;
        }
        if (Store.getEntries().length >= Store.capacity) {
            UI.showAlert('Parking lots are full!', 'danger');
            return false;
        }
        return true;
    }
}

//Store Class: Handle Local Storage
class Store {
    static capacity = 3; // Set your parking lot capacity here

    static getEntries() {
        let entries;
        if (localStorage.getItem('entries') === null) {
            entries = [];
        } else {
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }

    static addEntries(entry) {
        const entries = Store.getEntries();
        if (entries.length >= Store.capacity) {
            UI.showAlert('Parking lots are full!', 'danger');
            return;
        }
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    static removeEntries(licensePlate) {
        const entries = Store.getEntries();
        entries.forEach((entry, index) => {
            if (entry.licensePlate === licensePlate) {
                entries.splice(index, 1);
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayEntries);

document.querySelector('#entryForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const owner = document.querySelector('#owner').value;
    const car = document.querySelector('#car').value;
    const licensePlate = document.querySelector('#licensePlate').value;
    const entryTime = document.querySelector('#entryTime').value;
    const exitTime = document.querySelector('#exitTime').value;
    if (!UI.validateInputs()) {
        return;
    }

    const entry = new Entry(owner, car, licensePlate, entryTime, exitTime);
    UI.addEntryToTable(entry);
    Store.addEntries(entry);
    UI.clearInput();

    UI.showAlert('Car successfully added to the parking lot', 'success');
});

document.querySelector('#tableBody').addEventListener('click', (e) => {
    UI.deleteEntry(e.target);
    var licensePlate = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    Store.removeEntries(licensePlate);
    UI.showAlert('Car successfully removed from the parking lot list', 'success');
});

document.querySelector('#searchInput').addEventListener('keyup', function searchTable() {
    const searchValue = document.querySelector('#searchInput').value.toUpperCase();
    const tableLine = document.querySelector('#tableBody').querySelectorAll('tr');
    for (let i = 0; i < tableLine.length; i++) {
        var count = 0;
        const lineValues = tableLine[i].querySelectorAll('td');
        for (let j = 0; j < lineValues.length - 1; j++) {
            if ((lineValues[j].innerHTML.toUpperCase()).startsWith(searchValue)) {
                count++;
            }
        }
        if (count > 0) {
            tableLine[i].style.display = '';
        } else {
            tableLine[i].style.display = 'none';
        }
    }
});
