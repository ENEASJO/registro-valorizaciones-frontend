import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle';
import {
  LayoutDashboard,
  Building2,
  Construction,
  FileText,
  BarChart,
  Settings,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Shield,
  Hammer,
  ClipboardCheck,
  Sun,
  Moon
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [empresasMenuOpen, setEmpresasMenuOpen] = useState(false);
  const [valorizacionesMenuOpen, setValorizacionesMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { 
      name: 'Empresas', 
      icon: Building2,
      hasSubmenu: true,
      submenu: [
        { name: 'Empresas Ejecutoras', href: '/empresas/ejecutoras', icon: Briefcase },
        { name: 'Empresas Supervisoras', href: '/empresas/supervisoras', icon: Shield }
      ]
    },
    { name: 'Obras', href: '/obras', icon: Construction },
    { 
      name: 'Valorizaciones', 
      icon: FileText,
      hasSubmenu: true,
      submenu: [
        { name: 'Valorización de Ejecución', href: '/valorizaciones/ejecucion', icon: Hammer },
        { name: 'Valorización de Supervisión', href: '/valorizaciones/supervision', icon: ClipboardCheck }
      ]
    },
    { name: 'Reportes', href: '/reportes', icon: BarChart },
    { name: 'Configuración', href: '/configuracion', icon: Settings },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isSubmenuActive = (item: any) => {
    if (!item.submenu) return false;
    return item.submenu.some((subitem: any) => location.pathname === subitem.href);
  };

  // Auto-abrir el menú de empresas cuando estás en una de sus rutas
  useEffect(() => {
    if (location.pathname.startsWith('/empresas')) {
      setEmpresasMenuOpen(true);
    }
    if (location.pathname.startsWith('/valorizaciones')) {
      setValorizacionesMenuOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Valorizaciones</h1>
                <p className="text-xs text-gray-500 dark:text-gray-300">Sistema de Gestión</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.hasSubmenu ? (
                  // Item con submenu
                  <div>
                    <button
                      onClick={() => {
                        if (item.name === 'Empresas') {
                          setEmpresasMenuOpen(!empresasMenuOpen);
                        } else if (item.name === 'Valorizaciones') {
                          setValorizacionesMenuOpen(!valorizacionesMenuOpen);
                        }
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isSubmenuActive(item)
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </div>
                      <motion.div
                        animate={{ 
                          rotate: (item.name === 'Empresas' && empresasMenuOpen) || 
                                  (item.name === 'Valorizaciones' && valorizacionesMenuOpen) ? 90 : 0 
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </button>
                    
                    {/* Submenu */}
                    <AnimatePresence>
                      {((item.name === 'Empresas' && empresasMenuOpen) || 
                        (item.name === 'Valorizaciones' && valorizacionesMenuOpen)) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 mt-1 space-y-1">
                            {item.submenu?.map((subitem) => (
                              <Link
                                key={subitem.name}
                                to={subitem.href}
                                className={`
                                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                                  ${location.pathname === subitem.href
                                    ? subitem.href.includes('/ejecucion')
                                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                      : subitem.href.includes('/supervision')
                                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium'
                                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                  }
                                `}
                              >
                                <subitem.icon className="w-4 h-4" />
                                <span className="text-sm">{subitem.name}</span>
                                {location.pathname === subitem.href && (
                                  <motion.div
                                    layoutId="activeSubTab"
                                    className={`absolute left-3 w-0.5 h-6 rounded-full ${
                                      subitem.href.includes('/ejecucion')
                                        ? 'bg-blue-600'
                                        : subitem.href.includes('/supervision')
                                        ? 'bg-green-600'
                                        : 'bg-blue-600'
                                    }`}
                                  />
                                )}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : item.href ? (
                  // Item normal sin submenu
                  <Link
                    to={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive(item.href)
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
                      />
                    )}
                  </Link>
                ) : null}
              </div>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin Usuario</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">admin@empresa.com</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              {/* Theme toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                </button>

                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                  >
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <User className="w-4 h-4" />
                      Mi Perfil
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="w-4 h-4" />
                      Configuración
                    </button>
                    <hr className="my-1 dark:border-gray-700" />
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;