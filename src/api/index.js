import axios from "axios";

const API = axios.create({ baseURL: "https://memories-server-j9m4.onrender.com/" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

const fetchPosts = (page) => API.get(`/posts?page=${page}`);

const fetchPost = (id) => API.get(`/posts/${id}`);

const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || ""}&tags=${
      searchQuery.tags
    }`
  );

const createPost = (newPost) => API.post("/posts", newPost);

const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);

const deletePost = (id) => API.delete(`/posts/${id}`);

const likePost = (id) => API.patch(`/posts/${id}/likePost`);

const signin = (formData) => API.post("/user/signin", formData);

const signup = (formData) => API.post("/user/signup", formData);

const postComment = (id, value) =>
  API.post(`/posts/${id}/postComment`, { value });

export {
  fetchPosts,
  fetchPostsBySearch,
  createPost,
  updatePost,
  deletePost,
  likePost,
  signin,
  signup,
  fetchPost,
  postComment,
};
