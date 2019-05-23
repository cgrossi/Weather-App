window.addEventListener('load', () => {
        let long;
        let lat;

        // DOM Elements
        const timezone = document.querySelector('.location-name');
        const temp = document.querySelector('.temperature-degree');
        const tempDesc = document.querySelector('.temperature-description');
        const degreeSection = document.querySelector('.degree-section');
        const degreeUnit = document.querySelector('.temperature-degree-unit');

        // Convert temp functions
        const convertToCelsius = tempF => {
                if (typeof tempF === 'string') {
                        return Math.round((+tempF - 32) * (5 / 9));
                }
                return Math.round((tempF - 32) * (5 / 9));
        };

        const convertToFahrenheit = tempC => {
                if (typeof tempC === 'string') {
                        return Math.round(+tempC * (9 / 5) + 32);
                }
                return Math.round(tempC * (9 / 5) + 32);
        };

        // API Call
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                        long = position.coords.longitude;
                        lat = position.coords.latitude;

                        const proxy = 'https://cors-anywhere.herokuapp.com/';
                        const api = `${proxy}https://api.darksky.net/forecast/07adfcca545054047deac0a9d034860d/${lat},${long}`;

                        fetch(api)
                                .then(response => response.json())
                                .then(data => {
                                        const { icon } = data.currently;

                                        // Set DOM El
                                        tempDesc.textContent = `${data.daily.summary}`;
                                        temp.textContent = `${Math.round(data.currently.temperature)}`;
                                        timezone.textContent = `${data.timezone}`;

                                        // Set Icon
                                        setIcons(icon, document.querySelector('.icon'));
                                });
                });
        } else {
                alert(
                        `This weather app needs your current location to get your weather data. Please reset and allow location. Otherwise, no weather for you.`
                );
        }

        // Convert temp event
        degreeSection.addEventListener('click', () => {
                if (degreeUnit.textContent === 'F') {
                        const tempC = convertToCelsius(temp.textContent);
                        degreeUnit.textContent = 'C';
                        temp.textContent = tempC;

                        // ----Not Working Yet. Search weather description for temp and replace with converted (doesn't handle negative numbers properly) ------//
                        // const tempDescTemp = tempDesc.textContent.match(/[\d]+/)[0];
                        // tempDesc.textContent = tempDesc.textContent.replace(/[\d]+/, convertToCelsius(tempDescTemp));
                        // const indexDegree = tempDesc.textContent.match(/\u00B0/).index + 1;
                        // const arraySwitch = tempDesc.textContent.split('');
                        // arraySwitch[indexDegree] = 'C';
                        // tempDesc.textContent = arraySwitch.join('');
                } else {
                        const tempF = convertToFahrenheit(temp.textContent);
                        degreeUnit.textContent = 'F';
                        temp.textContent = tempF;

                        // -----Not Working. Same as above.----//
                        // const tempDescTemp = tempDesc.textContent.match(/[\d]+/)[0];
                        // tempDesc.textContent = tempDesc.textContent.replace(/[\d]+/, convertToCelsius(tempDescTemp));
                        // const indexDegree = tempDesc.textContent.match(/\u00B0/).index + 1;
                        // const arraySwitch = tempDesc.textContent.split('');
                        // arraySwitch[indexDegree] = 'F';
                        // tempDesc.textContent = arraySwitch.join('');
                }
        });

        function setIcons(icon, iconID) {
                const skycons = new Skycons({ color: 'white' });
                const currentIcon = icon.replace(/-/g, '_').toUpperCase();
                skycons.play();
                return skycons.set(iconID, Skycons[currentIcon]);
        }
});
