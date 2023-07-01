import { useSelector } from "react-redux";
import { CircularProgress, Grid } from "@material-ui/core";

import Post from "./Post/Post";

export default function Posts({ setCurrentId }) {
  const { posts, isLoading } = useSelector((state) => state.posts);

  if (!posts.length && !isLoading) {
    return <h4>Currently no posts available</h4>;
  }
  return isLoading ? (
    <CircularProgress />
  ) : (
    <Grid container alignItems="stretch" spacing={3}>
      {posts?.map((post) => (
        <Grid item key={post._id} xs={12} sm={12} md={6} lg={4} xl={3}>
          <Post post={post} setCurrentId={setCurrentId} />
        </Grid>
      ))}
    </Grid>
  );
}
