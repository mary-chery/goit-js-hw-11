import PicturesApiService from './fetchPictures'
import Notiflix from 'notiflix';
import './css/style.css'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more')
}

 let lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250, captionsData: "alt",});

const picturesApiService = new PicturesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', galleryResult)

function onSearch(event) {
    event.preventDefault();
    refs.gallery.innerHTML = '';
    picturesApiService.query = event.currentTarget.elements.searchQuery.value.trim();
    if (picturesApiService.query === '') {
        Notiflix.Notify.info('No query in the form. Please, enter your request');
    return;
    }
    

  picturesApiService.resetPage();
  galleryResult();
  }

refs.btnLoadMore.classList.add("hidden");

async function galleryResult() {
  refs.btnLoadMore.classList.add("hidden");
  const images = await picturesApiService.fetchPictures();
  try {
    const hits = images.hits;
    const totalHits = images.totalHits;

    if (hits.length > 0 ) {
      refs.btnLoadMore.classList.remove("hidden");
        createCalleryCard(hits);
        lightbox.refresh();

      if (picturesApiService.imageQty >= totalHits) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        refs.btnLoadMore.classList.add("hidden");
        return;
      }
    } else {
      refs.btnLoadMore.classList.add("hidden");
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
  } catch (error) {
    console.log(error.message);
  }
}


function createCalleryCard(array) {
    const markup = array.map(({ webformatURL,largeImageURL,tags,likes,views,comments,downloads }) => {
        return `<a href="${largeImageURL}"> <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
    <p class="info-item">
        <b>Likes:</b>${likes}
    </p>
    <p class="info-item">
        <b>Views:</b>${views}
    </p>
    <p class="info-item">
        <b>Comments:</b>${comments}
    </p>
    <p class="info-item">
        <b>Downloads:</b>${downloads}
    </p>
    </div>
</div></a>`
    }).join('');

        refs.gallery.insertAdjacentHTML('beforeend', markup)
    refs.btnLoadMore.classList.remove('hidden');
    lightbox.refresh();
}
