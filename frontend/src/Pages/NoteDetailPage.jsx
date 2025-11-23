import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NoteDetailPage = () => {
  const { id } = useParams();
  const [noteDetail, setNoteDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newSaveTitle, setNewSaveTitle] = useState("");
  const [newSaveContent, setNewSaveContent] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/notes/${id}`);
        setNoteDetail(res.data);
        setNewSaveTitle(res.data.title || "");
        setNewSaveContent(res.data.content || "");
      } catch (error) {
        console.log("Error fetching note", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      await axios.put(`http://localhost:5001/api/notes/${id}`, {
        title: newSaveTitle,
        content: newSaveContent,
      });

      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Update error", error);
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="detail-loading">Loading...</p>;
  if (!noteDetail) return <p className="detail-error">Note not found.</p>;

  return (
    <section className="detail-container">
      <div className="detail-card">

        <div className="detail-back">
          <ArrowLeft size={18} color="#3ba74b" />
          <Link to="/">Back to Home</Link>
        </div>

        <h2 className="detail-title">Edit Note</h2>

        <form onSubmit={handleEdit} className="detail-form">

          <div className="detail-field">
            <label className="detail-label">Title</label>
            <input
              type="text"
              value={newSaveTitle}
              onChange={(e) => setNewSaveTitle(e.target.value)}
              className="detail-input"
              placeholder="Update title..."
            />
          </div>

          <div className="detail-field">
            <label className="detail-label">Content</label>
            <textarea
              value={newSaveContent}
              onChange={(e) => setNewSaveContent(e.target.value)}
              className="detail-textarea"
              placeholder="Update content..."
            />
          </div>

          <button type="submit" className="detail-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

      </div>
    </section>
  );
};

export default NoteDetailPage;
