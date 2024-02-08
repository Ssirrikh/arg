
// weather forecast and geolocation kindly provided by Open-Meteo: https://open-meteo.com/
    // API is open-source at https://github.com/open-meteo/open-meteo
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
// snapshot taken at 22:52 on Feb 7, 2024 for Clovis,CA
const locSearchStub = '{"results":[{"id":5338122,"name":"Clovis","latitude":36.82523,"longitude":-119.70292,"elevation":110.0,"feature_code":"PPL","country_code":"US","admin1_id":5332921,"admin2_id":5350964,"timezone":"America/Los_Angeles","population":104180,"postcodes":["93611","93612","93613"],"country_id":6252001,"country":"United States","admin1":"California","admin2":"Fresno"},{"id":5462393,"name":"Clovis","latitude":34.4048,"longitude":-103.20523,"elevation":1301.0,"feature_code":"PPLA2","country_code":"US","admin1_id":5481136,"admin2_id":5464151,"timezone":"America/Denver","population":39480,"postcodes":["88101","88102"],"country_id":6252001,"country":"United States","admin1":"New Mexico","admin2":"Curry"},{"id":3466042,"name":"Clóvis","latitude":-17.1,"longitude":-40.63333,"elevation":336.0,"feature_code":"PPL","country_code":"BR","admin1_id":3457153,"admin2_id":6321166,"timezone":"America/Sao_Paulo","country_id":3469034,"country":"Brazil","admin1":"Minas Gerais","admin2":"Bertópolis"},{"id":4575072,"name":"Clovis Point","latitude":34.7326,"longitude":-82.95348,"elevation":262.0,"feature_code":"PPL","country_code":"US","admin1_id":4597040,"admin2_id":4589892,"timezone":"America/New_York","country_id":6252001,"country":"United States","admin1":"South Carolina","admin2":"Oconee"},{"id":7432833,"name":"Clovis Watta","latitude":7.4736,"longitude":80.2877,"elevation":97.0,"feature_code":"PPL","country_code":"LK","admin1_id":1232860,"admin2_id":1237978,"admin3_id":7432876,"admin4_id":7432837,"timezone":"Asia/Colombo","country_id":1227603,"country":"Sri Lanka","admin1":"North Western Province","admin2":"Kurunegala District","admin3":"Weerambugedera Division","admin4":"Madawala South"},{"id":5249036,"name":"Clovis Park","latitude":44.21693,"longitude":-88.42566,"elevation":230.0,"feature_code":"PRK","country_code":"US","admin1_id":5279468,"admin2_id":5279387,"timezone":"America/Chicago","country_id":6252001,"country":"United States","admin1":"Wisconsin","admin2":"Winnebago"},{"id":5338135,"name":"Clovis Rodeo Park","latitude":36.82134,"longitude":-119.69625,"elevation":110.0,"feature_code":"PRK","country_code":"US","admin1_id":5332921,"admin2_id":5350964,"timezone":"America/Los_Angeles","country_id":6252001,"country":"United States","admin1":"California","admin2":"Fresno"},{"id":5462401,"name":"Clovis Historical Marker","latitude":34.4048,"longitude":-103.20523,"elevation":1301.0,"feature_code":"PRK","country_code":"US","admin1_id":5481136,"admin2_id":5464151,"timezone":"America/Denver","country_id":6252001,"country":"United States","admin1":"New Mexico","admin2":"Curry"},{"id":5462403,"name":"Clovis Municipal Airport","latitude":34.42646,"longitude":-103.07828,"elevation":1281.0,"feature_code":"AIRP","country_code":"US","admin1_id":5481136,"admin2_id":5464151,"timezone":"America/Denver","country_id":6252001,"country":"United States","admin1":"New Mexico","admin2":"Curry"}],"generationtime_ms":0.4720688}';
const weatherStub = '{"latitude":36.825104,"longitude":-119.68613,"generationtime_ms":0.1430511474609375,"utc_offset_seconds":-28800,"timezone":"America/Los_Angeles","timezone_abbreviation":"PST","elevation":111,"current_units":{"time":"iso8601","interval":"seconds","temperature_2m":"°C","apparent_temperature":"°C","precipitation":"mm","weather_code":"wmo code","wind_speed_10m":"km/h","wind_direction_10m":"°"},"current":{"time":"2024-02-07T22:45","interval":900,"temperature_2m":7.2,"apparent_temperature":5.6,"precipitation":0,"weather_code":3,"wind_speed_10m":4.5,"wind_direction_10m":209},"hourly_units":{"time":"iso8601","temperature_2m":"°C"},"hourly":{"time":["2024-02-07T00:00","2024-02-07T01:00","2024-02-07T02:00","2024-02-07T03:00","2024-02-07T04:00","2024-02-07T05:00","2024-02-07T06:00","2024-02-07T07:00","2024-02-07T08:00","2024-02-07T09:00","2024-02-07T10:00","2024-02-07T11:00","2024-02-07T12:00","2024-02-07T13:00","2024-02-07T14:00","2024-02-07T15:00","2024-02-07T16:00","2024-02-07T17:00","2024-02-07T18:00","2024-02-07T19:00","2024-02-07T20:00","2024-02-07T21:00","2024-02-07T22:00","2024-02-07T23:00","2024-02-08T00:00","2024-02-08T01:00","2024-02-08T02:00","2024-02-08T03:00","2024-02-08T04:00","2024-02-08T05:00","2024-02-08T06:00","2024-02-08T07:00","2024-02-08T08:00","2024-02-08T09:00","2024-02-08T10:00","2024-02-08T11:00","2024-02-08T12:00","2024-02-08T13:00","2024-02-08T14:00","2024-02-08T15:00","2024-02-08T16:00","2024-02-08T17:00","2024-02-08T18:00","2024-02-08T19:00","2024-02-08T20:00","2024-02-08T21:00","2024-02-08T22:00","2024-02-08T23:00","2024-02-09T00:00","2024-02-09T01:00","2024-02-09T02:00","2024-02-09T03:00","2024-02-09T04:00","2024-02-09T05:00","2024-02-09T06:00","2024-02-09T07:00","2024-02-09T08:00","2024-02-09T09:00","2024-02-09T10:00","2024-02-09T11:00","2024-02-09T12:00","2024-02-09T13:00","2024-02-09T14:00","2024-02-09T15:00","2024-02-09T16:00","2024-02-09T17:00","2024-02-09T18:00","2024-02-09T19:00","2024-02-09T20:00","2024-02-09T21:00","2024-02-09T22:00","2024-02-09T23:00","2024-02-10T00:00","2024-02-10T01:00","2024-02-10T02:00","2024-02-10T03:00","2024-02-10T04:00","2024-02-10T05:00","2024-02-10T06:00","2024-02-10T07:00","2024-02-10T08:00","2024-02-10T09:00","2024-02-10T10:00","2024-02-10T11:00","2024-02-10T12:00","2024-02-10T13:00","2024-02-10T14:00","2024-02-10T15:00","2024-02-10T16:00","2024-02-10T17:00","2024-02-10T18:00","2024-02-10T19:00","2024-02-10T20:00","2024-02-10T21:00","2024-02-10T22:00","2024-02-10T23:00","2024-02-11T00:00","2024-02-11T01:00","2024-02-11T02:00","2024-02-11T03:00","2024-02-11T04:00","2024-02-11T05:00","2024-02-11T06:00","2024-02-11T07:00","2024-02-11T08:00","2024-02-11T09:00","2024-02-11T10:00","2024-02-11T11:00","2024-02-11T12:00","2024-02-11T13:00","2024-02-11T14:00","2024-02-11T15:00","2024-02-11T16:00","2024-02-11T17:00","2024-02-11T18:00","2024-02-11T19:00","2024-02-11T20:00","2024-02-11T21:00","2024-02-11T22:00","2024-02-11T23:00","2024-02-12T00:00","2024-02-12T01:00","2024-02-12T02:00","2024-02-12T03:00","2024-02-12T04:00","2024-02-12T05:00","2024-02-12T06:00","2024-02-12T07:00","2024-02-12T08:00","2024-02-12T09:00","2024-02-12T10:00","2024-02-12T11:00","2024-02-12T12:00","2024-02-12T13:00","2024-02-12T14:00","2024-02-12T15:00","2024-02-12T16:00","2024-02-12T17:00","2024-02-12T18:00","2024-02-12T19:00","2024-02-12T20:00","2024-02-12T21:00","2024-02-12T22:00","2024-02-12T23:00","2024-02-13T00:00","2024-02-13T01:00","2024-02-13T02:00","2024-02-13T03:00","2024-02-13T04:00","2024-02-13T05:00","2024-02-13T06:00","2024-02-13T07:00","2024-02-13T08:00","2024-02-13T09:00","2024-02-13T10:00","2024-02-13T11:00","2024-02-13T12:00","2024-02-13T13:00","2024-02-13T14:00","2024-02-13T15:00","2024-02-13T16:00","2024-02-13T17:00","2024-02-13T18:00","2024-02-13T19:00","2024-02-13T20:00","2024-02-13T21:00","2024-02-13T22:00","2024-02-13T23:00"],"temperature_2m":[7.9,7.7,8.4,8.7,8.1,8.2,7.5,7.1,8.4,10.2,11,11.9,12.3,12.1,11.9,12,10.7,9,8,7.8,8,7.4,7.2,7,6.8,6.3,5.6,5.3,4.9,4.5,4.3,4.2,5.4,6.9,7.9,8.2,8.9,9,9.1,9,9.7,9,7.9,7.9,7.5,6.7,6.8,6,5.3,5.5,6,6.3,5.1,4.4,3.9,3.4,4.4,6.8,8.8,9.9,10.5,11,11.3,11.3,11,10.3,9.9,9.5,9,8.5,8,7.5,6.8,5.9,5.4,5.1,4.8,4.5,4.3,4.1,5.2,6.9,8.5,9.9,11.2,12.1,12.6,12.9,12.7,11.6,10,9.4,8.8,8.2,7.6,7,6.6,6.3,6,5.8,5.6,5.4,5.3,5.2,6.9,8.7,10.4,11.9,13,14,14.7,14.8,14.5,13.4,11.7,10.8,9.8,9.1,8.7,8.5,8.1,7.8,7.3,7,6.7,6.5,6.3,6,7.8,9.3,11,12.6,14,15,15.5,15.6,15.3,14.2,12.7,11.4,10.7,10.2,9.7,9.4,9.1,8.8,8.6,8.4,8.1,7.6,7.1,7.3,8.6,10.5,12.3,13.7,14.9,15.8,16.4,16.7,16.5,15.6,14.3,13,12,11.1,10.4,10]},"daily_units":{"time":"iso8601","temperature_2m_max":"°C","temperature_2m_min":"°C","sunrise":"iso8601","sunset":"iso8601"},"daily":{"time":["2024-02-07","2024-02-08","2024-02-09","2024-02-10","2024-02-11","2024-02-12","2024-02-13"],"temperature_2m_max":[12.3,9.7,11.3,12.9,14.8,15.6,16.7],"temperature_2m_min":[7,4.2,3.4,4.1,5.2,6,7.1],"sunrise":["2024-02-07T06:55","2024-02-08T06:54","2024-02-09T06:53","2024-02-10T06:52","2024-02-11T06:51","2024-02-12T06:50","2024-02-13T06:49"],"sunset":["2024-02-07T17:30","2024-02-08T17:31","2024-02-09T17:32","2024-02-10T17:33","2024-02-11T17:34","2024-02-12T17:35","2024-02-13T17:36"]}}';
// second snapshot taken for Los Angeles, CA
// const locSearchStub = '{"results":[{"id":5368361,"name":"Los Angeles","latitude":34.05223,"longitude":-118.24368,"elevation":89.0,"feature_code":"PPLA2","country_code":"US","admin1_id":5332921,"admin2_id":5368381,"timezone":"America/Los_Angeles","population":3971883,"postcodes":["90001","90002","90003","90004","90005","90006","90007","90008","90009","90010","90011","90012","90013","90014","90015","90016","90017","90018","90019","90020","90021","90022","90023","90024","90025","90026","90027","90028","90029","90030","90031","90032","90033","90034","90035","90036","90037","90038","90039","90040","90041","90042","90043","90044","90045","90046","90047","90048","90049","90050","90051","90052","90053","90054","90055","90056","90057","90058","90059","90060","90061","90062","90063","90064","90065","90066","90067","90068","90070","90071","90072","90073","90074","90075","90076","90077","90078","90079","90080","90081","90082","90083","90084","90086","90087","90088","90089","90091","90093","90095","90096","90099"],"country_id":6252001,"country":"United States","admin1":"California","admin2":"Los Angeles"},{"id":3882428,"name":"Los Ángeles","latitude":-37.46973,"longitude":-72.35366,"elevation":141.0,"feature_code":"PPLA2","country_code":"CL","admin1_id":3898380,"admin2_id":3898381,"admin3_id":8261144,"timezone":"America/Santiago","population":125430,"country_id":3895114,"country":"Chile","admin1":"Región del Biobío","admin2":"Provincia de Biobío","admin3":"Los Angeles"},{"id":3705544,"name":"Los Ángeles","latitude":7.88463,"longitude":-80.35497,"elevation":35.0,"feature_code":"PPLA3","country_code":"PA","admin1_id":3704961,"admin2_id":3704962,"admin3_id":3705540,"timezone":"America/Panama","population":342,"country_id":3703430,"country":"Panama","admin1":"Provincia de Los Santos","admin2":"Los Santos District","admin3":"Corregimiento Los Ángeles"},{"id":3705542,"name":"Los Ángeles","latitude":8.52571,"longitude":-82.20286,"elevation":358.0,"feature_code":"PPLA3","country_code":"PA","admin1_id":3712410,"admin2_id":3708946,"admin3_id":3705539,"timezone":"America/Panama","population":250,"country_id":3703430,"country":"Panama","admin1":"Provincia de Chiriquí","admin2":"Gualaca District","admin3":"Corregimiento Los Ángeles"},{"id":3998147,"name":"Los Angeles","latitude":25.60289,"longitude":-108.48095,"elevation":22.0,"feature_code":"PPL","country_code":"MX","admin1_id":3983035,"admin2_id":8582651,"timezone":"America/Mazatlan","population":4217,"country_id":3996063,"country":"Mexico","admin1":"Sinaloa","admin2":"Guasave"},{"id":1705545,"name":"Los Angeles","latitude":9.0125,"longitude":125.60806,"elevation":16.0,"feature_code":"PPL","country_code":"PH","admin1_id":7521299,"admin3_id":1722183,"timezone":"Asia/Manila","population":4054,"country_id":1694008,"country":"Philippines","admin1":"Caraga","admin3":"Butuan City"},{"id":8858843,"name":"Los Ángeles","latitude":20.55361,"longitude":-100.94167,"elevation":1746.0,"feature_code":"PPL","country_code":"MX","admin1_id":4005267,"admin2_id":8581938,"timezone":"America/Mexico_City","population":1780,"country_id":3996063,"country":"Mexico","admin1":"Guanajuato","admin2":"Villagrán"},{"id":3998148,"name":"Los Angeles","latitude":25.52206,"longitude":-103.56757,"elevation":1147.0,"feature_code":"PPL","country_code":"MX","admin1_id":4011741,"admin2_id":8581867,"timezone":"America/Monterrey","population":1616,"country_id":3996063,"country":"Mexico","admin1":"Durango","admin2":"Lerdo"},{"id":3801497,"name":"Los Ángeles","latitude":17.39485,"longitude":-95.1654,"elevation":46.0,"feature_code":"PPL","country_code":"MX","admin1_id":3522509,"admin2_id":8582528,"timezone":"America/Mexico_City","population":1144,"country_id":3996063,"country":"Mexico","admin1":"Oaxaca","admin2":"Matías Romero Avendaño"},{"id":3978270,"name":"Los Ángeles","latitude":23.9433,"longitude":-104.13116,"elevation":1870.0,"feature_code":"PPL","country_code":"MX","admin1_id":4011741,"admin2_id":8581877,"timezone":"America/Monterrey","population":903,"country_id":3996063,"country":"Mexico","admin1":"Durango","admin2":"Poanas"}],"generationtime_ms":1.4909506}';

//////////////////////

const useLiveWeather = false; // set false during dev to avoid overtaxing API

let weatherSettings = {
	location : 'Clovis',
	lat : 36.8252,
	lon : -119.7029,
    timezone : 'America/Los_Angeles',
	current : ['temperature_2m','apparent_temperature','precipitation','weather_code','wind_speed_10m','wind_direction_10m'],
	hourly : ['temperature_2m'],
    daily : ['temperature_2m_max','temperature_2m_min','sunrise','sunset']
};

////////////////////////

// note: fetch() is native to browsers, but not to node.js
    // to install, run "npm install node-fetch" and declare "const fetch = require("node-fetch");"

let locSearch;
let geoloc;
let weather;

async function fetchLocationSearch (locFrag, onFetch = (res)=>{}) { // do not call every tick!!!
	const t0_loc = performance.now();
	console.log('Fetching weather forecast from Open-Meteo...');

    const base = 'https://geocoding-api.open-meteo.com/v1/search?count=10&name=' + locFrag;

    fetch(base)
        .then(res => res.json())
        .then(data => {
            locSearch = data;
            console.log('Fetched weather in ' + Math.floor(performance.now()-t0_loc) + 'ms. (' + (data.generationtime_ms).toFixed(3) + 'ms server-side, ' + (performance.now()-t0_loc-data.generationtime_ms).toFixed(3) + 'ms round-trip)');
            onFetch(locSearch);
        });
}
async function fetchWeather (onFetch = (res)=>{}) { // do not call every tick!!!
	const t0_weather = performance.now();
	console.log('Fetching weather forecast from Open-Meteo...');

	const base = 'https://api.open-meteo.com/v1/forecast?past_days=0&latitude='+weatherSettings.lat+'&longitude='+weatherSettings.lon;
    const timezone = 'timezone='+weatherSettings.timezone;
	const current = 'current='+weatherSettings.current.join(',');
	const hourly = 'hourly='+weatherSettings.hourly.join(',');
	const daily = 'daily='+weatherSettings.daily.join(',');

    fetch(base + '&' + timezone + '&' + current + '&' + hourly + '&' + daily)
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
    console.log('Loading snapshot of geolocation search...');
    locSearch = JSON.parse(locSearchStub);
    console.log(locSearch);
    console.log('Auto-selecting coordinates of first match...');
    geoloc = JSON.parse(locSearchStub).results[0];
    console.log(geoloc);
    console.log('Loading snapshot of weather...');
    weather = JSON.parse(weatherStub);
    console.log(weather);
}

////////////////////////

class WeatherAccess {
    constructor () {
        //
    }
    get location () { return geoloc.name; }
    get lat () { return geoloc.latitude; }
    get lon () { return geoloc.longitude; }
    get condition () { return WMO_SIMPLIFIED_CODES[weather.current.weather_code]; }
    get temperature () { return weather.current.temperature_2m; }
    get temperatureF () { return weather.current.temperature_2m * 9/5 + 32; }
    get apparent () { return weather.current.apparent_temperature; }
    get apparentF () { return weather.current.apparent_temperature * 9/5 + 32; }
    get hi () { return weather.daily.temperature_2m_max[0]; }
    get hiF () { return weather.daily.temperature_2m_max[0] * 9/5 + 32; }
    get lo () { return weather.daily.temperature_2m_min[0]; }
    get loF () { return weather.daily.temperature_2m_min[0] * 9/5 + 32; }
}

let weatherAccess = new WeatherAccess();

