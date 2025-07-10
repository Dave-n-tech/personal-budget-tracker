import UserMenu from "../layout/UserMenu";

interface HeaderProps {
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">FinTrack</h1>
        <UserMenu onProfileClick={onProfileClick} />
      </div>
    </header>
  );
};
