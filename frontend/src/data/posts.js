export const fetchPosts = async () => {
  const response = await fetch("http://localhost:5000/posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
};
