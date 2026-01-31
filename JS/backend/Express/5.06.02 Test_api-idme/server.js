import axios from 'axios';
import { PRIVATE_KEY, PRIVATE_KEY_HOST } from './keys.js';

const options = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/api/imdb/tt0816692',
  headers: {
    'x-rapidapi-key': PRIVATE_KEY,
    'x-rapidapi-host':  PRIVATE_KEY_HOST
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
}

fetchData();