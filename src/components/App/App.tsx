import { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import { getMovies } from '../../services/movieService';

import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';

function App() {
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  /////////////////////////////

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => getMovies(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });
  //////////////////////////////////////
  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data, isSuccess]);
  ///////////////////////////////
  const onSubmit = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  ////////////////////////
  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1); // react-paginate считает страницы с 0
  };
  ////////////////////////
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={onSubmit} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data?.results.length > 0 && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              marginPagesDisplayed={1}
              pageRangeDisplayed={5}
              containerClassName={css.pagination}
              activeClassName={css.active}
              previousLabel="←"
              nextLabel="→"
            />
          )}
          <MovieGrid movies={data.results} onSelect={handleMovieClick} />
        </>
      )}
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </>
  );
}

export default App;
