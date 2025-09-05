import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AppLayout() {
    return (
        <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
            {/* <Header /> */}
                <div className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}