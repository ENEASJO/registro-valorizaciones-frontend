import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Database, Palette, Save } from 'lucide-react';

const Configuracion = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'usuarios', name: 'Usuarios', icon: User },
    { id: 'notificaciones', name: 'Notificaciones', icon: Bell },
    { id: 'seguridad', name: 'Seguridad', icon: Shield },
    { id: 'datos', name: 'Base de Datos', icon: Database },
    { id: 'apariencia', name: 'Apariencia', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">Administra las preferencias y configuraciones del sistema</p>
      </div>

      <div className="flex gap-6">
        <div className="w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración General</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    defaultValue="Mi Empresa S.A.C."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUC
                  </label>
                  <input
                    type="text"
                    defaultValue="20123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    defaultValue="Av. Principal 123, Lima, Perú"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      defaultValue="(01) 234-5678"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="contacto@miempresa.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda Predeterminada
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>Soles (S/)</option>
                    <option>Dólares (USD)</option>
                    <option>Euros (EUR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona Horaria
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option>Lima (GMT-5)</option>
                    <option>Buenos Aires (GMT-3)</option>
                    <option>Santiago (GMT-4)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button className="btn-primary flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                  </button>
                  <button className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'usuarios' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestión de Usuarios</h2>
              
              <div className="mb-6">
                <button className="btn-primary flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Nuevo Usuario
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Último Acceso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { nombre: 'Juan Pérez', email: 'juan@empresa.com', rol: 'Administrador', estado: 'Activo', ultimo: 'Hace 2 horas' },
                      { nombre: 'María García', email: 'maria@empresa.com', rol: 'Supervisor', estado: 'Activo', ultimo: 'Hace 1 día' },
                      { nombre: 'Carlos López', email: 'carlos@empresa.com', rol: 'Operador', estado: 'Inactivo', ultimo: 'Hace 1 semana' }
                    ].map((usuario, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">{usuario.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            {usuario.rol}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            usuario.estado === 'Activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {usuario.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {usuario.ultimo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">Editar</button>
                          <button className="text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'notificaciones' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Notificaciones</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Notificaciones por Email</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Nueva valorización creada</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Valorización aprobada</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Obra completada</span>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Reporte generado</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Notificaciones del Sistema</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Actualizaciones del sistema</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Respaldo automático completado</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Alertas de seguridad</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button className="btn-primary flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Guardar Preferencias
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'seguridad' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Seguridad</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Políticas de Contraseña</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Requerir mínimo 8 caracteres</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Requerir mayúsculas y minúsculas</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Requerir números</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Requerir caracteres especiales</span>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Autenticación</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Habilitar autenticación de dos factores</span>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Cerrar sesión automáticamente después de</span>
                      <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                        <option>30 minutos</option>
                        <option>1 hora</option>
                        <option>2 horas</option>
                        <option>4 horas</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button className="btn-primary flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Actualizar Seguridad
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'datos' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Base de Datos</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Database className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Estado de la Base de Datos</p>
                      <p className="text-sm text-blue-700">Conectado • PostgreSQL v14.5 • 256 MB usado de 2 GB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Respaldos Automáticos</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Habilitar respaldos automáticos</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Frecuencia de respaldo</span>
                      <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                        <option>Diario</option>
                        <option>Semanal</option>
                        <option>Mensual</option>
                      </select>
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Mantener respaldos por</span>
                      <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                        <option>7 días</option>
                        <option>30 días</option>
                        <option>90 días</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Últimos Respaldos</h3>
                  <div className="space-y-2">
                    {[
                      { fecha: '2024-02-15 03:00', tamaño: '125 MB', estado: 'Completado' },
                      { fecha: '2024-02-14 03:00', tamaño: '123 MB', estado: 'Completado' },
                      { fecha: '2024-02-13 03:00', tamaño: '122 MB', estado: 'Completado' }
                    ].map((respaldo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{respaldo.fecha}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-300">{respaldo.tamaño}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {respaldo.estado}
                          </span>
                          <button className="text-sm text-primary-600 hover:text-primary-800">
                            Restaurar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button className="btn-primary">
                    Crear Respaldo Manual
                  </button>
                  <button className="btn-secondary">
                    Optimizar Base de Datos
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'apariencia' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Apariencia</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Tema</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="relative cursor-pointer">
                      <input type="radio" name="theme" defaultChecked className="sr-only peer" />
                      <div className="p-4 border-2 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-white rounded"></div>
                          <div className="w-12 h-1 bg-gray-300 rounded"></div>
                        </div>
                        <p className="text-sm font-medium">Claro</p>
                      </div>
                    </label>
                    <label className="relative cursor-pointer">
                      <input type="radio" name="theme" className="sr-only peer" />
                      <div className="p-4 border-2 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-gray-900 rounded"></div>
                          <div className="w-12 h-1 bg-gray-700 rounded"></div>
                        </div>
                        <p className="text-sm font-medium">Oscuro</p>
                      </div>
                    </label>
                    <label className="relative cursor-pointer">
                      <input type="radio" name="theme" className="sr-only peer" />
                      <div className="p-4 border-2 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-gradient-to-r from-white to-gray-900 rounded"></div>
                          <div className="w-12 h-1 bg-gray-500 rounded"></div>
                        </div>
                        <p className="text-sm font-medium">Automático</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Color Principal</h3>
                  <div className="flex gap-3">
                    {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-gray-500'].map((color) => (
                      <label key={color} className="relative cursor-pointer">
                        <input type="radio" name="color" className="sr-only peer" />
                        <div className={`w-10 h-10 rounded-lg ${color} peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-gray-900`}></div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Densidad de Interfaz</h3>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Compacta</option>
                    <option>Normal</option>
                    <option>Espaciosa</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button className="btn-primary flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Aplicar Cambios
                  </button>
                  <button className="btn-secondary">
                    Restablecer
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuracion;