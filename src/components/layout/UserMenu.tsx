import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserIcon, LogOutIcon, UserCircleIcon } from 'lucide-react';
interface UserMenuProps {
  onProfileClick: () => void;
}
const UserMenu: React.FC<UserMenuProps> = ({
  onProfileClick
}) => {
  const {
    user,
    setUser
  } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('budget_tracker_user');
    setUser(null);
  };
  if (!user) return null;
  return <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 py-2 px-3 rounded-full hover:bg-gray-100">
        <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white">
          <UserIcon size={16} />
        </div>
        <span className="hidden md:inline text-sm font-medium text-gray-700">
          {user.name}
        </span>
      </button>
      {isOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button onClick={() => {
        setIsOpen(false);
        onProfileClick();
      }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <UserCircleIcon size={16} className="mr-2" />
            Profile
          </button>
          <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <LogOutIcon size={16} className="mr-2" />
            Log out
          </button>
        </div>}
    </div>;
};
export default UserMenu;