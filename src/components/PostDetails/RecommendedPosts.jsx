import { Typography, Divider } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStyles from "./styles";
import { getPostsBySearch } from "../../actions/posts";

export default function RecommendedPosts({ post }) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { posts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const recommendedPosts = posts.filter(({ _id }) => _id !== post?._id);

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ tags: post.tags.join(",") }));
    }
  }, []);

  return (
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
              onClick={() => navigate(`/posts/${_id}`)}
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
                  `https://picsum.photos/200/300?random=${Math.random() * 100}`
                }
                width="200px"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
