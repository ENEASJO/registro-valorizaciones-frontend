import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Building2, Construction, FileText, BarChart, Settings, Menu, X, Bell, User, LogOut, ChevronDown, ChevronRight, Briefcase, Shield, Hammer, ClipboardCheck } from 'lucide-react';
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
    const isActive = (href) => {
        if (!href)
            return false;
        return location.pathname === href || location.pathname.startsWith(href + '/');
    };
    const isSubmenuActive = (item) => {
        if (!item.submenu)
            return false;
        return item.submenu.some((subitem) => location.pathname === subitem.href);
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
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(motion.div, { initial: { x: 0 }, animate: { x: sidebarOpen ? 0 : -280 }, className: "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl", children: _jsxs("div", { className: "flex h-full flex-col", children: [_jsxs("div", { className: "flex h-16 items-center justify-between px-6 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center", children: _jsx(FileText, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Valorizaciones" }), _jsx("p", { className: "text-xs text-gray-500", children: "Sistema de Gesti\u00F3n" })] })] }), _jsx("button", { onClick: () => setSidebarOpen(false), className: "lg:hidden text-gray-500 hover:text-gray-700", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("nav", { className: "flex-1 space-y-1 px-3 py-4", children: navigation.map((item) => (_jsx("div", { children: item.hasSubmenu ? (
                                // Item con submenu
                                _jsxs("div", { children: [_jsxs("button", { onClick: () => {
                                                if (item.name === 'Empresas') {
                                                    setEmpresasMenuOpen(!empresasMenuOpen);
                                                }
                                                else if (item.name === 'Valorizaciones') {
                                                    setValorizacionesMenuOpen(!valorizacionesMenuOpen);
                                                }
                                            }, className: `
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isSubmenuActive(item)
                                                ? 'bg-primary-50 text-primary-600 font-medium shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-100'}
                      `, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(item.icon, { className: "w-5 h-5" }), _jsx("span", { children: item.name })] }), _jsx(motion.div, { animate: {
                                                        rotate: (item.name === 'Empresas' && empresasMenuOpen) ||
                                                            (item.name === 'Valorizaciones' && valorizacionesMenuOpen) ? 90 : 0
                                                    }, transition: { duration: 0.2 }, children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] }), _jsx(AnimatePresence, { children: ((item.name === 'Empresas' && empresasMenuOpen) ||
                                                (item.name === 'Valorizaciones' && valorizacionesMenuOpen)) && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2 }, className: "overflow-hidden", children: _jsx("div", { className: "ml-4 mt-1 space-y-1", children: item.submenu?.map((subitem) => (_jsxs(Link, { to: subitem.href, className: `
                                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                                  ${location.pathname === subitem.href
                                                            ? subitem.href.includes('/ejecucion')
                                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                                : subitem.href.includes('/supervision')
                                                                    ? 'bg-green-50 text-green-600 font-medium'
                                                                    : 'bg-blue-50 text-blue-600 font-medium'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                `, children: [_jsx(subitem.icon, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: subitem.name }), location.pathname === subitem.href && (_jsx(motion.div, { layoutId: "activeSubTab", className: `absolute left-3 w-0.5 h-6 rounded-full ${subitem.href.includes('/ejecucion')
                                                                    ? 'bg-blue-600'
                                                                    : subitem.href.includes('/supervision')
                                                                        ? 'bg-green-600'
                                                                        : 'bg-blue-600'}` }))] }, subitem.name))) }) })) })] })) : item.href ? (
                                // Item normal sin submenu
                                _jsxs(Link, { to: item.href, className: `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive(item.href)
                                        ? 'bg-primary-50 text-primary-600 font-medium shadow-sm'
                                        : 'text-gray-700 hover:bg-gray-100'}
                    `, children: [_jsx(item.icon, { className: "w-5 h-5" }), _jsx("span", { children: item.name }), isActive(item.href) && (_jsx(motion.div, { layoutId: "activeTab", className: "absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full" }))] })) : null }, item.name))) }), _jsx("div", { className: "border-t border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Admin Usuario" }), _jsx("p", { className: "text-xs text-gray-500", children: "admin@empresa.com" })] })] }) })] }) }), _jsxs("div", { className: `transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`, children: [_jsx("header", { className: "bg-white shadow-sm border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between h-16 px-6", children: [_jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: "text-gray-500 hover:text-gray-700", children: _jsx(Menu, { className: "w-6 h-6" }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { className: "relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg", children: [_jsx(Bell, { className: "w-5 h-5" }), _jsx("span", { className: "absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" })] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setUserMenuOpen(!userMenuOpen), className: "flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-4 h-4 text-white" }) }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Admin" }), _jsx(ChevronDown, { className: "w-4 h-4 text-gray-500" })] }), userMenuOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1", children: [_jsxs("button", { className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [_jsx(User, { className: "w-4 h-4" }), "Mi Perfil"] }), _jsxs("button", { className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [_jsx(Settings, { className: "w-4 h-4" }), "Configuraci\u00F3n"] }), _jsx("hr", { className: "my-1" }), _jsxs("button", { className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50", children: [_jsx(LogOut, { className: "w-4 h-4" }), "Cerrar Sesi\u00F3n"] })] }))] })] })] }) }), _jsx("main", { className: "p-6", children: _jsx(Outlet, {}) })] })] }));
};
export default Layout;
