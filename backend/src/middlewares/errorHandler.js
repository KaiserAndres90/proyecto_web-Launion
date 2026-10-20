const errorHandler = (error, _req, res, _next) => {
  let statusCode = Number.isInteger(error.statusCode)
    ? error.statusCode
    : Number.isInteger(error.status)
      ? error.status
      : 500;
  let message = error.message || 'Error interno del servidor';

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'El identificador o valor proporcionado no es válido';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Los datos proporcionados no son válidos';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'Ya existe un registro con esos datos';
  } else if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError'
  ) {
    statusCode = 401;
    message =
      error.name === 'TokenExpiredError'
        ? 'El token ha expirado'
        : 'El token no es válido';
  } else if (error.name === 'MulterError') {
    statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    message =
      error.code === 'LIMIT_FILE_SIZE'
        ? 'El archivo supera el tamaño máximo permitido'
        : 'La carga de archivos no es válida';
  } else if (statusCode >= 500) {
    message = 'Error interno del servidor';
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
