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

const picturesApiService = new PicturesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore)

function onSearch(event) {
    event.preventDefault();
    refs.gallery.innerHTML = '';
    picturesApiService.query = event.currentTarget.elements.searchQuery.value;
    picturesApiService.resetPage();
    picturesApiService.fetchPictures().then(galleryResult).catch(() => 
    Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.'))
}

refs.btnLoadMore.classList.add("hidden");


function galleryResult({ hits, totalHits }) {
    if (hits.length !== 0 ) {
        createCalleryCard(hits);
            let lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250, captionsData: "alt",});
            lightbox.refresh();
    }
    else {
        Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
        refs.btnLoadMore.classList.add("hidden");
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
}

function onLoadMore() {
    picturesApiService.fetchPictures().then(galleryResult);
}