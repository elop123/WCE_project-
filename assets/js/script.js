//* START OF GREEN CHECK

const apiUrlGreenCheck = 'https://admin.thegreenwebfoundation.org/api/v3/greencheck/';

document.addEventListener('DOMContentLoaded', function() {
    const greenCheckButton = document.getElementById('greenCheckButton');
    const apiResultDiv = document.getElementById('api-result');

    greenCheckButton.addEventListener('click', function(event) {
        const websiteUrl = document.getElementById('website-url').value.trim();

        fetch(`${apiUrlGreenCheck}${encodeURIComponent(websiteUrl)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Green Check API Response:', data);
                displayGreenCheckResult(data);
            })
            .catch(error => {
                console.error('Error fetching green check data:', error);
                displayGreenCheckError(error.message);
            });
    });

    function displayGreenCheckResult(data) {
        if (data.green) {
            apiResultDiv.innerHTML = `<p style="color: #FFFFFF; font-size: 1.2rem;">${data.url} is hosted on green energy.</p>`;
        } else {
            apiResultDiv.innerHTML = `<p style="color: red; font-size: 1.2rem;">${data.url} is not hosted on green energy.</p>`;
        }
    }

    function displayGreenCheckError(message) {
        apiResultDiv.innerHTML = `<p style="color: red;">Error: ${message}</p>`;
    }
});
//*END OF GREEN CHECK

//*START OF CO2 INTENSITY CALCULATION

document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculateButton');
    const co2IntensityResultDiv = document.getElementById('co2IntensityResult');

    calculateButton.addEventListener('click', () => {
        const websiteUrl = document.getElementById('website').value.trim();

        fetch(`https://dns.google/resolve?name=${encodeURIComponent(websiteUrl)}`)
            .then(response => response.json())
            .then(data => {
                if (!data.Answer || data.Answer.length === 0) {
                    throw new Error('No IP address found for this URL.');
                }
                const ipAddress = data.Answer.find(record => record.type === 1).data;
                return fetch(`https://admin.thegreenwebfoundation.org/api/v3/ip-to-co2intensity/${encodeURIComponent(ipAddress)}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('CO2 Intensity API Response:', data);
                
                if (!data || !data.carbon_intensity || !data.carbon_intensity_type) {
                    throw new Error('Invalid or incomplete CO2 intensity data received.');
                }

                const carbonIntensity = data.carbon_intensity;
                const carbonIntensityType = data.carbon_intensity_type;
                
                let intensityDescription = '';
                switch (carbonIntensityType) {
                    case 'avg':
                        intensityDescription = 'Average';
                        break;
                    case 'high':
                        intensityDescription = 'High';
                        break;
                    case 'low':
                        intensityDescription = 'Low';
                        break;
                    default:
                        intensityDescription = 'Unknown';
                        break;
                }

                co2IntensityResultDiv.innerHTML = `<p style="color: #006769; font-size: 1.2rem;">The CO2 intensity for ${websiteUrl} is ${carbonIntensity} grams of CO2 per kWh (${intensityDescription} intensity).</p>`;
            })
            .catch(error => {
                co2IntensityResultDiv.innerHTML = `<p style="color: red; font-size: 1.2rem;">Error: ${error.message}</p>`;
            });
    });
});

//* END OF CO2 INTENSITY CALCULATION