export default function checkWipAccess(req, res, next) {
  if (!req.usuario) return res.status(401).json({ msg: 'Sesion no valida' });
  return next();
}
