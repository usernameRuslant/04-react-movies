import axios from 'axios';
import type { Movie } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

axios.defaults.baseURL = 'https://api.themoviedb.org/3/';
axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;
axios.defaults.headers.common['accept'] = 'application/json';
// axios.defaults.params = {};

interface DBRespons {
  results: Movie[];
}

export const getMovies = async (query: string): Promise<Movie[]> => {
  const { data } = await axios.get<DBRespons>(`search/movie`, {
    params: { query },
  });
  return data.results;
};
