import { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import useStyles from "./styles";
import { getPost, getPostsBySearch } from "../../actions/posts";
import CommentSection from "./CommentSection";

const randomImage = `https://picsum.photos/200/300?random=${
  Math.random() * 100
}`;

export default function PostDetails() {
  const { post, posts, isLoading } = useSelector((state) => state.posts);

  const [recommendedPosts, setRecommendedPosts] = useState([]);

  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ search: "none", tags: post.tags.join(",") }));
    }
  }, [post]);

  useEffect(() => {
    const storedRecommendedPosts = JSON.parse(
      localStorage.getItem(`${post?._id}`)
    );
    if (storedRecommendedPosts) {
      setRecommendedPosts(storedRecommendedPosts);
    } else {
      setRecommendedPosts(posts?.filter(({ _id }) => _id !== post?._id));
    }
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(`${post?._id}`, JSON.stringify(recommendedPosts));
  }, [recommendedPosts]);

  const handleRecommendationClick = (_id) => {
    localStorage.removeItem(`${post?._id}`);
    navigate(`/posts/${_id}`);
  };

  if (!post && !isLoading) {
    return <div>No Post for the given ID</div>;
  }

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  return (
    <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {post.message}
          </Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">
            {moment(post.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <Typography variant="body1">
            <strong>Realtime Chat - coming soon!</strong>
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <CommentSection post={post} />
          <Divider style={{ margin: "20px 0" }} />
        </div>
        <div className={classes.imageSection}>
          <img
            className={classes.media}
            src={post.selectedFile || randomImage}
            alt={post.title}
          />
        </div>
      </div>
      {!!recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">
            You might also like :{" "}
          </Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(
              ({ title, message, name, likes, selectedFile, _id }) => (
                <div
                  key={_id}
                  style={{ margin: "20px", cursor: "pointer" }}
                  onClick={() => handleRecommendationClick(_id)}
                >
                  <Typography gutterBottom variant="h6">
                    {title}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {name}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {message}
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    Likes : {likes.length}
                  </Typography>
                  <img
                    src={
                      selectedFile ||
                      `https://picsum.photos/200/300?random=${
                        Math.random() * 100
                      }`
                    }
                    width="200px"
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}
    </Paper>
  );
}
