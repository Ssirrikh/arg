
// weather forecast kindly provided by Open-Meteo: https://open-meteo.com/
    // API is open-source at https://github.com/open-meteo/open-meteo
    // 10,000 calls per day free, or purchase a monthly subscription
// TODO
    // integrate air quality: https://open-meteo.com/en/docs/air-quality-api
    // integrate elevation mapping: https://open-meteo.com/en/docs/elevation-api

// Open-Meteo only supports a subset of WMO codes
// see full list of codes at: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
const WMO_WEATHER_INTERPRETATION_CODES = Object.freeze({
    '0' : 'Clear',
    '1' : 'Mostly Clear',
    '2' : 'Partly Cloudy',
    '3' : 'Overcast',

    '45' : 'Fog',
    '48' : 'Rime Fog',

    '51' : 'Light Drizzle',
    '53' : 'Drizzle',
    '55' : 'Heavy Drizzle',
    '56' : 'Light Freezing Drizzle',
    '57' : 'Freezing Drizzle',

    '61' : 'Light Rain',
    '63' : 'Rain',
    '65' : 'Heavy Rain',
    '66' : 'Freezing Rain',
    '67' : 'Heavy Freezing Rain',

    '71' : 'Light Snow',
    '73' : 'Snow',
    '75' : 'Heavy Snow',
    '77' : 'Snow Grains', // like a drizzle, but for snow

    '80' : 'Light Showers', // on-and-off rain
    '81' : 'Showers',
    '82' : 'Heavy Showers',

    '85' : 'Snow Showers', // on-and-off snow
    '86' : 'Heavy Snow Showers',

    '95' : 'Thunderstorm',
    '96' : 'Thundering Hailstorm',
    '99' : 'Heavy Thundering Hailstorm'
});
const WMO_SIMPLIFIED_CODES = Object.freeze({
    '0' : 'Clear',
    '1' : 'Mostly Clear',
    '2' : 'Partly Cloudy',
    '3' : 'Overcast',

    '45' : 'Fog',
    '48' : 'Freezing Fog',

    '51' : 'Light Drizzle',
    '53' : 'Drizzle',
    '55' : 'Drizzle',
    '56' : 'Freezing Drizzle',
    '57' : 'Freezing Drizzle',

    '61' : 'Light Rain',
    '63' : 'Rain',
    '65' : 'Heavy Rain',
    '66' : 'Freezing Rain',
    '67' : 'Heavy Freezing Rain',

    '71' : 'Light Snow',
    '73' : 'Snow',
    '75' : 'Heavy Snow',
    '77' : 'Light Snow',

    '80' : 'Light Showers', // on-and-off rain
    '81' : 'Showers',
    '82' : 'Heavy Showers',

    '85' : 'Snow Showers', // on-and-off snow
    '86' : 'Heavy Snow Showers',

    '95' : 'Thunderstorm',
    '96' : 'Thundering Hailstorm',
    '99' : 'Thundering Hailstorm'
});
const WMO_MINIMAL_CODES = Object.freeze({
    '0' : 'Clear',
    '1' : 'Mostly Clear',
    '2' : 'Partly Cloudy',
    '3' : 'Overcast',

    '45' : 'Fog',
    '48' : 'Fog',

    '51' : 'Drizzle',
    '53' : 'Drizzle',
    '55' : 'Drizzle',
    '56' : 'Freezing Drizzle',
    '57' : 'Freezing Drizzle',

    '61' : 'Rain',
    '63' : 'Rain',
    '65' : 'Rain',
    '66' : 'Freezing Rain',
    '67' : 'Freezing Rain',

    '71' : 'Snow',
    '73' : 'Snow',
    '75' : 'Snow',
    '77' : 'Snow',

    '80' : 'Showers',
    '81' : 'Showers',
    '82' : 'Showers',

    '85' : 'Snow Showers',
    '86' : 'Snow Showers',

    '95' : 'Thunderstorm',
    '96' : 'Thundering Hailstorm',
    '99' : 'Thundering Hailstorm'
});

// use weatherStub for dev to avoid overtaxing API
// snapshot taken at 23:45 on Feb 7, 2024 for Clovis,CA
const weatherStub = '{"latitude":36.825104,"longitude":-119.68613,"generationtime_ms":0.19800662994384766,"utc_offset_seconds":0,"timezone":"GMT","timezone_abbreviation":"GMT","elevation":111,"current_units":{"time":"iso8601","interval":"seconds","temperature_2m":"°C","apparent_temperature":"°C","precipitation":"mm","weather_code":"wmo code","wind_speed_10m":"km/h","wind_direction_10m":"°"},"current":{"time":"2024-02-07T07:45","interval":900,"temperature_2m":7.7,"apparent_temperature":6.2,"precipitation":0,"weather_code":3,"wind_speed_10m":3.1,"wind_direction_10m":315},"hourly_units":{"time":"iso8601","temperature_2m":"°C"},"hourly":{"time":["2024-02-07T00:00","2024-02-07T01:00","2024-02-07T02:00","2024-02-07T03:00","2024-02-07T04:00","2024-02-07T05:00","2024-02-07T06:00","2024-02-07T07:00","2024-02-07T08:00","2024-02-07T09:00","2024-02-07T10:00","2024-02-07T11:00","2024-02-07T12:00","2024-02-07T13:00","2024-02-07T14:00","2024-02-07T15:00","2024-02-07T16:00","2024-02-07T17:00","2024-02-07T18:00","2024-02-07T19:00","2024-02-07T20:00","2024-02-07T21:00","2024-02-07T22:00","2024-02-07T23:00","2024-02-08T00:00","2024-02-08T01:00","2024-02-08T02:00","2024-02-08T03:00","2024-02-08T04:00","2024-02-08T05:00","2024-02-08T06:00","2024-02-08T07:00","2024-02-08T08:00","2024-02-08T09:00","2024-02-08T10:00","2024-02-08T11:00","2024-02-08T12:00","2024-02-08T13:00","2024-02-08T14:00","2024-02-08T15:00","2024-02-08T16:00","2024-02-08T17:00","2024-02-08T18:00","2024-02-08T19:00","2024-02-08T20:00","2024-02-08T21:00","2024-02-08T22:00","2024-02-08T23:00","2024-02-09T00:00","2024-02-09T01:00","2024-02-09T02:00","2024-02-09T03:00","2024-02-09T04:00","2024-02-09T05:00","2024-02-09T06:00","2024-02-09T07:00","2024-02-09T08:00","2024-02-09T09:00","2024-02-09T10:00","2024-02-09T11:00","2024-02-09T12:00","2024-02-09T13:00","2024-02-09T14:00","2024-02-09T15:00","2024-02-09T16:00","2024-02-09T17:00","2024-02-09T18:00","2024-02-09T19:00","2024-02-09T20:00","2024-02-09T21:00","2024-02-09T22:00","2024-02-09T23:00","2024-02-10T00:00","2024-02-10T01:00","2024-02-10T02:00","2024-02-10T03:00","2024-02-10T04:00","2024-02-10T05:00","2024-02-10T06:00","2024-02-10T07:00","2024-02-10T08:00","2024-02-10T09:00","2024-02-10T10:00","2024-02-10T11:00","2024-02-10T12:00","2024-02-10T13:00","2024-02-10T14:00","2024-02-10T15:00","2024-02-10T16:00","2024-02-10T17:00","2024-02-10T18:00","2024-02-10T19:00","2024-02-10T20:00","2024-02-10T21:00","2024-02-10T22:00","2024-02-10T23:00","2024-02-11T00:00","2024-02-11T01:00","2024-02-11T02:00","2024-02-11T03:00","2024-02-11T04:00","2024-02-11T05:00","2024-02-11T06:00","2024-02-11T07:00","2024-02-11T08:00","2024-02-11T09:00","2024-02-11T10:00","2024-02-11T11:00","2024-02-11T12:00","2024-02-11T13:00","2024-02-11T14:00","2024-02-11T15:00","2024-02-11T16:00","2024-02-11T17:00","2024-02-11T18:00","2024-02-11T19:00","2024-02-11T20:00","2024-02-11T21:00","2024-02-11T22:00","2024-02-11T23:00","2024-02-12T00:00","2024-02-12T01:00","2024-02-12T02:00","2024-02-12T03:00","2024-02-12T04:00","2024-02-12T05:00","2024-02-12T06:00","2024-02-12T07:00","2024-02-12T08:00","2024-02-12T09:00","2024-02-12T10:00","2024-02-12T11:00","2024-02-12T12:00","2024-02-12T13:00","2024-02-12T14:00","2024-02-12T15:00","2024-02-12T16:00","2024-02-12T17:00","2024-02-12T18:00","2024-02-12T19:00","2024-02-12T20:00","2024-02-12T21:00","2024-02-12T22:00","2024-02-12T23:00","2024-02-13T00:00","2024-02-13T01:00","2024-02-13T02:00","2024-02-13T03:00","2024-02-13T04:00","2024-02-13T05:00","2024-02-13T06:00","2024-02-13T07:00","2024-02-13T08:00","2024-02-13T09:00","2024-02-13T10:00","2024-02-13T11:00","2024-02-13T12:00","2024-02-13T13:00","2024-02-13T14:00","2024-02-13T15:00","2024-02-13T16:00","2024-02-13T17:00","2024-02-13T18:00","2024-02-13T19:00","2024-02-13T20:00","2024-02-13T21:00","2024-02-13T22:00","2024-02-13T23:00"],"temperature_2m":[13,12.2,11.3,10.7,10.1,9.3,8.3,9,8.9,9,9,8.9,8.5,8.7,8.2,7.4,8.1,9,9.4,10.4,11.1,11.3,12.2,11.1,10.8,9,8.9,8.2,7.8,6.2,5.9,5.9,5.5,5.9,6,6,5.9,5.7,5.2,5,5.8,6.8,7.8,8.5,9.2,9.7,9.7,10.1,10.2,9.7,9.3,8.8,7.7,7.8,8.1,8.1,7.1,6.6,6.1,5.5,5,4.7,4.4,4,5.3,6.8,8.4,9.8,10.8,11.7,11.8,11.8,11.6,10.6,9.4,8.6,7.8,7.2,6.7,6.5,6.1,5.8,5.6,5.3,5.1,4.9,4.6,4.5,5.8,7.3,8.8,10.2,11.3,12.2,12.8,13,12.8,11.8,10.2,9.7,9.1,8.5,8,7.7,7.4,7.1,6.8,6.6,6.5,6.3,6.1,6,7.8,9.6,11.3,12.7,13.9,14.9,15.6,15.8,15.7,14.7,13.3,12.1,11.2,10.5,9.9,9.5,9.1,8.8,8.5,8.1,7.8,7.3,6.9,7,8.3,10.3,12,13.4,14.6,15.5,16,16.3,16,15.1,13.6,12.4,11.7,11.1,10.7,10.2,9.8,9.5,9.1,8.8,8.4,7.9,7.5,7.6,8.9,10.7,12.4,13.8,15,15.9,16.5,16.8]}}';

//////////////////////

const useLiveWeather = false; // set false during dev to avoid overtaxing API

const weatherSettings = {
	location : 'Clovis',
	lat : 36.8252,
	lon : -119.7029,
	current : ['temperature_2m','apparent_temperature','precipitation','weather_code','wind_speed_10m','wind_direction_10m'],
	hourly : ['temperature_2m']
};

////////////////////////

// note: fetch() is native to browsers, but not to node.js
    // to install, run "npm install node-fetch" and declare "const fetch = require("node-fetch");"

let weather;

async function fetchWeather (onFetch = ()=>{}) { // do not call every tick!!!
	const t0_weather = performance.now();
	console.log('Fetching weather forecast from Open-Meteo...');

	const base = 'https://api.open-meteo.com/v1/forecast?latitude='+weatherSettings.lat+'&longitude='+weatherSettings.lon;
	const current = 'current='+weatherSettings.current.join(',');
	const hourly = 'hourly='+weatherSettings.hourly.join(',');

    fetch(base + '&' + current + '&' + hourly)
        .then(res => res.json())
        .then(data => {
            weather = data;
            console.log('Fetched weather in ' + Math.floor(performance.now()-t0_weather) + 'ms. (' + (data.generationtime_ms).toFixed(3) + 'ms server-side, ' + (performance.now()-t0_weather-data.generationtime_ms).toFixed(3) + 'ms round-trip)');
            onFetch(weather);
        });
};

if (useLiveWeather) {
    fetchWeather(res => { console.log(res); });
} else {
    console.log('Loading weather snapshot...');
    weather = JSON.parse(weatherStub);
    console.log(weather);
}

