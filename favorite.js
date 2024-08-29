const base_URL = 'https://webdev.alphacamp.io'
const index_URL = base_URL + '/api/movies/'
const poster_URL = base_URL + '/posters/'

//從localStorage抓資料印出
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []




//movie list
const movieList = document.querySelector('#data-panel')

function createList(data) {
  let rawHTML = ""
  for (let i = 0; i < data.length; i++) {
    rawHTML += `<div class="col-sm-3">
                <div class="mb-2">
                    <!--card-->
                    <div class="card" style="width: 18rem;">
                        <img src="${poster_URL}${data[i].image}" class="card-img-top" alt="Movie Poster">
                        <div class="card-body">
                            <h5 class="card-title">${data[i].title}</h5>
                        </div>

                        <div class="card-footer">
                            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie1" data-id="${data[i].id}">More</button>
                            <button type="button" class="btn btn-danger btn-del-favorite" data-id="${data[i].id}">X</buton>
                        </div>
                    </div>
                </div>
            </div> `

  }
  movieList.innerHTML = rawHTML;
}

//印出收藏列表
createList(movies)


//Modal特定內容替換寫法
function showMovieModal(id) {
  const modalTitle = document.querySelector('#exampleModalLabel')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios
    .get(index_URL + id)
    .then((response) => {
      const data = response.data.results
      modalTitle.innerText = data.title
      modalImage.innerHTML = `<img src="${poster_URL + data.image}" alt="movie-poster" class="image-fuid">`
      modalDate.innerText = 'release date: ' + data.release_date
      modalDescription.innerText = data.description
    })
    .catch((err) => console.log(err))
}



//從我的最愛清單移除
function delFromFavorite(id) {
  //使用findindex比對
  const movieIndex = movies.findIndex(movie => movie.id === id)
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  createList(movies)
  


  // //使用for迴圈比對
  // for (let n = 0; n < movies.length; n++) {
  //   if (movies[n].id === id) {
  //     movies.splice(n,1)
  //     console.log(movies)
  //     localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  //     createList(movies)
  //   }
  // }
}


movieList.addEventListener('click', function clickMore(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-del-favorite')) {
    delFromFavorite(Number(event.target.dataset.id))

  }
})



