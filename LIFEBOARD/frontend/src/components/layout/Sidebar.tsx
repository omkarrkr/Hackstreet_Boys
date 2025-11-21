import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/dashboard/goals', label: 'Goals', icon: '🎯' },
  { path: '/dashboard/finances', label: 'Finances', icon: '💰' },
  { path: '/dashboard/habits', label: 'Habits', icon: '✅' },
  { path: '/dashboard/todos', label: 'To-Dos', icon: '📝' },
  { path: '/dashboard/health', label: 'Health', icon: '💪' },
  { path: '/dashboard/bucketlist', label: 'Bucket List', icon: '🌟' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
