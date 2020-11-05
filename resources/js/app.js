/* ---------------------------------------------- */
/*            CODE EXPLAINED TUTORIALS            */
/*         www.youtube.com/CodeExplained          */
/* ---------------------------------------------- */
// SELECT ALL THE ELEMENTS
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");

const ctx = document.getElementById("axes_line_chart").getContext("2d");

//APP VARIABLES
let app_data = [],
	cases_list = [],
	recovered_list = [],
	deaths_list = [],
	dates = []

//GET USER'S COUNTRY CODE
let country_code = geoplugin_countryCode();
let user_country;
country_list.forEach( country => {
	if( country.code == country_code){
		user_country = country.name;
	}
});

/* ---------------------------------------------- */
/*                API URL AND KEY                 */
/* ---------------------------------------------- */

function fetchData(user_country){
	country_name_element.innerHTML = "Loading...";
	cases_list = [], recovered_list = [], deaths_list = [], dates = [];
	fetch(`https://api.covid19api.com/total/dayone/country/${user_country}`)
	.then(response => {
		return response.json();
	}).then( data => {
		dates = Object.keys(data);
		dates.forEach( Date => {
			let DATA = data[Date];
			app_data.push(DATA);
			console.log(app_data);
			cases_list.push(DATA.Confirmed);
			recovered_list.push(DATA.Recovered);
			deaths_list.push(DATA.Deaths);
		})
	}).then( () => {
		updateUI();
	})
	.catch( error => {
		alert(error);
	})
}

fetchData(user_country);

// UPDATE UI FUNCTION
function updateUI(){
	updatestats();
	axesLinearchart();
}

function updatestats(){
	let last_entry = app_data[app_data.length-1];
	let before_last_entry = app_data[app_data.length-2];

	country_name_element.innerHTML = last_entry.Country;
	total_cases_element.innerHTML = last_entry.Confirmed || 0;
	new_cases_element.innerHTML = `+${last_entry.Confirmed - before_last_entry.Confirmed || 0}`;
	recovered_element.innerHTML = last_entry.Recovered || 0;
	new_recovered_element.innerHTML = `+${last_entry.Recovered - before_last_entry.Recovered}`;

	deaths_element.innerHTML = last_entry.Deaths;
	new_deaths_element.innerHTML = `+${last_entry.Deaths - before_last_entry.Deaths || 0}`;
}

//UPDATE CHART

function axesLinearchart(){
	let my_chart;
	if(my_chart){
		my_chart.destroy();
	}
	my_chart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Cases',
				data: cases_list,
				fill: false,
				borderColor: '#FFF',
				backgroundColor: '#FFF',
				borderWidth: 1
			},{
				label: 'Recovered',
				data: recovered_list,
				fill: false,
				borderColor: '#009688',
				backgroundColor: '#009688',
				borderWidth: 1
			},{
				label: 'Deaths',
				data: deaths_list,
				fill: false,
				borderColor: '#f44336',
				backgroundColor: '#f44336',
				borderWidth: 1
			}
		],
			labels: dates
		},
		options: {
			response: true,
			maintainAspectRatio: false
		}
	});
}

// DATES FORMAT