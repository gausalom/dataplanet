function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function sumQuantities(data) {
    let totalQuantity = 0;

    // Iterar sobre cada clave del objeto JSON
    Object.keys(data).forEach(key => {
        const quantity = parseInt(data[key].quantity, 10); // Convertir "quantity" a número
        if (!isNaN(quantity)) {
            totalQuantity += quantity; // Sumar si es un número válido
        }
    });

    return totalQuantity;
}

document.addEventListener("DOMContentLoaded", function () {
    fetch('datos.json')
        .then(response => response.json())
        .then(data => {

            const selectedEvent = getQueryParam('event');

            document.getElementById('event-name').textContent = selectedEvent;

            document.getElementById('kpi-num-decks').textContent = sumQuantities(data.decks.events[selectedEvent]);

            // Detectar si estamos en un dispositivo móvil (menos de 768px de ancho)
            const isMobile = window.innerWidth <= 768;

            const tsOperation = data.ts_operation;

            // Actualizar el contenido del span con id 'date-span' con la fecha
            document.getElementById('date-span').textContent = tsOperation;

            /************************ Eventos**************************************/ 
            const eventsDropdownMenu = document.getElementById("eventsDropdownMenu");
            const events = data.events;

            // Limpiar el contenido actual (si es necesario)
            eventsDropdownMenu.innerHTML = "";

            // Generar el menú dinámicamente
            events.forEach(event => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.classList.add("dropdown-item");
                
                // Aquí se añade el parámetro del evento en la URL
                a.href = `events.html?event=${encodeURIComponent(event)}`;
                a.textContent = event;
                li.appendChild(a);
                eventsDropdownMenu.appendChild(li);
            });
            /********************************** Popular **********************************/

            // Gráfico de Tintas Jugadas
            const inksData = data.ink_played.events[selectedEvent];

            // Extraer las cantidades, colores y nombres de cada tinta
            const inksLabels = Object.keys(inksData);
            const inksValues = inksLabels.map(label => inksData[label].quantity);
            const inksColors = inksLabels.map(label => inksData[label].color); // Obtener colores

            // Cargar imágenes desde las URLs
            const images = inksLabels.map(label => {
                const img = new Image();
                img.src = inksData[label].image;
                return img;
            });

            // Crear el gráfico de tintas una vez que todas las imágenes estén cargadas
            Promise.all(images.map(img => new Promise(resolve => {
                img.onload = resolve;
            }))).then(() => {
                const ctxInksPopular = document.getElementById('inksChartPopular').getContext('2d');

                const inksChartPopular = new Chart(ctxInksPopular, {
                    type: 'bar',
                    data: {
                        labels: inksLabels, // Las etiquetas de las tintas
                        datasets: [{
                            label: 'Tintas Jugadas',
                            data: inksValues,
                            backgroundColor: inksColors, // Usar los colores de cada tinta
                            borderColor: inksColors.map(color => color), // Bordes del mismo color
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                display: false, // Ocultar etiquetas de texto en el eje X
                            },
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)', // Color de la cuadrícula (opaco)
                                    lineWidth: 1
                                }
                            }
                        },
                        layout: {
                            padding: {
                                bottom: 50 // Añadir espacio inferior para que no se corten las imágenes
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Most Popular Inks',
                                color: '#ffffff', // Color del título
                                font: {
                                    size: 18
                                }
                            }
                        }
                    },
                    plugins: [{
                        afterDraw: function(chart) {
                            const ctx = chart.ctx;
                            const xAxis = chart.scales.x;
                            const yAxisBottom = chart.scales.y.bottom; // Coordenada inferior del gráfico

                            // Iterar sobre cada etiqueta y su posición en el eje X
                            inksLabels.forEach((label, index) => {
                                const x = xAxis.getPixelForTick(index); // Posición X para cada barra
                                const img = images[index];

                                // Dibujar la imagen encima de la posición correspondiente
                                ctx.drawImage(img, x - 15, yAxisBottom + 10, 30, 30); // Ajustar la posición y tamaño de la imagen
                            });
                        }
                    }]
                });

                

                /*** DECKS POPULAR */
                const ctxDecks = document.getElementById('decksChartPopular').getContext('2d');
                
                const decksData = data.decks.events[selectedEvent];

                // Extraer las etiquetas (ej. amber/emerald), cantidades y colores/imágenes de cada deck
                let decksLabels = Object.keys(decksData);
                let decksValues = decksLabels.map(label => decksData[label].quantity);
                let decksColors1 = decksLabels.map(label => decksData[label].color1.color); // Colores del primer color

                // Cargar imágenes de las URLs
                let images1 = decksLabels.map(label => {
                    const img = new Image();
                    img.src = decksData[label].color1.image;
                    return img;
                });
                let images2 = decksLabels.map(label => {
                    const img = new Image();
                    img.src = decksData[label].color2.image;
                    return img;
                });

                // Si estamos en un móvil, limitamos los datos a los primeros 6 elementos
                if (isMobile) {
                    decksLabels = decksLabels.slice(0, 6);
                    decksValues = decksValues.slice(0, 6);
                    decksColors1 = decksColors1.slice(0, 6);
                    images1 = images1.slice(0, 6);
                    images2 = images2.slice(0, 6);
                }

                const decksChart = new Chart(ctxDecks, {
                    type: 'bar',
                    data: {
                        labels: decksLabels, // Las etiquetas de los decks
                        datasets: [{
                            label: 'Popular Decks',
                            data: decksValues,
                            backgroundColor: decksColors1, // Usar el primer color
                            borderColor: decksColors1.map(color => color), // Bordes del mismo color
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                display: false, // Ocultar etiquetas de texto en el eje X
                                barPercentage: 0.8, // Controla el ancho de las barras
                                categoryPercentage: 0.7, // Controla el espacio entre las barras
                            },
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)', // Color de la cuadrícula (opaco)
                                    lineWidth: 1
                                }
                            }
                        },
                        layout: {
                            padding: {
                                bottom: 50 // Añadir espacio inferior para que no se corten las imágenes
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Popular Decks',
                                color: '#ffffff', // Color del título
                                font: {
                                    size: 18
                                }
                            }
                        }
                    },
                    plugins: [{
                        afterDraw: function(chart) {
                            const ctx = chart.ctx;
                            const xAxis = chart.scales.x;
                            const yAxisBottom = chart.scales.y.bottom; // Coordenada inferior del gráfico
                
                            // Iterar sobre cada barra y su posición en el eje X
                            decksLabels.forEach((label, index) => {
                                const barX = xAxis.getPixelForValue(index); // Posición X de la barra actual
                                const img1 = images1[index];
                                const img2 = images2[index];
                
                                // Ajustar las imágenes centradas sobre la barra
                                const imageY = yAxisBottom + 10; // Posición Y ligeramente por debajo de las barras
                                const imgWidth = 30; // Ancho de las imágenes
                                const imgHeight = 30; // Altura de las imágenes
                
                                // Calcular la posición X para que ambas imágenes estén centradas en la barra
                                const img1X = barX - imgWidth / 2 - 10; // Imagen 1 a la izquierda
                                const img2X = barX - imgWidth / 2 + 10; // Imagen 2 a la derecha
                
                                // Dibujar las imágenes
                                ctx.drawImage(img1, img1X, imageY, imgWidth, imgHeight);
                                ctx.drawImage(img2, img2X, imageY, imgWidth, imgHeight);
                            });
                        }
                    }]
                });

            });
            

            // Gráfico de Cartas Más Jugadas
            const cartasData = data.cards_played.events[selectedEvent];

            // Extraer los nombres y cantidades de cartas
            let cartasLabels = Object.keys(cartasData);

            let cartasValues = cartasLabels.map(label => cartasData[label].quantity);
            let cartasColors = cartasLabels.map(label => cartasData[label].color);

            const ctxCartas = document.getElementById('cartasChartPopular').getContext('2d');

            if (isMobile) {
                cartasLabels = cartasLabels.slice(0, 6);
                cartasValues = cartasValues.slice(0, 6);
                cartasColors = cartasColors.slice(0, 6);
            }

            const cartasChart = new Chart(ctxCartas, {
                type: 'bar',
                data: {
                    labels: cartasLabels,
                    datasets: [{
                        label: 'Most Popular Played Cards',
                        data: cartasValues,
                        backgroundColor: cartasColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            ticks: {
                                callback: function(value, index, values) {
                                    return cartasLabels[index]; // Mostrar las etiquetas normalmente
                                },
                                color: '#ffffff', // Color de las etiquetas
                                maxRotation: 90, // Rotación máxima para la inclinación deseada
                                minRotation: 90, // Asegura que las etiquetas siempre se inclinen 120 grados
                                align: 'end', // Alinear el final del texto hacia la base
                                padding: 10, // Añadir un poco de espacio para evitar el solapamiento con la barra
                            },
                            grid: {
                                display: false // Ocultar la cuadrícula del eje X
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)', // Color de la cuadrícula (opaco)
                                lineWidth: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Most Popular Played Cards',
                            color: '#ffffff', // Color del título
                            font: {
                                size: 18
                            }
                        }
                    }
                }
            });

            

        })
        .catch(error => console.error('Error cargando los datos:', error));
});
