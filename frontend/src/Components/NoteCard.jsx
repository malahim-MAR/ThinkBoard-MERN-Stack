import React, { useState, useEffect } from 'react';
import RateLimiter from '../Components/RateLimiter';
import axios from 'axios';
import { SquarePen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const NoteCard = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5001/api/notes');
                setNotes(res.data);
                setIsRateLimited(false);
                setError(null);
            } catch (err) {
                console.error('Error fetching notes:', err);
                if (err.response?.status === 429) {
                    setIsRateLimited(true);
                } else {
                    setIsRateLimited(false);
                    setError('Failed to load notes. Try again later.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <span className="loading loading-dots loading-md"></span>
            </div>
        );
    }

    if (isRateLimited) {
        return (
            <div className='h-[100vh] bg-gray-50'>
                <RateLimiter />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center text-red-500 bg-gray-50">
                <p>{error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    const handleDelete = async (e, id) => {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            await axios.delete(`http://localhost:5001/api/notes/${id}`);
            setNotes(notes.filter(note => note._id !== id));
            toast.success('Note deleted successfully');
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <div className="notes-container">

            <div className="notes-grid">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <Link
                            to={`/notedetail/${note._id}`}
                            key={note._id}
                            className="note-link"
                        >
                            <div className="note-card">
                                <h2 className="note-title">{note.title}</h2>
                                <p className="note-content">{note.content}</p>
                                <div className="note-footer">
                                    <small className="note-date">
                                        {new Date(note.updatedAt).toLocaleString()}
                                    </small>
                                    <div className="note-actions">
                                        <button
                                            className="note-delete"
                                            onClick={(e) => handleDelete(e, note._id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button className="note-edit">
                                            <SquarePen size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="no-notes">No notes available.</p>
                )}
            </div>
        </div>


    );
};

export default NoteCard;
