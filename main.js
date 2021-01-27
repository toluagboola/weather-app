const svg = document.querySelectorAll('svg');
const form = document.querySelector('.js-form');
const spinner = document.querySelector('.js-spinner');
let unit = "standard";

form.addEventListener('submit', handleSubmit);
window.addEventListener('load', handleLoad);

function handleLoad() {
	const radioBtns = document.getElementsByName('unit');
	radioBtns.forEach(async (btn) => {
		if (btn.checked) {
			unit = btn.value;
		}
		console.log(unit);
	});
}

async function fetchWeatherByCoords(position) {
	const { longitude, latitude } = position.coords;
	try {
		const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=d4e29d903803da845f10013f231c089d`;
		const response = await fetch(endpoint);

		if (!response.ok) {
			throw Error(response.statusText);
		}
		
		const json = await response.json();
		displayResults(json);
	} catch(err) {
		console.log(err);
	 	alert('Failed to get your location. Try to search instead.');
	}
}

function errorCallback(err) {
	console.log(err)
}

function getCoord() {
	if (window.navigator.geolocation) {
		window.navigator.geolocation.getCurrentPosition(fetchWeatherByCoords, errorCallback)
	 } else {
		 alert('Location not found.');
	 }
}

getCoord();

async function handleSubmit(event) {
	event.preventDefault();
	const inputValue = document.querySelector('.js-input').value;
	const searchQuery = inputValue.trim();
	const radioBtns = document.getElementsByName('unit');
	console.log(radioBtns);

	radioBtns.forEach(async (btn) => {
		if (btn.checked) {
			unit = btn.value;
		}
		console.log(unit);
	} );

  spinner.classList.remove('hidden');

	try {
		const results = await fetchWeatherByCity(searchQuery, unit);
		console.log(results);
		displayResults(results);
	} catch(err) {
		console.log(err);
		alert('Failed to load results.');
	} finally {
		spinner.classList.add('hidden');
	}
} 

// Fetch weather by city name entered by user

async function fetchWeatherByCity(city, unit = "standard") {
	const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=d4e29d903803da845f10013f231c089d`;
	const response = await fetch(endpoint);

	if (!response.ok) {
		throw Error(response.statusText);
	}

	const json = await response.json();
	return json;
}

// Display results on the page

function displayResults(json) {
	const temp = document.querySelector('.js-temp');
	if (unit === "standard") {
		temp.innerHTML = json.main.temp + 'K';
	} else if (unit === "metric") {
		temp.innerHTML = json.main.temp  + '&#176;C';
	} else if (unit === 'imperial') {
		temp.innerHTML = json.main.temp  + 'F';
	}

	let cityName = document.querySelector('.js-city-name');
	cityName.textContent = json.name;


	const description = document.querySelector('.js-description');
	jsonDescription = json.weather[0].description;
	description.textContent = jsonDescription;
	svg.forEach(hideIcons);
	const icon = document.querySelector(`.js-${json.weather[0].main.toLowerCase()}`);
	if (icon) {
		icon.classList.remove('hidden');
	}	
}

function hideIcons(svg) {
	svg.classList.add('hidden');
}
