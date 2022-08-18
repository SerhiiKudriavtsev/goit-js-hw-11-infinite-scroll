import axios from 'axios';
import Notiflix from 'notiflix';
Notiflix.Notify.init({
  width: '280px',
  position: 'center-top'
});
export const backendRequest = {
  pageNumder: 1,
  perPage: 40,
  totalPages: 1,
  numberOfPages: 1,
  BASE_URL: 'https://pixabay.com/api/',
  PIXABAY_KEY: '29091734-9e049dbec053396241aa2e5c2',

  fetch: async function (searchWord) {
    if (this.pageNumder > this.numberOfPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    if (searchWord && this.pageNumder <= this.numberOfPages) {
      try {
        const response = await axios.get(
          `${this.BASE_URL}?key=${this.PIXABAY_KEY}&q=${searchWord}&image_type=photo&page=${this.pageNumder}&per_page=${this.perPage}&orientation=horizontal&safesearch=true`
        );
        this.totalPages = response.data.total / this.perPage;
        this.numberOfPages = Math.ceil(this.totalPages);

        if (response.data.total !== 0 && this.pageNumder === 1) {
          Notiflix.Notify.success(
            `"Hooray! We found ${response.data.total} images on ${this.numberOfPages} pages."`
          );
        }

        if (
          response.data.total !== 0 &&
          this.pageNumder <= this.numberOfPages
        ) {
          Notiflix.Notify.success(
            `"Download page ${this.pageNumder} out of ${this.numberOfPages}."`
          );

          this.pageNumder += 1;
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
  },
};
