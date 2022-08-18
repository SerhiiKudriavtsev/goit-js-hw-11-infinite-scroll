
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';
import { backendRequest } from './js/backendRequest';
import photoCardTpl from './templates/photo-card.hbs';

const DEBOUNCE_DELAY = 100;

const refs = {
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
    scrollY + innerHeight >= document.body.scrollHeight - 500
    //OR   document.documentElement.scrollHeight - document.documentElement.scrollTop <=
    // (document.documentElement.clientHeight + 100)
    //OR   window.innerHeight + window.pageYOffset >=
    // document.body.offsetHeight - 10
  ) {
    await onLoadMore();
  } else return;
}

async function searchFn(e) {
  e.preventDefault();
  backendRequest.pageNumder = 1;
  backendRequest.numberOfPages = 1;
  refs.gallery.innerHTML = '';
  onLoadMore();
}

async function onLoadMore() {
  const searchQery = refs.inputForm.value.trim();
  const backendFeedback = await backendRequest.fetch(searchQery);
  renderPhotoCards(backendFeedback); 
  scrollBy();
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
