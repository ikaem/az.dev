import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';

import { useStore } from '../store';

/** GIA NOTES
 * Define GraphQL operations here...
 */
const SEARCH_RESULTS = gql`
  query SearchResults($searchTerm: String!) {
    searchResults: search(term: $searchTerm) {
      type: __typename
      id
      content
      ... on Task {
        approachCount
      }
      ... on Approach {
        task {
          id
          content
        }
      }
    }
  }
`;

function SearchResults({ searchTerm }) {
  const { AppLink } = useStore();

  // this will always trigger when the search term passed to the component changes
  const { error, loading, data } = useQuery(SEARCH_RESULTS, {
    variables: { searchTerm },
  });

  if (error) return <div className='error'>{error.message}</div>;
  if (loading) return <div className='loading'>Loading...</div>;

  {
    data && data.searchResults && (
      <div>
        <h2>Search Results</h2>
        <div className='y-spaced'>
          {data.searchResults.length === 0 && (
            <div className='box box-primary'>No results</div>
          )}
          {data.searchResults.map((item, index) => (
            <div key={index} className='box box-primary'>
              <AppLink
                to='TaskPage'
                taskId={item.type === 'Approach' ? item.task.id : item.id}
              >
                <span className='search-label'>{item.type}</span>{' '}
                {item.content.substr(0, 250)}
              </AppLink>
              <div className='search-sub-line'>
                {item.type === 'Task'
                  ? `Approaches: ${item.approachCount}`
                  : `Task: ${item.task.content.substr(0, 250)}`}
              </div>
            </div>
          ))}
        </div>
        <AppLink to='Home'>{'<'} Home</AppLink>
      </div>
    );
  }
}

export default function Search({ searchTerm = null }) {
  const { setLocalAppState, query, AppLink } = useStore();
  // const [searchResults, setSearchResults] = useState(null);

  // const { error, loading, data } = useQuery(SEARCH_RESULTS, {
  //   variables: { searchTerm },
  //   skip: !searchTerm,
  // });

  // const [performSearch, { error, loading, data }] = useLazyQuery(
  //   SEARCH_RESULTS,
  //   {
  //     variables: { searchTerm },
  //   }
  // );

  // if (error) return <div className='error'>{error.message}</div>;

  const handleSearchSubmit = async (event) => {
    // this only sets local state with the search tem
    // is it needed to put it in the global state?
    event.preventDefault();
    const term = event.target.search.value;

    setLocalAppState({
      component: { name: 'Search', props: { searchTerm: term } },
    });
  };

  // useEffect(() => {
  //   if (searchTerm) performSearch();
  // }, [searchTerm, performSearch]);

  // useEffect(() => {
  //   if (searchTerm) {
  //     query(SEARCH_RESULTS, {
  //       variables: {
  //         searchTerm,
  //       },
  //     }).then(({ data }) => {
  //       setSearchResults(data.searchResults);
  //     });

  //     /** GIA NOTES
  //      *
  //      * 1) Invoke the query for search:
  //      *   - Variable `searchTerm` holds the search input value
  //      *   (You can't use `await` here but `promise.then` is okay)
  //      *
  //      * 2) Change the setSearchResults call below to use the returned data:
  //      *
  //      */

  //     setSearchResults([]); // TODO: Replace empty array with API_RESP_FOR_searchResults
  //   }
  // }, [searchTerm, query]);

  return (
    <div>
      <div className='main-container'>
        <form method='post' onSubmit={handleSearchSubmit}>
          <div className='center'>
            <input
              type='search'
              name='search'
              className='input-append'
              defaultValue={searchTerm}
              placeholder='Search all tasks and approaches'
              required
            />
            <div className=''>
              <button className='btn btn-append' type='submit'>
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {searchTerm && <SearchResults searchTerm={searchTerm} />}

      {/* {data && data.searchResults && (
        <div>
          <h2>Search Results</h2>
          <div className='y-spaced'>
            {data.searchResults.length === 0 && (
              <div className='box box-primary'>No results</div>
            )}
            {data.searchResults.map((item, index) => (
              <div key={index} className='box box-primary'>
                <AppLink
                  to='TaskPage'
                  taskId={item.type === 'Approach' ? item.task.id : item.id}
                >
                  <span className='search-label'>{item.type}</span>{' '}
                  {item.content.substr(0, 250)}
                </AppLink>
                <div className='search-sub-line'>
                  {item.type === 'Task'
                    ? `Approaches: ${item.approachCount}`
                    : `Task: ${item.task.content.substr(0, 250)}`}
                </div>
              </div>
            ))}
          </div>
          <AppLink to='Home'>{'<'} Home</AppLink>
        </div>
      )} */}
    </div>
  );
}
