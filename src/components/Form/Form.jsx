import { Button, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../actions/posts";
import useStyles from "./styles";

export default function Form({ currentId, setCurrentId }) {
  const initialState = {
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  };
  const [postData, setPostData] = useState(initialState);

  const classes = useStyles();
  const dispatch = useDispatch();
  const currentPost = useSelector((state) =>
    currentId ? state.posts.posts.find((post) => post._id === currentId) : null
  );
  const user = JSON.parse(localStorage.getItem("profile"));
  useEffect(() => {
    if (currentPost) setPostData(currentPost);
  }, [currentPost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentId) {
      dispatch(updatePost(currentId, postData));
    } else dispatch(createPost({ ...postData, name: user?.userObject?.name }));
    clearPostData();
  };

  const handleChange = (e, type) => {
    setPostData((prevData) => ({
      ...prevData,
      [type]: e.target.value,
    }));
  };

  function clearPostData() {
    setCurrentId(0);
    setPostData(initialState);
  }

  if (!user?.userObject?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Please sign in to create your own memories or like other&apos;s
          memories
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
        label="Create Memories"
      >
        <Typography variant="h6">
          {currentId ? "Editing" : "Creating"} a Memory
        </Typography>
        <TextField
          className={classes.fileInput}
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData?.title}
          onChange={(event) => handleChange(event, "title")}
        />
        <TextField
          name="message"
          className={classes.fileInput}
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          minRows={4}
          value={postData?.message}
          onChange={(event) => handleChange(event, "message")}
        />
        <TextField
          name="tags"
          className={classes.fileInput}
          variant="outlined"
          label="Tags (coma separated)"
          fullWidth
          value={postData?.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(/[\s,;#]+/) })
          }
        />
        <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        <Button
          className={classes.buttonSubmit}
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          Submit
        </Button>
        <Button
          style={{ marginTop: "5px" }}
          type="button"
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          onClick={clearPostData}
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
}
