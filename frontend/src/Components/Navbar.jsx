import React from 'react';
import { CirclePlus } from 'lucide-react';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <p className="navbar-title">ThinkBoard</p>
        <Link to="/create">
          <button className="navbar-create-btn">
            <CirclePlus style={{ height: "18px", width: "18px", marginRight: "6px" }} />
            Create
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
