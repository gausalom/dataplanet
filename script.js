document.addEventListener("DOMContentLoaded", function () {
    fetch('datos.json')
        .then(response => response.json())
        .then(data => {

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
            const inksData = data.ink_played.popular;

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

                /************************************** TRENDING **************************************/
                const ctxInksTrending = document.getElementById('inksChartTrending').getContext('2d');

                const inksChartTrending = new Chart(ctxInksTrending, {
                    type: 'bar',
                    data: {
                        labels: inksLabelsTrending, // Las etiquetas de las tintas
                        datasets: [{
                            label: 'Tintas Jugadas',
                            data: inksValuesTrending,
                            backgroundColor: inksColorsTrending, // Usar los colores de cada tinta
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
                                text: 'Most Trending Inks',
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

                const decksData = data.decks.popular;

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

                /*** DECKS TRENDING */
                const ctxDecksTrending = document.getElementById('decksChartTrending').getContext('2d');

                const decksDataTrending = data.decks.trending;

                // Extraer las etiquetas (ej. amber/emerald), cantidades y colores/imágenes de cada deck
                let decksLabelsTrending = Object.keys(decksDataTrending);
                let decksValuesTrending = decksLabelsTrending.map(label => decksDataTrending[label].quantity);
                let decksColors1Trending = decksLabelsTrending.map(label => decksDataTrending[label].color1.color); // Colores del primer color

                // Cargar imágenes de las URLs
                let images1Trending = decksLabelsTrending.map(label => {
                    const img = new Image();
                    img.src = decksDataTrending[label].color1.image;
                    return img;
                });
                let images2Trending = decksLabelsTrending.map(label => {
                    const img = new Image();
                    img.src = decksDataTrending[label].color2.image;
                    return img;
                });

                // Si estamos en un móvil, limitamos los datos a los primeros 6 elementos
                if (isMobile) {
                    decksLabelsTrending = decksLabelsTrending.slice(0, 6);
                    decksValuesTrending = decksValuesTrending.slice(0, 6);
                    decksColors1Trending = decksColors1Trending.slice(0, 6);
                    images1Trending = images1Trending.slice(0, 6);
                    images2Trending = images2Trending.slice(0, 6);
                }

                const decksChartTrending = new Chart(ctxDecksTrending, {
                    type: 'bar',
                    data: {
                        labels: decksLabelsTrending, // Las etiquetas de los decks
                        datasets: [{
                            label: 'Trending Decks',
                            data: decksValuesTrending,
                            backgroundColor: decksColors1Trending, // Usar el primer color
                            borderColor: decksColors1Trending.map(color => color), // Bordes del mismo color
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
                                text: 'Trending Decks',
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
                                const img1 = images1Trending[index];
                                const img2 = images2Trending[index];
                
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
            const cartasData = data.cards_played.popular;

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

            /********************************** Trending **********************************/

            // Gráfico de Tintas Jugadas
            const inksDataTrending = data.ink_played.trending;

            // Extraer las cantidades, colores y nombres de cada tinta
            const inksLabelsTrending = Object.keys(inksDataTrending);
            const inksValuesTrending = inksLabels.map(label => inksDataTrending[label].quantity);
            const inksColorsTrending = inksLabels.map(label => inksDataTrending[label].color); // Obtener colores

            // Gráfico de Cartas Más Jugadas
            const cartasDataTrending = data.cards_played.trending;

            // Extraer los nombres y cantidades de cartas
            let cartasLabelsTrending = Object.keys(cartasDataTrending);

            let cartasValuesTrending = cartasLabelsTrending.map(label => cartasDataTrending[label].quantity);
            let cartaColorsTrending = cartasLabelsTrending.map(label => cartasDataTrending[label].color);

            const ctxCartasTrending = document.getElementById('cartasChartTrending').getContext('2d');

            if (isMobile) {
                cartasLabelsTrending = cartasLabelsTrending.slice(0, 6);
                cartasValuesTrending = cartasValuesTrending.slice(0, 6);
                cartaColorsTrending = cartaColorsTrending.slice(0, 6);
            }

            const cartasChartTrending = new Chart(ctxCartasTrending, {
                type: 'bar',
                data: {
                    labels: cartasLabelsTrending,
                    datasets: [{
                        label: 'Cartas Más Jugadas',
                        data: cartasValuesTrending,
                        backgroundColor: cartaColorsTrending,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            ticks: {
                                callback: function(value, index, values) {
                                    return cartasLabelsTrending[index]; // Mostrar las etiquetas normalmente
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
                            text: 'Most Trending Played Cards',
                            color: '#ffffff', // Color del título
                            font: {
                                size: 18
                            }
                        }
                    }
                }
            });

            /********************************* EVOLUTION DECKS ************************************/
            const container = document.getElementById("decksEvolution");
            const decks = data.evolution.popular;

            Object.keys(decks).forEach(deckKey => {
                const deck = decks[deckKey];

                // Crear el contenedor para cada deck
                const deckItem = document.createElement("div");
                deckItem.style.display = "flex";
                deckItem.style.alignItems = "center";
                deckItem.style.justifyContent = "space-between";
                deckItem.style.backgroundColor = "rgb(72,72,72)";
                deckItem.style.marginBottom = "10px";
                deckItem.style.padding = "10px";
                deckItem.style.borderRadius = "5px";

                // Crear las imágenes
                const img1 = document.createElement("img");
                img1.src = deck.image1;
                img1.style.width = "30px";
                img1.style.height = "30px";
                img1.style.marginRight = "10px";

                const img2 = document.createElement("img");
                img2.src = deck.image2;
                img2.style.width = "30px";
                img2.style.height = "30px";
                img2.style.marginRight = "10px";

                // Crear el contenedor para el nombre y las imágenes
                const nameContainer = document.createElement("div");
                nameContainer.style.display = "flex";
                nameContainer.style.alignItems = "center";

                nameContainer.appendChild(img1);
                nameContainer.appendChild(img2);

                const nameText = document.createElement("span");
                nameText.innerText = deck.name;
                nameText.style.fontSize = "16px";
                nameText.style.fontWeight = "bold";
                nameText.style.color = "#fff";
                nameContainer.appendChild(nameText);

                // Crear la flecha según la opción
                const arrow = document.createElement("span");
                arrow.style.fontSize = "20px";
                arrow.style.marginLeft = "20px";

                if (deck.option === "up") {
                    arrow.innerHTML = "&#9650;"; // Flecha hacia arriba
                    arrow.style.color = "green";
                } else if (deck.option === "down") {
                    arrow.innerHTML = "&#9660;"; // Flecha hacia abajo
                    arrow.style.color = "red";
                } else if (deck.option === "equal") {
                    arrow.innerHTML = "&#8211;"; // Guion
                    arrow.style.color = "white";
                }

                // Añadir los elementos al contenedor del deck
                deckItem.appendChild(nameContainer);
                deckItem.appendChild(arrow);

                // Añadir el deck a la lista
                container.appendChild(deckItem);
            });
        })
        .catch(error => console.error('Error cargando los datos:', error));
});
