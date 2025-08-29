// =================================================================
// HELPERS DE VALIDACIÓN PARA FORMULARIO EMPRESA
// Sistema de Valorizaciones - Frontend
// =================================================================
// =================================================================
// CONFIGURACIÓN DE VALIDACIÓN POR DEFECTO
// =================================================================
export const DEFAULT_VALIDATION_CONFIG = {
    campos_requeridos: {
        basica: ['ruc', 'razon_social', 'tipo_empresa'],
        contacto: ['email'], // Email es obligatorio para notificaciones
        representantes: ['representante_legal'], // Al menos uno
        registro: ['estado', 'categoria_contratista'],
        especialidades: [] // Las especialidades son opcionales
    },
    validaciones_especiales: {
        ruc: true,
        email: true,
        telefono: true,
        dni: true
    },
    permitir_datos_parciales: false
};
// =================================================================
// FUNCIONES DE VALIDACIÓN ESPECÍFICAS
// =================================================================
/**
 * Valida formato de RUC peruano
 */
export const validarRUC = (ruc) => {
    if (!ruc)
        return false;
    const rucLimpio = ruc.replace(/\D/g, '');
    // Debe tener 11 dígitos
    if (rucLimpio.length !== 11)
        return false;
    // Debe empezar con 10 o 20
    if (!['10', '20'].includes(rucLimpio.substring(0, 2)))
        return false;
    // Validación de dígito verificador (algoritmo modulo 11)
    const factores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    for (let i = 0; i < 10; i++) {
        suma += parseInt(rucLimpio[i]) * factores[i];
    }
    const resto = suma % 11;
    const digitoVerificador = resto < 2 ? resto : 11 - resto;
    return parseInt(rucLimpio[10]) === digitoVerificador;
};
/**
 * Valida formato de DNI peruano
 */
export const validarDNI = (dni) => {
    if (!dni)
        return false;
    const dniLimpio = dni.replace(/\D/g, '');
    return dniLimpio.length === 8 && /^\d{8}$/.test(dniLimpio);
};
/**
 * Valida formato de email
 */
export const validarEmail = (email) => {
    if (!email)
        return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
/**
 * Valida formato de teléfono peruano
 */
export const validarTelefono = (telefono) => {
    if (!telefono)
        return false;
    const telefonoLimpio = telefono.replace(/\D/g, '');
    // Teléfono fijo: 7 dígitos (01-xxxxxxx)
    // Celular: 9 dígitos (9xxxxxxxx)
    return telefonoLimpio.length >= 7 && telefonoLimpio.length <= 9;
};
// =================================================================
// VALIDADORES POR SECCIÓN
// =================================================================
/**
 * Valida la sección de información básica
 */
export const validarSeccionBasica = (formData, config) => {
    const errores = [];
    const camposRequeridos = config.campos_requeridos.basica;
    // Validar campos requeridos
    camposRequeridos.forEach(campo => {
        const valor = formData[campo];
        if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
            errores.push({
                campo,
                mensaje: `${getCampoLabel(campo)} es requerido`,
                seccion: 'basica',
                tipo: 'requerido'
            });
        }
    });
    // Validaciones específicas
    if (config.validaciones_especiales.ruc && formData.ruc) {
        if (!validarRUC(formData.ruc)) {
            errores.push({
                campo: 'ruc',
                mensaje: 'El RUC ingresado no es válido',
                seccion: 'basica',
                tipo: 'formato'
            });
        }
    }
    // Validar longitud de razón social
    if (formData.razon_social && formData.razon_social.length > 200) {
        errores.push({
            campo: 'razon_social',
            mensaje: 'La razón social no puede exceder 200 caracteres',
            seccion: 'basica',
            tipo: 'longitud'
        });
    }
    return errores;
};
/**
 * Valida la sección de información de contacto
 */
export const validarSeccionContacto = (formData, config) => {
    const errores = [];
    const camposRequeridos = config.campos_requeridos.contacto;
    // Validar campos requeridos
    camposRequeridos.forEach(campo => {
        const valor = formData[campo];
        if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
            errores.push({
                campo,
                mensaje: `${getCampoLabel(campo)} es requerido`,
                seccion: 'contacto',
                tipo: 'requerido'
            });
        }
    });
    // Validaciones específicas
    if (config.validaciones_especiales.email && formData.email) {
        if (!validarEmail(formData.email)) {
            errores.push({
                campo: 'email',
                mensaje: 'Ingrese un email válido',
                seccion: 'contacto',
                tipo: 'formato'
            });
        }
    }
    if (config.validaciones_especiales.telefono && formData.telefono) {
        if (!validarTelefono(formData.telefono)) {
            errores.push({
                campo: 'telefono',
                mensaje: 'Ingrese un teléfono válido (7-9 dígitos)',
                seccion: 'contacto',
                tipo: 'formato'
            });
        }
    }
    // Validar celular si está presente
    if (formData.celular && !validarTelefono(formData.celular)) {
        errores.push({
            campo: 'celular',
            mensaje: 'Ingrese un celular válido (9 dígitos)',
            seccion: 'contacto',
            tipo: 'formato'
        });
    }
    return errores;
};
/**
 * Valida la sección de representantes legales
 */
export const validarSeccionRepresentantes = (formData, config) => {
    const errores = [];
    // Verificar que hay al menos un representante
    const tieneRepresentantePrincipal = formData.representante_legal && formData.representante_legal.trim() !== '';
    const tieneRepresentantesMultiples = formData.representantes && formData.representantes.length > 0;
    if (!tieneRepresentantePrincipal && !tieneRepresentantesMultiples) {
        errores.push({
            campo: 'representante_legal',
            mensaje: 'Debe especificar al menos un representante legal',
            seccion: 'representantes',
            tipo: 'requerido'
        });
    }
    // Validar representante principal si existe
    if (tieneRepresentantePrincipal) {
        if (formData.representante_legal.length > 100) {
            errores.push({
                campo: 'representante_legal',
                mensaje: 'El nombre del representante no puede exceder 100 caracteres',
                seccion: 'representantes',
                tipo: 'longitud'
            });
        }
        // Validar DNI del representante
        if (config.validaciones_especiales.dni && formData.dni_representante) {
            if (!validarDNI(formData.dni_representante)) {
                errores.push({
                    campo: 'dni_representante',
                    mensaje: 'Ingrese un DNI válido (8 dígitos)',
                    seccion: 'representantes',
                    tipo: 'formato'
                });
            }
        }
    }
    // Validar representantes múltiples
    if (formData.representantes) {
        formData.representantes.forEach((representante, index) => {
            if (!representante.nombre || representante.nombre.trim() === '') {
                errores.push({
                    campo: `representantes[${index}].nombre`,
                    mensaje: `El nombre del representante ${index + 1} es requerido`,
                    seccion: 'representantes',
                    tipo: 'requerido'
                });
            }
            if (representante.numero_documento && !validarDNI(representante.numero_documento)) {
                errores.push({
                    campo: `representantes[${index}].numero_documento`,
                    mensaje: `DNI inválido para el representante ${index + 1}`,
                    seccion: 'representantes',
                    tipo: 'formato'
                });
            }
        });
    }
    return errores;
};
/**
 * Valida la sección de registro y estado
 */
export const validarSeccionRegistro = (formData, config) => {
    const errores = [];
    const camposRequeridos = config.campos_requeridos.registro;
    // Validar campos requeridos
    camposRequeridos.forEach(campo => {
        const valor = formData[campo];
        if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
            errores.push({
                campo,
                mensaje: `${getCampoLabel(campo)} es requerido`,
                seccion: 'registro',
                tipo: 'requerido'
            });
        }
    });
    // Validar coherencia entre estado y otros campos
    if (formData.estado === 'INACTIVO' && formData.especialidades && formData.especialidades.length > 0) {
        errores.push({
            campo: 'estado',
            mensaje: 'Una empresa inactiva no debería tener especialidades activas',
            seccion: 'registro',
            tipo: 'conflicto_datos'
        });
    }
    return errores;
};
/**
 * Valida la sección de especialidades
 */
export const validarSeccionEspecialidades = (_formData, _config) => {
    const errores = [];
    // Por ahora las especialidades son opcionales
    // Se puede agregar lógica específica aquí si se requiere
    return errores;
};
// =================================================================
// FUNCIÓN PRINCIPAL DE VALIDACIÓN
// =================================================================
/**
 * Valida todo el formulario y devuelve errores por sección
 */
export const validarFormularioCompleto = (formData, config = DEFAULT_VALIDATION_CONFIG) => {
    const erroresBasica = validarSeccionBasica(formData, config);
    const erroresContacto = validarSeccionContacto(formData, config);
    const erroresRepresentantes = validarSeccionRepresentantes(formData, config);
    const erroresRegistro = validarSeccionRegistro(formData, config);
    const erroresEspecialidades = validarSeccionEspecialidades(formData, config);
    const todosLosErrores = [
        ...erroresBasica,
        ...erroresContacto,
        ...erroresRepresentantes,
        ...erroresRegistro,
        ...erroresEspecialidades
    ];
    const advertencias = [];
    // Generar advertencias basadas en el estado del formulario
    if (!formData.telefono && !formData.celular) {
        advertencias.push('Se recomienda proporcionar al menos un número de contacto');
    }
    if (!formData.especialidades || formData.especialidades.length === 0) {
        advertencias.push('Considere agregar especialidades para mejor clasificación');
    }
    if (formData.consolidacion_exitosa && formData.advertencias_consolidacion) {
        advertencias.push(...formData.advertencias_consolidacion);
    }
    return {
        valido: todosLosErrores.length === 0,
        errores: todosLosErrores,
        errores_por_seccion: {
            basica: erroresBasica,
            contacto: erroresContacto,
            representantes: erroresRepresentantes,
            registro: erroresRegistro,
            especialidades: erroresEspecialidades
        },
        advertencias
    };
};
// =================================================================
// FUNCIONES DE UTILIDAD
// =================================================================
/**
 * Obtiene el label amigable para un campo
 */
export const getCampoLabel = (campo) => {
    const labels = {
        ruc: 'RUC',
        razon_social: 'Razón Social',
        tipo_empresa: 'Tipo de Empresa',
        email: 'Email',
        telefono: 'Teléfono',
        representante_legal: 'Representante Legal',
        dni_representante: 'DNI del Representante',
        estado: 'Estado',
        categoria_contratista: 'Categoría de Contratista',
        direccion: 'Dirección',
        distrito: 'Distrito',
        provincia: 'Provincia',
        departamento: 'Departamento',
        nombre_comercial: 'Nombre Comercial',
        celular: 'Celular',
        domicilio_fiscal: 'Domicilio Fiscal',
        observaciones: 'Observaciones'
    };
    return labels[campo] || campo;
};
/**
 * Valida si un campo específico es válido
 */
export const validarCampo = (campo, _valor, formData, config = DEFAULT_VALIDATION_CONFIG) => {
    const seccion = getSeccionDelCampo(campo);
    if (!seccion)
        return [];
    const validadores = {
        basica: validarSeccionBasica,
        contacto: validarSeccionContacto,
        representantes: validarSeccionRepresentantes,
        registro: validarSeccionRegistro,
        especialidades: validarSeccionEspecialidades
    };
    const erroresSeccion = validadores[seccion](formData, config);
    return erroresSeccion.filter((error) => error.campo === campo);
};
/**
 * Determina a qué sección pertenece un campo
 */
export const getSeccionDelCampo = (campo) => {
    const mapaCampos = {
        ruc: 'basica',
        razon_social: 'basica',
        nombre_comercial: 'basica',
        tipo_empresa: 'basica',
        email: 'contacto',
        telefono: 'contacto',
        celular: 'contacto',
        direccion: 'contacto',
        domicilio_fiscal: 'contacto',
        distrito: 'contacto',
        provincia: 'contacto',
        departamento: 'contacto',
        representante_legal: 'representantes',
        dni_representante: 'representantes',
        representantes: 'representantes',
        estado: 'registro',
        categoria_contratista: 'registro',
        estado_oece: 'registro',
        capacidad_contratacion: 'registro',
        especialidades: 'especialidades',
        especialidades_oece: 'especialidades',
        observaciones: 'registro'
    };
    return mapaCampos[campo] || null;
};
export default {
    validarFormularioCompleto,
    validarCampo,
    validarRUC,
    validarDNI,
    validarEmail,
    validarTelefono,
    getCampoLabel,
    getSeccionDelCampo,
    DEFAULT_VALIDATION_CONFIG
};
