import axios from 'axios';
const KEY = '?key=34393844-3d650ec2647a1a66a6258bbe7';
const BASE_URL = 'https://pixabay.com/api/';

export default class PicturesApiService {
    constructor() {
    this.searchQuery = '';
        this.page = 1;
        this.perPage = 40;
    }
    async fetchPictures() {
        try {
    const response = await axios.get(`${BASE_URL}/${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`)
    this.incrementPage();
    return response.data;

    }
    catch (error) {
    console.error(error);
        }
    };   
    incrementPage() {
    this.page += 1;
    }
    resetPage() {
    this.page = 1;
    }
    get query() {
    return this.searchQuery;
    }
    set query(newQuery) {
    this.searchQuery = newQuery;
    }
    get imageQty() {
    return (this.page - 1) * this.perPage;
  }
}