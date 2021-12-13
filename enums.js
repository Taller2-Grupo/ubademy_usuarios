const TipoEvento = {
  USUARIO_CREADO: 'USUARIO_CREADO',
  LOGIN_CREDENCIALES: 'LOGIN_CREDENCIALES',
  LOGIN_GOOGLE: 'LOGIN_GOOGLE',
  USUARIO_BLOQUEADO: 'USUARIO_BLOQUEADO'
}

function esTipoEvento (tipoEventoCandidate) {
  for (const tipoEvento in TipoEvento) {
    if (tipoEvento === tipoEventoCandidate) {
      return true
    }
  }

  return false
}

module.exports = {
  TipoEvento,
  esTipoEvento
}
