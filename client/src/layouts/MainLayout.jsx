import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Star,
  Trash2,
  Plus,
  Search,
  Menu,
  X,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
  Layers,
  Settings as SettingsIcon,
  RefreshCw,
  FolderOpen,
  Home,
  HelpCircle
} from 'lucide-react';
import { useContacts } from '../App.jsx';

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    activeContacts,
    deletedContacts,
    searchQuery,
    setSearchQuery,
    resetToSampleData,
    toast
  } = useContacts();

  const navigate = useNavigate();
  const location = useLocation();

  const favouritesCount = activeContacts.filter((c) => c.isFavorite).length;
  const followUpsCount = activeContacts.filter((c) => c.followUpDate).length;
  const totalActiveCount = activeContacts.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/contacts') {
      navigate('/contacts');
    }
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/contacts',
      label: 'Contacts',
      icon: Users,
      badge: totalActiveCount,
      exact: true,
    },
    {
      to: '/contacts?filter=favourites',
      label: 'Favourites',
      icon: Star,
      badge: favouritesCount,
      isFavouriteTab: true,
    },
    {
      to: '/follow-ups',
      label: 'Follow-ups',
      icon: CalendarClock,
      badge: followUpsCount,
    },
    {
      to: '/lists',
      label: 'Lists & Segments',
      icon: FolderOpen,
      badge: null,
    },
    {
      to: '/deleted',
      label: 'Deleted Contacts',
      icon: Trash2,
      badge: deletedContacts.length > 0 ? deletedContacts.length : null,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: SettingsIcon,
      badge: null,
    },
  ];

  const isLinkActive = (item) => {
    if (item.isFavouriteTab) {
      return location.pathname === '/contacts' && location.search.includes('filter=favourites');
    }
    if (item.exact) {
      return location.pathname === '/contacts' && !location.search.includes('filter=favourites');
    }
    return location.pathname === item.to;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Mobile hamburger & Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-display font-bold text-lg text-slate-900 tracking-tight block leading-tight">
                    Mini-CRM
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    Contact Manager
                  </span>
                </div>
              </NavLink>
            </div>

            {/* Middle: Global Search Input */}
            <div className="flex-1 max-w-lg hidden sm:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts by name, email, company, tag..."
                  className="w-full pl-10 pr-9 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5">
              <NavLink
                to="/"
                title="Go to Website Home Page"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-blue-600" />
                <span>Website Home</span>
              </NavLink>

              <button
                type="button"
                onClick={resetToSampleData}
                title="Reset demo data"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>

              <NavLink
                to="/contacts/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-xs shadow-blue-600/30 transition-all hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden xs:inline">Add Contact</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 text-sm text-slate-800 rounded-lg border border-slate-200 focus:bg-white focus:border-blue-500 outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs sticky top-24">
            <div className="px-3 py-2 mb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Main Menu
              </span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          item.badgeColor ||
                          (active ? 'bg-blue-200/70 text-blue-800' : 'bg-slate-100 text-slate-600')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-4 pt-3 border-t border-slate-100 px-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Pages & Support
              </span>
              <div className="space-y-0.5">
                <NavLink
                  to="/"
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50/70 transition-colors"
                >
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  <span>Home Landing</span>
                </NavLink>
                <NavLink
                  to="/about"
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50/70 transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>About Us</span>
                </NavLink>
                <NavLink
                  to="/contact"
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50/70 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Desk</span>
                </NavLink>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 px-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span>Local Storage CRM</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Data persists locally in browser storage. Fast & private offline demo.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer / Modal */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[80%] bg-white h-full shadow-2xl p-5 flex flex-col z-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-slate-900">Mini-CRM</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isLinkActive(item);
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                        active
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && item.badge !== undefined && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-slate-100 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block px-3 mb-1">
                  Pages & Support
                </span>
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  <span>Home Page</span>
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>About Us</span>
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Desk</span>
                </NavLink>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    resetToSampleData();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Sample Contacts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Center Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-bounce-short">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
              toast.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-amber-500/10'
                : toast.type === 'info'
                ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-blue-500/10'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-500/10'
            }`}
          >
            {toast.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

