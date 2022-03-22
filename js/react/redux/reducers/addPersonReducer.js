import {
  ADD_POST_REQUEST,
  ADD_POST_RECEIVE,
  ADD_POST_FAILURE,
  REMOVE_NOTIFICATION,
  GET_POST,
  GET_POST_REQUEST,
  GET_POST_RECEIVE,
  GET_POST_FAILURE
} from '../actions/actionTypes';

const initialState = {
  addPersonData: {},
  getPersonData: {
    maxNumPages : null,
    paged       : null,
    personName  : null,
    personData  : []
  },
  isFetching: false,
  notifications: {}
};

// State is immutable
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_POST_REQUEST: {
      return {
        ...state,
        isFetching: true
      };
    }
    case ADD_POST_RECEIVE: {
      // extract personData from payload
      const { addPersonData, id } = action.payload;

      return {
        ...state,
        isFetching: false,
        addPersonData: {
          ...state.addPersonData,
          [id]: {
            rId: id,
            ...addPersonData
          }
        },
        notifications: {
          ...state.notifications,
          [id]: {
            rId: id,
            ...addPersonData
          }
        }
      };
    }
    case ADD_POST_FAILURE: {
      return {
        ...state,
        isFetching: false
      }
    }

    case REMOVE_NOTIFICATION: {
      const { id } = action.payload;
      return {
        ...state,
        addPersonData: {
          ...state.addPersonData,
        },
        notifications: {
          ...state.notifications,
          [id]: null // change to null to remove
        }
      };
    }

    case GET_POST_REQUEST: {
      return {
        ...state,
        isFetching: true
      };
    }
    case GET_POST_RECEIVE: {
      // extract personData from payload
      const { maxNumPages, paged, personName, personData } = action.payload;

      return {
        ...state,
        isFetching: false,
        addPersonData: {
          ...state.addPersonData
        },
        notifications: {
          ...state.notifications
        },
        getPersonData: {
          ...state.getPersonData,
          maxNumPages : maxNumPages,
          paged       : paged,
          personName  : personName,
          personData  : [
            ...personData
          ]
        }
      };
    }
    case GET_POST_FAILURE: {
      return {
        ...state,
        isFetching: false
      }
    }
    default:
      return state;
  }
}
