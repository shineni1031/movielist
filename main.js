const base_URL = 'https://webdev.alphacamp.io'
const index_URL = base_URL + '/api/movies/'
const poster_URL = base_URL + '/posters/'
let clickPage = 1

const TableIcon = document.querySelector('.fa-table-cells')
const ListIcon = document.querySelector('.fa-bars')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const MOVIES_PER_PAGE = 12
const paginator = document.querySelector('#paginator')
const movieTable = document.querySelector('#data-panel')
const movieList = document.querySelector('#data-panel-list')
const DISPLAY_STATE = {
  TableType: 'TableType',
  ListType: 'ListType'
}

const view = {
  //movie table
  createTable(data) {
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
                            <button type="button" class="btn btn-info btn-add-favorite" data-id="${data[i].id}">+</buton>
                        </div>
                    </div>
                </div>
            </div> `

}
movieTable.innerHTML = rawHTML;
},

//movie list
createList(data) {
  let rawHTML = ""
  for (let i = 0; i < data.length; i++) {
    rawHTML += `<ul class="list-group list-group-flush d-flex">
                <li class="list-group-item list-group-item-action"><strong>${data[i].title}</strong>
                 <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie1" data-id="${data[i].id}" style="position: absolute; right: 50px; line-height: 1;">More</button>
                
                 <button type="button" class="btn btn-info btn-add-favorite" data-id="${data[i].id}" style="position: absolute; right: 10px; line-height: 1;">+</buton>
                    
                </li>
                
            </ul>`

  }
  movieList.innerHTML = rawHTML;
},

//展開電影資料
showMovieModal(id) {
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
},

//產生分頁按鈕
createPageList(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE) //無條件進位
  let rawHTML = ''
  for (let page = 1; page < numberOfPage + 1; page++) {
    if (page === clickPage) {
      rawHTML += `<li class="page-item active"><a class="page-link" data-page="${page}" data-type="table">${page}</a></li>`
    } else {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}" data-type="table">${page}</a></li>`
    }
  }
  paginator.innerHTML = rawHTML
},

//整合電影呈現方式(表格或列表)與分頁按鈕
//表格版
showTableType(setPage) {
  view.createPageList(controller.getLength())
  view.createTable(controller.getMovieByPage(setPage))
},
//列表版
showListType(setPage) {
  view.createPageList(controller.getLength())
  view.createList(controller.getMovieByPage(setPage))
}
}

const model = {
  movies: [],
  filteredMovies: [],
  // fetchMovies 遷移到 model
  fetchMovies: async function () {
    try {
      const response = await axios.get(index_URL);
      this.movies.push(...response.data.results);
      return this.movies;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}


// axios.get(index_URL)
//   .then((response) => {
//     model.movies.push(...response.data.results)
//     view.showTableType(1)
//   })
//   .catch((err) => console.log(err))
  
const controller = {
    // 初始化
    init: async function() {
      try {
        await model.fetchMovies();
        view.showTableType(1);
      } catch (err) {
        console.error('Failed to initialize:', err);
      }
    },
  currentState: DISPLAY_STATE.TableType,
  //切換模式
  chooseType(event) {
    const choose = event.target
    if ((choose.matches('.fa-table-cells') && controller.currentState === DISPLAY_STATE.TableType) || (choose.matches('.fa-bars') && controller.currentState === DISPLAY_STATE.ListType)) return
    switch (this.currentState) {
      case DISPLAY_STATE.ListType:
        view.showTableType(clickPage)
        TableIcon.style.color = "#0d6efd"
        TableIcon.style.cursor = "auto"
        ListIcon.style.color = "#565656"
        ListIcon.style.cursor = "pointer"
        this.currentState = DISPLAY_STATE.TableType
        movieList.innerHTML = ""
        break
      case DISPLAY_STATE.TableType:
        view.showListType(clickPage)
        TableIcon.style.color = "#565656"
        TableIcon.style.cursor = "pointer"
        ListIcon.style.color = "#0d6efd"
        ListIcon.style.cursor = "auto"
        this.currentState = DISPLAY_STATE.ListType
        movieTable.innerHTML = ""
        break
    }
  },

  //篩選出搜尋結果
  onSearchFormSubmitted(event) {
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()
    model.filteredMovies = model.movies.filter((movie) =>
      movie.title.toLowerCase().includes(keyword)
    )
    clickPage = 1 //避免過去的點擊頁數仍被保留抓取
    controller.showFilteredMoviesByType(1)
    if (model.filteredMovies.length === 0) {
      return alert('沒有找到 ' + keyword + ' 的搜尋結果')
    }
  },

  //依模式顯示搜尋結果
  showFilteredMoviesByType() {
    switch (this.currentState) {
      case DISPLAY_STATE.TableType:
        view.showTableType(1)
        break
      case DISPLAY_STATE.ListType:
        view.showListType(1)
        break
    }
  },

  //點擊頁數
  onPaginationClick(event) {
    if (event.target.tagName !== 'A') return  //不是點擊標的不是<a>就終止
    clickPage = Number(event.target.dataset.page)
    if (this.currentState === DISPLAY_STATE.TableType) {
      view.showTableType(clickPage)
    } else if (this.currentState === DISPLAY_STATE.ListType) {
      view.showListType(clickPage)
    }
  },

  //點擊電影卡片
  clickMore(event) {
    if (event.target.matches('.btn-show-movie')) {
      view.showMovieModal(Number(event.target.dataset.id))
    } else if (event.target.matches('.btn-add-favorite')) {
      controller.addToFavorite(Number(event.target.dataset.id))
    }
  },

  //加入我的最愛清單
  addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = model.movies.find(movie => movie.id === id)

    if (list.some(movie => movie.id === id)) {
      return alert('此電影已在收藏清單中！')
    }

    list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  },

  //擷取單一分頁資料
  getMovieByPage(clickPage) {
    //如果filteredMovies.length有東西 為 true ，會回傳 filteredMovies，然後用 data 保存回傳值，若無則回傳movies
    const data = model.filteredMovies.length ? model.filteredMovies : model.movies
    //page 1 0~11
    //page 2 12~23
    //page 3 24~35
    const startIndex = (clickPage - 1) * MOVIES_PER_PAGE
    return data.slice(startIndex, startIndex + MOVIES_PER_PAGE,)
  },

  getLength() {
    const data = model.filteredMovies.length ? model.filteredMovies : model.movies
    return data.length
  }
}

// 初始化
controller.init()

//點擊table的電影卡片
movieTable.addEventListener('click', event => {
  controller.clickMore(event)
})

//點擊list的電影卡片
movieList.addEventListener('click', event => {
  controller.clickMore(event)
})

//篩選出搜尋結果
searchForm.addEventListener('submit', event => {
  controller.onSearchFormSubmitted(event)
})

//抓取頁數ID
paginator.addEventListener('click', event => {
  controller.onPaginationClick(event)
})

//切換模式
const displayType = document.querySelector('#displayType')
displayType.addEventListener('click', event => {
  controller.chooseType(event)
})







