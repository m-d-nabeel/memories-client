import {
  CREATE,
  DELETE,
  FETCH_ALL,
  FETCH_BY_SEARCH,
  UPDATE,
  START_LOADING,
  END_LOADING,
  FETCH_POST,
  POST_COMMENT,
} from "../constants/actionTypes";

const postsReducer = (state = { isLoading: true, posts: [] }, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case END_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };
    case FETCH_BY_SEARCH:
      return {
        ...state,
        posts: action.payload,
      };
    case FETCH_POST:
      return {
        ...state,
        post: action.payload,
      };
    case CREATE:
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    case POST_COMMENT:
    case UPDATE: {
      const { posts } = state;
      const updatedPosts = posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
      return {
        ...state,
        posts: updatedPosts,
      };
    }
    case DELETE: {
      const { posts } = state;
      return {
        ...state,
        posts: posts.filter((post) => post._id !== action.payload),
      };
    }
    default:
      return state;
  }
};
export default postsReducer;
