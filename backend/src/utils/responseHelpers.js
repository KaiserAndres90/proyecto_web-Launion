export const ok = (res, data, message = 'Operación realizada correctamente') =>
  res.status(200).json({
    success: true,
    message,
    data,
  });

export const created = (
  res,
  data,
  message = 'Registro creado correctamente'
) =>
  res.status(201).json({
    success: true,
    message,
    data,
  });

export const notFound = (res, message = 'Registro no encontrado') =>
  res.status(404).json({
    success: false,
    message,
  });
