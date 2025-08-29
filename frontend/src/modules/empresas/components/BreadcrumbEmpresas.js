import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Home, Building2, Briefcase, Shield } from 'lucide-react';
const BreadcrumbEmpresas = ({ tipo, onNavigate }) => {
    const items = [
        {
            label: 'Dashboard',
            icon: Home,
            onClick: () => onNavigate('dashboard'),
            isActive: false
        },
        {
            label: 'Empresas Contratistas',
            icon: Building2,
            onClick: () => onNavigate('dashboard'),
            isActive: !tipo
        }
    ];
    if (tipo === 'ejecutoras') {
        items.push({
            label: 'Empresas Ejecutoras',
            icon: Briefcase,
            onClick: () => onNavigate('ejecutoras'),
            isActive: true
        });
    }
    if (tipo === 'supervisoras') {
        items.push({
            label: 'Empresas Supervisoras',
            icon: Shield,
            onClick: () => onNavigate('supervisoras'),
            isActive: true
        });
    }
    return (_jsx("nav", { className: "flex items-center space-x-1 text-sm text-gray-500", "aria-label": "Breadcrumb", children: items.map((item, index) => {
            const Icon = item.icon;
            return (_jsxs("div", { className: "flex items-center", children: [index > 0 && (_jsx("span", { className: "mx-2 text-gray-400", children: "/" })), _jsxs("button", { onClick: item.onClick, className: `flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${item.isActive
                            ? tipo === 'ejecutoras'
                                ? 'text-blue-600 bg-blue-50 font-medium'
                                : tipo === 'supervisoras'
                                    ? 'text-green-600 bg-green-50 font-medium'
                                    : 'text-gray-900 bg-gray-50 font-medium'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), _jsx("span", { children: item.label })] })] }, item.label));
        }) }));
};
export default BreadcrumbEmpresas;
