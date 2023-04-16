"use strict";
// selecting elements from index.html
let searchBox = document.getElementById("search-here");
let goToFavouriteButton = document.getElementById("go-favorite");
const movieCards = document.getElementById("card-container")

let moviestack = [];

// search box event listner check for any key press and search the movie according and show on web-page
searchBox.addEventListener('keyup' , ()=>{
	let searchString = searchBox.value;
	
	if(searchString.length > 0){
		let searchStringURI = encodeURI(searchString);
		const searchResult = fetch(`https://api.themoviedb.org/3/search/movie?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US&page=1&include_adult=false&query=${searchStringURI}`)
			.then((response) => response.json())
			.then((data) =>{
				moviestack = data.results;
				renderList("favourite");
			})
			.catch((err) => printError(err));
	}
})

// funtion to print the error if any thing is wrong in above funtion
function printError(message){
	const errorDiv = document.createElement("div");
	errorDiv.innerHTML = message;
	errorDiv.style.height = "100%";
	movieCardContainer.innerHTML = "";
	movieCardContainer.append(errorDiv);
}


// creating cards and appening the cards to the moviestack array. 
function renderList(actionForButton){
	movieCards.innerHTML = '';

	for(let i = 0; i<moviestack.length; i++){

		// creating div element for movie card 
		let movieCard = document.createElement('div');
        //setting class to movie card
		movieCard.classList.add("card-movie");

		// html code to set image,title and buttons inside movie-card.
		movieCard.innerHTML = `
		<img src="${'https://image.tmdb.org/t/p/w500' + moviestack[i].poster_path}" alt="${moviestack[i].title}" class="movie-poster">
		<div class="movie-title-container">
			<span>${moviestack[i].title}</span>
			<div class="rating-container">
				<img src="./res/rating-icon.png" alt="">
				<span>${moviestack[i].vote_average}</span>
			</div>
		</div>
		<button id="${moviestack[i].id}" onclick="getMovieInDetail(this)" style="height:40px;"> Movie Details </button>
		<button onclick="${actionForButton}(this)" class="add-to-favourite-button text-icon-button" data-id="${moviestack[i].id}" >
			<img src="https://freesvg.org/img/1289679474.png" class="star-icon">
			<span>${actionForButton}</span>
		</button>
		`;
		movieCards.append(movieCard); 
		
	}
}

// navigating to favorites whenever favorite icon is clicked

function showAlert(message){
	alert(message);
}

goToFavouriteButton.addEventListener('click', ()=>{
	let myFavs = JSON.parse(localStorage.getItem("myFavs"));
	if(myFavs == null || myFavs.length < 1){
		showAlert("Favorites Empty");
		return;
	}

    moviestack = myFavs;
	renderList("remove");
})

// function to add movie into favourite section
function favourite(element){
	let id = element.dataset.id;
	for(let i = 0; i< moviestack.length; i++){
		if(moviestack[i].id == id){
			let myFavs = JSON.parse(localStorage.getItem("myFavs"));
			
			if(myFavs == null){
				myFavs = [];
			}

			myFavs.unshift(moviestack[i]);
			localStorage.setItem("myFavs", JSON.stringify(myFavs));

			showAlert("Movie added to favourite")
			return;
		}
	}
}
//funtion to remove movie from favorite section.
function remove(element){
	let id = element.dataset.id;
	let myFavs = JSON.parse(localStorage.getItem("myFavs"));
	let newFavouriteMovies = [];
	for(let i = 0; i<myFavs.length; i++){
		if(myFavs[i].id == id){
			continue;
		}
		newFavouriteMovies.push(myFavs[i]);
	}
	
	localStorage.setItem("myFavs", JSON.stringify(newFavouriteMovies));
	moviestack = newFavouriteMovies;
	renderList("remove");
}



// renders movie details on web-page
function renderMovieInDetail(movie){
	
	movieCards.innerHTML = '';
	
	let movieDetailCard = document.createElement('div');
	movieDetailCard.classList.add('detail-movie-card');

	movieDetailCard.innerHTML = `
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}" class="detail-movie-background">
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.poster_path}" class="detail-movie-poster">
		<div class="detail-movie-title">
			<span>${movie.title}</span>
			<div class="detail-movie-rating">
                <img src="https://freesvg.org/img/1289679474.png" class="star-icon">
				<span>${movie.vote_average}</span>
			</div>
		</div>
		<div class="detail-movie-plot">
			<p>${movie.overview}</p>
			<p>Release date : ${movie.release_date}</p>
			<p>runtime : ${movie.runtime} minutes</p>
			<p>tagline : ${movie.tagline}</p>
		</div>
	`;

	movieCards.append(movieDetailCard);
}


// fetch the defails of of move and send it to renderMovieDetails to display
function getMovieInDetail(element){

	fetch(`https://api.themoviedb.org/3/movie/${element.getAttribute('id')}?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US`)
		.then((response) => response.json())
		.then((data) => renderMovieInDetail(data))
		.catch((err) => printError(err));

}
