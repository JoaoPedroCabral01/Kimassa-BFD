export function diasParaVencer(data) {
  const hoje = new Date();
  const validade = new Date(data);
  const diff = validade - hoje;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
