export const checkRole = (...rolesPermitidos) => {
  const roles = rolesPermitidos.length === 1 && Array.isArray(rolesPermitidos[0])
    ? rolesPermitidos[0]
    : rolesPermitidos;

  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Se requiere autenticación',
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción',
      });
    }

    return next();
  };
};

// Compatibilidad con el uso previo y con variantes que reciben roles separados.
export const autorizarRoles = (...rolesPermitidos) =>
  checkRole(rolesPermitidos);
