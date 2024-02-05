// initialize basemmap
        mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/light-v10', // style URL
            zoom: 3, // starting zoom
            center: [-100, 40], // starting center
            projection: 'albers'
        });

        // load data and add as layer
        async function geojsonFetch() {
            let response = await fetch('assets/us-covid-2020-rates.json');
            let covid_rates = await response.json();

            map.on('load', function loadingData() {
                map.addSource('covid_rates', {
                    type: 'geojson',
                    data: covid_rates
                });

                map.addLayer({
                    'id': 'covid_rates_layer',
                    'type': 'fill',
                    'source': 'covid_rates',
                    'paint': {
                        'fill-color': [
                            'step',
                            ['get', 'rates'],
                            '#FFEDA0',   // stop_output_0
                            10,          // stop_input_0
                            '#FED976',   // stop_output_1
                            20,          // stop_input_1
                            '#FEB24C',   // stop_output_2
                            50,          // stop_input_2
                            '#FD8D3C',   // stop_output_3
                            100,         // stop_input_3
                            '#FC4E2A',   // stop_output_4
                            200,         // stop_input_4
                            '#E31A1C',   // stop_output_5
                            500,         // stop_input_5
                            '#BD0026',   // stop_output_6
                            1000,        // stop_input_6
                            "#800026"    // stop_output_7
                        ],
                        'fill-outline-color': '#BBBBBB',
                        'fill-opacity': 0.7,
                    }
                });

                const layers = [
                    '0',
                    '1-10',
                    '11-50',
                    '51-100',
                    '100-150',
                    '150-200',
                    '200-300',
                    '300 and more'
                ];
                const colors = [
                    '#FFEDA070',
                    '#FED97670',
                    '#FEB24C70',
                    '#FD8D3C70',
                    '#FC4E2A70',
                    '#E31A1C70',
                    '#BD002670',
                    '#80002670'
                ];

                // create legend
                const legend = document.getElementById('legend');
                const source =
                    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NYTimes</a></p>';

                legend.innerHTML = "<b>Rate per 1000 Residents<br>(people/sq.mi.)</b><br><br>" + source;


                layers.forEach((layer, i) => {
                    const color = colors[i];
                    const item = document.createElement('div');
                    const key = document.createElement('span');
                    key.className = 'legend-key';
                    key.style.backgroundColor = color;

                    const value = document.createElement('span');
                    value.innerHTML = `${layer}`;
                    item.appendChild(key);
                    item.appendChild(value);
                    legend.appendChild(item);
                });
            });

            map.on('mousemove', ({point}) => {
                const state = map.queryRenderedFeatures(point, {
                    layers: ['covid_rates_layer']
                });
                document.getElementById('text-description').innerHTML = state.length ?
                    `<h3>${state[0].properties.state}</h3><p><strong><em>${state[0].properties.rates}</strong> per 1000 residents</em></p>` :
                    `<p>Hover over a state!</p>`;
            });
        }

        // Call the function to fetch GeoJSON data and load the map
        geojsonFetch();