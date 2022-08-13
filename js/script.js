const usersURL = 'https://randomuser.me/api/?results=12&nat=us';
let users = [];

document.querySelector('#gallery').addEventListener('click', e => {
	if(e.target.closest('.card')){
		openModal(e.target.closest('.card').getAttribute('data-index'));
	}
});

document.querySelector('.search-container').innerHTML = `<form action="#" method="get">
															 <input type="search" id="search-input" class="search-input" placeholder="Search...">
														 </form>`;

document.querySelector('#search-input').addEventListener('input', e => {
	displayEmployees(users.filter(user => `${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()}`.includes(e.target.value.toLowerCase())));
});

fetchData(usersURL)
	.then(data => {
		users = data.results;
		displayEmployees(users);
	});

/**
 * Returns a json object
 * @async
 * @method
 * @param {String} url - the url to retreive or send the data
 * @param {Object} options - options containing data and other information needed in a post request
 * @returns {Promise} a promise object containing a json object
 * @throws {Error} Catchs and throw any erros that go off
 */
function fetchData(url, options = null){
    return fetch(url, options)
            .then(res => res.json())
            .catch(err => alert('an error has occured', err)); 
}

/**
 * Writes the html to be displayed onto the page showing the employees
 * @method
 * @param {Array} arr - the array od users to display
 */
function displayEmployees(arr){
	const gallery = document.querySelector('#gallery');
	gallery.innerHTML = '';
	let html = '';
	arr.forEach((user, index) => {
		html += `<div class="card" data-index="${index}">
						<div class="card-img-container">
							<img class="card-img" src="${user.picture.medium}" alt="profile picture">
						</div>
						<div class="card-info-container">
							<h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
							<p class="card-text">${user.email}</p>
							<p class="card-text cap">${user.location.city}, ${user.location.state}</p>
						</div>
					</div>`;
	});
	gallery.innerHTML = html;
}

/**
 * Opens the modal when the user clicks on an employee
 * @method
 * @param {string} index - the index where the clicked employee resides in the users array
 */
function openModal(index){
	if(document.querySelector('#modal-container')){
		document.querySelector('body').removeChild(document.querySelector('#modal-container'));
	}
	console.log(index);
	const div = document.createElement('div');
	div.className = 'modal-container';
	div.id = 'modal-container'
	div.setAttribute("data-index", index);
	const user = users[+index];
	div.innerHTML = `<div class="modal">
						<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
						<div class="modal-info-container">
							<img class="modal-img" src="${user.picture.large}" alt="profile picture">
							<h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
							<p class="modal-text">${user.email}</p>
							<p class="modal-text cap">${user.location.city}</p>
							<hr>
							<p class="modal-text">${user.cell}</p>
							<p class="modal-text">${user.location.street.number} P${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
							<p class="modal-text">Birthday: ${formatBirthday(user.dob.date.slice(0, 10))}</p>
						</div>
					</div>

					<div class="modal-btn-container">
						<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
						<button type="button" id="modal-next" class="modal-next btn">Next</button>
					</div>`;
	document.querySelector('body').appendChild(div);
	
	document.querySelector('#modal-prev').addEventListener('click', () => {
		let currentIndex = +document.querySelector('#modal-container').getAttribute('data-index');
		currentIndex--;
		if(currentIndex < 0) {
			currentIndex = users.length - 1;
		}
		openModal(currentIndex.toString());
	});
	
	document.querySelector('#modal-next').addEventListener('click', () => {
		let currentIndex = +document.querySelector('#modal-container').getAttribute('data-index');
		currentIndex++;
		if(currentIndex >= users.length) {
			currentIndex = 0;
		}
		openModal(currentIndex.toString());
	});
	
	document.querySelector('#modal-close-btn').addEventListener('click', () => {
		document.querySelector('body').removeChild(document.querySelector('#modal-container'));
	});
}

/**
 * Reformates a users birthday
 * @method
 * @param {String} dob - users date of birth string that needs reformating
 */
function formatBirthday(dob){
	return dob.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1');
}




                
