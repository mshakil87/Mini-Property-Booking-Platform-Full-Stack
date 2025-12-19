import React, { ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';

interface DefaultLayoutProps {
  children?: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar placeholder */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-semibold">AdminLTE</div>
        <nav className="flex-1 p-4">
          <ul>
            <li className="mb-2"><Link to="/properties" className="block py-2 px-4 rounded hover:bg-gray-700">Properties</Link></li>
            <li className="mb-2"><Link to="/bookings" className="block py-2 px-4 rounded hover:bg-gray-700">Bookings</Link></li>
            {/* Add more navigation items here */}
          </ul>
        </nav>
      </aside>

      {/* Content area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Header placeholder */}
        <header className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          {/* User dropdown/notifications placeholder */}
          <div>User Menu</div>
        </header>

        {/* Main content */}
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
