 // Definir o locale para português
 dayjs.locale('pt');
 const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

 let data = []; // Armazenar os dados

 document.getElementById('jsonfile').addEventListener('change', function() {
     let fr = new FileReader();
     fr.onload = function() {
         data = JSON.parse(fr.result);
         createTable(data);
         createChart(data);
         // Armazenar os dados no localStorage
         localStorage.setItem('eventData', JSON.stringify(data));
     }
     fr.readAsText(this.files[0]);
 });

 function createTable(data) {
     let tableBody = '';
     for (let item of data) {
         const negocioId = item.url.split('/').pop(); // Extrair o ID do negócio do link
         tableBody += `<tr>
             <td><button class="button is-rounded" onclick="openLink('${item.url}', '${negocioId}')"><span class="badge">${negocioId}</span></button></td>
             <td>${item.dt_inicio_evento}</td>
             <td>${item.dt_fim_evento}</td>
             <td>${item.nome_evento}</td>
             <td>${item.valor}</td>
             <td>${item.publico_estimado_por_dia}</td>
         </tr>`;
     }
     document.getElementById('tableBody').innerHTML = tableBody;
 }

 function createChart(data) {
     const weekDaysData = weekdays.map(day => ({
         day,
         total: data.filter(item => dayjs(item.dt_inicio_evento).format('dddd') === day).reduce((prev, curr) => prev + curr.publico_estimado_por_dia, 0)
     }));
     
     var ctx = document.getElementById('chart').getContext('2d');
     var chart = new Chart(ctx, {
         type: 'bar',
         data: {
             labels: weekDaysData.map(item => item.day),
             datasets: [{
                 label: 'Público Estimado',
                 data: weekDaysData.map(item => item.total),
                 backgroundColor: [
                     'rgba(67, 34, 94, 1)',
                     'rgba(99, 61, 128, 1)',
                     'rgba(131, 88, 162, 1)',
                     'rgba(163, 115, 195, 1)',
                     'rgba(195, 142, 229, 1)',
                     'rgba(227, 169, 162, 1)',
                     'rgba(255, 196, 255, 1)'
                 ],
                 borderColor: [
                     'rgba(67, 34, 94, 1)',
                     'rgba(99, 61, 128, 1)',
                     'rgba(131, 88, 162, 1)',
                     'rgba(163, 115, 195, 1)',
                     'rgba(195, 142, 229, 1)',
                     'rgba(227, 169, 162, 1)',
                     'rgba(255, 196, 255, 1)'
                 ],
                 borderWidth: 0
             }]
         },
         options: {
             scales: {
                 x: {
                     grid: {
                         display: false
                     }
                 },
                 y: {
                     grid: {
                         display: false
                     }
                 }
             }
         }
     });
 }

 function openLink(url, id) {
     window.open(url, `_negocio${id}`);
 }

 function applyDateFilter() {
     const startDate = document.getElementById('startDateFilter').value;
     const endDate = document.getElementById('endDateFilter').value;

     // Aplicar filtro de data
     let filteredData = data.filter(item => item.dt_inicio_evento >= startDate && item.dt_fim_evento <= endDate);

     // Criar a tabela com os dados filtrados
     createTable(filteredData);
 }

 function resetFilter() {
     // Limpar os campos de data
     document.getElementById('startDateFilter').value = '';
     document.getElementById('endDateFilter').value = '';

     // Mostrar todos os dados novamente
     createTable(data);
 }

 // Verificar se há dados armazenados no localStorage
 const storedData = localStorage.getItem('eventData');
 if (storedData) {
     data = JSON.parse(storedData);
     createTable(data);
     createChart(data);
 }