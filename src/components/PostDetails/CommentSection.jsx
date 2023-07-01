import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Typography, TextField, Button } from "@material-ui/core";
import useStyles from "./styles";
import { postComment } from "../../actions/posts";

export default function CommentSection({ post }) {
  const classes = useStyles();
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const commentsRef = useRef();
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleClick = async () => {
    const finalComment = `${user.userObject.name} : ${comment}`;
    const newComments = await dispatch(postComment(finalComment, post._id));
    setComments(newComments);
    setComment("");
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          {comments?.map((c, i) => (
            <Typography gutterBottom variant="subtitle1" key={i}>
              <strong>{c.split(": ")[0]}</strong>
              {c.split(":")[1]}
            </Typography>
          ))}
          <hr ref={commentsRef} />
        </div>
        <div style={{ width: "70%" }}>
          <Typography gutterBottom variant="h6">
            Write a comment
          </Typography>
          <TextField
            fullWidth
            minRows={4}
            variant="outlined"
            label="Comment"
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            style={{ marginTop: "10px" }}
            fullWidth
            disabled={!comment || !user}
            variant="contained"
            onClick={handleClick}
            color="primary"
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
