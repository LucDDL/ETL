var loadedData = null;

document.getElementById('jsonFile').addEventListener('change', function() {
    var fileReader = new FileReader();
    fileReader.onload = function() {
        loadedData = JSON.parse(fileReader.result);
        displayData(loadedData);
    };
    fileReader.readAsText(this.files[0]);
});

document.getElementById('searchButton').addEventListener('click', function() {
    var searchValue = document.getElementById('searchInput').value;
    if (searchValue === '') {
        displayData(loadedData);
    } else {
        var filteredData = loadedData.filter(function(item) {
            return item.ticket_id == searchValue;
        });
        displayData(filteredData);
    }
});

document.getElementById('generateChartButton').addEventListener('click', function() {
    generateChart(loadedData);
});

function displayData(data) {
    var tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    data.forEach(function(item) {
        var newRow = tableBody.insertRow();
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);

        cell1.textContent = item.ticket_id;
        cell2.textContent = new Date(item.created_at).toLocaleDateString();

        cell3.textContent = item.subject;

        var tags;
        try {
            tags = JSON.parse(item.tags);
        } catch(e) {
            tags = item.tags.split(/(?=[A-Z])/);
        }

        tags.forEach(function(tag) {
            var span = document.createElement('span');
            span.className = 'tag is-dark';
            span.textContent = tag;
            cell4.appendChild(span);
        });

        var button = document.createElement('button');
        button.className = 'button is-small';
        button.textContent = 'Ver Info';
        button.onclick = function() {
            document.getElementById('infoTitle').textContent = 'Info para ' + item.subject;
            var infoContent = document.getElementById('infoContent');
            infoContent.innerHTML = '';
            tags.forEach(function(tag) {
                var span = document.createElement('span');
                span.className = 'tag is-dark';
                span.textContent = tag;
                infoContent.appendChild(span);
            });
            document.getElementById('infoModal').classList.add('is-active');
        };
        cell5.appendChild(button);
    });
}

function generateChart(data) {
    var dateFilterValue = document.getElementById('dateFilter').value;
    var filteredData = data;

    if (dateFilterValue) {
        var dateFilterDate = new Date(dateFilterValue);
        filteredData = data.filter(function(item) {
            var itemDate = new Date(item.created_at);
            return itemDate >= dateFilterDate && itemDate < new Date(dateFilterDate.getTime() + 24*60*60*1000);
        });
    }

    var subjects = {};

    filteredData.forEach(function(item) {
        var tags;
        try {
            tags = JSON.parse(item.tags);
        } catch(e) {
            tags = item.tags.split(/(?=[A-Z])/);
        }

        tags.forEach(function(tag) {
            if (!subjects[tag]) subjects[tag] = 0;
            subjects[tag]++;
        });
    });

    var chartData = {
        labels: Object.keys(subjects),
        datasets: [{
            label: 'Número de tickets por assunto',
            data: Object.values(subjects),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    var chartOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    var chart = new Chart(document.getElementById('chart'), {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
}