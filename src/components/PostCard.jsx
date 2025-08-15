import { Link } from 'react-router-dom';
import defaultImg from '../assets/default-img.jpg';
import API_URL from '../config';

const PostCard = ({ post }) => {
  if (!post || !post.content) return null;

  return (
    <Link to={`/blog/${post.slug || post._id}`} id = "PostCard" className="border p-4 rounded shadow hover:shadow-lg inline-block">
      <img src={post.image 
          ? `${API_URL}${post.image}`
          : defaultImg } 
          alt={post.title} className="mb-3 w-full h-48 object-cover rounded" />
          
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>

      <p className="text-gray-600">
        {typeof post.content === 'string' && post.content.length > 100
          ? `${post.content.slice(0, 100)}...`
          : post.content}
      </p>
    </Link>
    );
};

export default PostCard;



