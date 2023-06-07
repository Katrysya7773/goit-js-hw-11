import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import refs from "./refs";
import { PixabayAPI } from "./PixabayAPI";

const pixabayApi = new PixabayAPI;

const API_KEY = "36945687-a4e7966ed6349b63eadd861cc"
const PATH = "https://pixabay.com/api/"

Notiflix.Notify.init({
  width: '480px',
  position: 'center-top',
  distance: '60px',
  opacity: 1,
  timeout: 3000,
  fontSize: '18px'
});

axios.defaults.baseURL = "https://pixabay.com/api/"

refs.form.addEventListener('submit', onFormSubmit)

let page = 1;
let keyword = ''

async function onFormSubmit(event) {
  event.preventDefault()
  refs.BtnLoadmore.classList.add('is-hidden')
  refs.gallery.innerHTML = '';
  page = 1;
 keyword = event.currentTarget.elements.searchQuery.value.trim();

  if (keyword === '') {
    refs.BtnLoadmore.classList.add('is-hidden')
   return
 }
  
  try {
    const response = await pixabayApi.fetchImagesByQuery(keyword, page)
    
    onPagination(response)
    galleruMarcap(response);
    
     if (response.data.total !== 0) {
       Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
     }else {
       return error;
    }

  } catch (error) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }


   refs.form.reset()
}

function galleruMarcap({data:{hits}}){
  const marcap = hits.map(({webformatURL, largeImageUR, tags, likes, views, comments, downloads}) => {
       
        return `<div class="photo-card">
 <a href ="${largeImageUR}"> <img class ='gellary-img'src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    }).join('')
    refs.gallery.insertAdjacentHTML('beforeend', marcap)
}


function onPagination(response) {

  page = response.config.params.page
  
  if (response.data.totalHits > response.config.params.per_page) {
    refs.BtnLoadmore.classList.remove('is-hidden')
    return
  } else {
    refs.BtnLoadmore.classList.add('is-hidden')
  }
 
}

refs.BtnLoadmore.addEventListener('click', changePage)
 
async function changePage() {

  page +=1
  try {
    const response = await pixabayApi.fetchImagesByQuery(keyword, page)
    galleruMarcap(response);
    console.log(response.data.hits.length);
    if (response.data.hits.length < response.config.params.per_page) {
      refs.BtnLoadmore.classList.add('is-hidden')
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
    }
    
  } catch (error){Notiflix.Notify.failure("Ooops! Something wrong! Please reload the page.")}
    
}


// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });
