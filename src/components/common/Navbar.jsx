import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-xl font-bold">
            Project Planner
          </Link>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiUser />
                <span>{user.name || user.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
