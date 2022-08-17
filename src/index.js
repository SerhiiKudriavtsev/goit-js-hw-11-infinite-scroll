
import { backendRequest } from './js/backendRequest';
import photoCardTpl from './templates/photo-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';

export let pageNumber;
export const perPage = 40;
const DEBOUNCE_DELAY = 500;

export const refs = {
  searchForm: document.querySelector('#search-form'),
  inputForm: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.btn'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

refs.searchForm.addEventListener('submit', searchFn);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);
window.addEventListener('scroll', debounce(onScroll, DEBOUNCE_DELAY));

async function onScroll() {
  if (
    document.documentElement.scrollHeight - document.documentElement.scrollTop <=
    document.documentElement.clientHeight + 10
    // window.innerHeight + window.pageYOffset >=
    // document.body.offsetHeight - 10
    // scrollY + innerHeight >= document.body.scrollHeight - 10
  ) {
    await onLoadMore();
  } else return;
}

async function searchFn(e) {
  e.preventDefault();
  pageNumber = 1;
  refs.gallery.innerHTML = '';
  onLoadMore();
}

async function onLoadMore() {
  const searchQery = refs.inputForm.value.trim();
  const backendFeedback = await backendRequest(searchQery, pageNumber);
  renderPhotoCards(backendFeedback); 
  scrollBy();
  pageNumber += 1;
  await lightbox.refresh();
}

function renderPhotoCards(cards) {
  refs.gallery.insertAdjacentHTML('beforeend', photoCardTpl(cards));
}

function scrollBy() { 
  const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();
  
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// function scrollBy() {
//   let infScroll = new InfiniteScroll('.gallery', {
//     path: '.pagination__next',
//     append: '.post',
//     history: false,
//   });
// }