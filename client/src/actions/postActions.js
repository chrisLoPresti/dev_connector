import axios from "axios";
import {
  ADD_POST,
  GET_POSTS,
  GET_POST,
  GET_ERRORS,
  POST_LOADING,
  DELETE_POST
} from "./types";

//get post
export const getPost = id => dispatch => {
  dispatch(setPostsLoading());
  axios
    .get(`/api/posts/${id}`)
    .then(res => {
      dispatch({
        type: GET_POST,
        payload: res.data
      });
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
    })
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

//add post
export const addPost = postData => dispatch => {
  axios
    .post("/api/posts", postData)
    .then(res => {
      dispatch({
        type: ADD_POST,
        payload: res.data
      });
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//add post
export const getPosts = () => dispatch => {
  dispatch(setPostsLoading());
  axios
    .get("/api/posts")
    .then(res => {
      dispatch({
        type: GET_POSTS,
        payload: res.data
      });
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
    })
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: []
      })
    );
};

//delete post
export const deletePost = id => dispatch => {
  axios
    .delete(`api/posts/${id}`)
    .then(res => {
      dispatch({
        type: DELETE_POST,
        payload: id
      });
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
    })
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: []
      })
    );
};

//add like
export const addLike = id => dispatch => {
  axios
    .post(`api/posts/like/${id}`)
    .then(res => {
      dispatch(getPosts());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//remove like
export const removeLike = id => dispatch => {
  axios
    .post(`api/posts/unlike/${id}`)
    .then(res => {
      dispatch(getPosts());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//set posts loading
export const setPostsLoading = () => {
  return {
    type: POST_LOADING
  };
};

//add post
export const addComment = (commentData, id) => dispatch => {
  axios
    .post(`/api/posts/comment/${id}`, commentData)
    .then(res => {
      dispatch({
        type: GET_POST,
        payload: res.data
      });
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//delete comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`)
    .then(res => {
      dispatch({
        type: GET_POST,
        payload: res.data
      });
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
