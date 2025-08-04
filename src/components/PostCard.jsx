import { Link } from 'react-router-dom';
import defaultImg from '../assets/default-img.jpg';

const PostCard = ({ post }) => {
  if (!post || !post.content) return null;

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg">
      <img src={post.image 
            ? `http://localhost:5000${post.image}`
            : defaultImg } 
            alt={post.title} className="mb-3 w-full h-48 object-cover rounded" />
            
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>

      <p className="text-gray-600">
        {typeof post.content === 'string' && post.content.length > 100
          ? `${post.content.slice(0, 100)}...`
          : post.content}
      </p>

      <Link to={`/blog/${post.slug || post._id}`} className="text-blue-500 mt-2 inline-block">
        Đọc tiếp →
      </Link>
    </div>
  );
};

export default PostCard;
