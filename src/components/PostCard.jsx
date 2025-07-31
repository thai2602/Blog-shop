import { Link } from 'react-router-dom';

const PostCard = ({ post }) => (
  <div className="border p-4 rounded shadow hover:shadow-lg">
    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
    <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
    <Link to={`/blog/${post.slug}`} className="text-blue-500 mt-2 inline-block">
      Đọc tiếp →
    </Link>
  </div>
);

export default PostCard;
