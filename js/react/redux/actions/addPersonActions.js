import fetch from 'cross-fetch';
import Utilities from '../../../lib/Utilities';
import { 
  ADD_POST,
  ADD_POST_REQUEST,
  ADD_POST_RECEIVE,
  ADD_POST_FAILURE,
  REMOVE_NOTIFICATION,
  GET_POST,
  GET_POST_REQUEST,
  GET_POST_RECEIVE,
  GET_POST_FAILURE,
  SET_MATRIX_TYPE
} from './actionTypes';

// actions are functions that return plain objects with `type` and `payload`
export function setMatrixType(matrixType) {
  return {
    type: SET_MATRIX_TYPE,
    payload: {
      matrixType : matrixType
    } 
  };
}

export function requestAddPost() {
  return {
    type: ADD_POST_REQUEST,
    payload: {}
  };
}

let id = 0;
export function receiveAddPost(json) {
  return {
    type: ADD_POST_RECEIVE,
    payload: {
      addPersonData: json,
      id: id++
    }
  };
}

export function receiveAddPostFailure() {
  return {
    type: ADD_POST_FAILURE,
    payload: {}
  }
}

// thunk!
export function addPost(data) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  // Thunk requires we return a function with `dispatch` parameter
  return function(dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.
    dispatch(requestAddPost());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    const url     = _s_person.ajax_url;
    const options = {
      method: 'POST',
      // mode: 'same-origin',
      // cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: Utilities.buildQuery(data)
    };

    return fetch(url, options)
      .then(
        (response) => response.json(), // Fetch api requires .json() method
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        (error) => {
          console.log('Fetch error occured', error);
          dispatch(receiveAddPostFailure());
        }
      )
      .then(
        (json) =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(receiveAddPost(json))
      );
  }
}

export function removeNotificationAction(id) {
  return {
    type: REMOVE_NOTIFICATION,
    payload: {
      id: id
    }
  };
}



// actions are functions that return plain objects with `type` and `payload`
export function requestGetPost() {
  return {
    type: GET_POST_REQUEST,
    payload: {}
  };
}

export function receiveGetPost(json) {
  // console.log('receiveGetPost json', json);
  return {
    type: GET_POST_RECEIVE,
    payload: {
      maxNumPages: json.max_num_pages,
      paged: json.paged,
      personName: json.person_name,
      personData: json.person_data
    }
  };
}

export function receiveGetPostFailure() {
  return {
    type: GET_POST_FAILURE,
    payload: {}
  }
}

// thunk!
export function getPost(queryData, page = 1, personData = []) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  // Thunk requires we return a function with `dispatch` parameter
  return function(dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.
    dispatch(requestGetPost());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    
    // Do recursive calls...
    const promise = fetchRecursive(queryData, page, personData);

    return promise.then(
      (finalData) => {
        // console.log('finalData', finalData);
        dispatch(receiveGetPost(finalData));
      },
      (error) => {
        console.log('getPost error', error);
        dispatch(receiveGetPostFailure());
      }
    );
  }
}

/**
 * Fetch Recursively
 *
 * @param {Object} queryData object of key-value pairs database query
 * @param {Number} page page number
 * @param {Array}  savedData aggregated data from AJAX request 
 */
function fetchRecursive(queryData, page = 1, savedData = []) {
  queryData.paged = page; // add paged prop/val to queryData obj
  const url = _s_person.ajax_url;
  const options = {
    method: 'POST',
    // mode: 'same-origin',
    // cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    body: Utilities.buildQuery(queryData)
  };

  // return a new Promise resolve chain
  return new Promise((resolve, reject) => {
    // here we perform async actions and resolve & reject
    fetch(url, options)
      .then(
        (response) => {
          // console.log('fetch', response);

          // if reponse is OK, return the json value to next .then()
          if (response.ok) {
            // console.log('fetch response OK');
            return response.json();
          } else {
            console.log('fetch error');
          }
        },
        (error) => {
          // Do not use catch, because that will also catch
          // any errors in the dispatch and resulting render,
          // causing a loop of 'Unexpected batch number' errors.
          // https://github.com/facebook/react/issues/6895
          console.log('Fetch error occured', error);
          dispatch(receiveGetPostFailure());
        }
      )
      .then(
        (jsonData) => {
          // console.log('fetch jsonData', jsonData);

          // save the json data
          savedData = savedData.concat(jsonData.person_data);

          // console.log('savedData', savedData);

          // check pagination
          if (jsonData.paged < jsonData.max_num_pages) {
            // increment page
            let pageNext = ++jsonData.paged;

            // console.log('recursing...');

            // recurse
            // resolve using the resulting value from the recursion
            resolve(
              fetchRecursive(queryData, pageNext, savedData)
            );
          } else {
            // console.log('done recursing. resolving this promise!');
            // resolve this promise with the savedData
            resolve({...jsonData, person_data: [...savedData]});
          }
        }
      ); // end of Fetch chain
  }); // new Promise
} // fetchRecursive
