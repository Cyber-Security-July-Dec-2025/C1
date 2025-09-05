import { NavLink } from 'react-router';
import { LayoutDashboard, UploadCloud, KeyRound, Lock, ShieldCheck, DatabaseZap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink to={to} className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive ? 'bg-teal-500 text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
        }`
    }>
        <Icon className="h-5 w-5" />
        {children}
    </NavLink>
);

export default function Sidebar() {
    const { logout } = useAuthStore();
    return (
        <aside className="w-64 bg-white dark:bg-zinc-950/70 border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4">
            <div className="flex items-center gap-3 mb-8 px-2">
                <Lock className="h-8 w-8 text-teal-500" />
                <h1 className="text-xl font-bold">Confidential Storage</h1>
                {/* <h1 className="text-xl font-bold">Secure File Vault</h1> */}
            </div>
            <nav className="flex-1 space-y-2">
                <p className="px-4 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Security Operations</p>
                <NavItem to="/" icon={LayoutDashboard}>Dashboard</NavItem>
                <NavItem to="/upload" icon={UploadCloud}>Upload & Encrypt</NavItem>
                <NavItem to="/keys" icon={KeyRound}>Key Management</NavItem>
                
                <div className="pt-6">
                    <p className="px-4 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Security Status</p>
                    <div className="mt-2 space-y-2 text-zinc-500 dark:text-zinc-400">
                        <p className="flex items-center gap-3 px-4 py-2 text-sm"><ShieldCheck className="h-5 w-5 text-green-500" /> Client-Side Encryption</p>
                        <p className="flex items-center gap-3 px-4 py-2 text-sm"><DatabaseZap className="h-5 w-5 text-green-500" /> Zero-Knowledge Storage</p>
                    </div>
                </div>
            </nav>
            <div className="mt-auto">
                <button onClick={logout} className="w-full text-left text-zinc-500 dark:text-zinc-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md transition-colors">
                    End-to-end encrypted
                </button>
            </div>
        </aside>
    );
}