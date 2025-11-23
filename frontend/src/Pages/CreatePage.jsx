import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const CreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      toast.error("Both fields are required.");
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/notes', { title, content });
      toast.success("Note Created Successfully");
      navigate('/');
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create-container">
      <div className="create-card">

        <div className="create-back">
          <ArrowLeft size={18} color="#3ba74b" />
          <Link to="/">Back to Home</Link>
        </div>

        <h2 className="create-title">Create New Note</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="create-label">Title</label>
            <input
              type="text"
              className="create-input"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="create-label">Content</label>
            <textarea
              className="create-textarea"
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="create-btn"
          >
            {loading ? 'Creating...' : 'Create Note'}
          </button>
        </form>

      </div>
    </section>
  );
};

export default CreatePage;
