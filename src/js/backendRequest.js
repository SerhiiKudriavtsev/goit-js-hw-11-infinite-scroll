import axios from 'axios';
// const axios = require('axios').default;
import Notiflix from 'notiflix';
import { refs, pageNumber, perPage } from '../index'

export async function backendRequest(name, pageN) {
  const BASE_URL = 'https://pixabay.com/api/';
  const PIXABAY_KEY = '29091734-9e049dbec053396241aa2e5c2';
  if (name) {
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${PIXABAY_KEY}&q=${name}&image_type=photo&page=${pageN}&per_page=${perPage}&orientation=horizontal&safesearch=true`
      );
      const totalPages = response.data.total / perPage;
      const numberOfPages = Math.ceil(totalPages);

      
      if (response.data.total !== 0 && pageN === 1) {
        Notiflix.Notify.success(
          `"Hooray! We found ${response.data.total} images on ${numberOfPages} pages."`
          );
        }
        
        if (response.data.total !== 0 && pageN <= numberOfPages) {
          Notiflix.Notify.success(
            `"Download page ${pageN} out of ${numberOfPages}."`
          );
          // refs.loadMoreBtn.classList.remove('is-hidden');
          if (response.data.total !== 0 && pageN >= totalPages) {
            refs.loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }
          return response.data;
        } else {
          throw new Error('Error fetching data');
        }
    } catch (error) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }
}
