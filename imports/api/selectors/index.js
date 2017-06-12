// return name of currently picked fiat. as it s given by xchange
function fiat(){
  const fiat = _session.get('fiat');
  if (fiat==='') return 'Bitcoin';
  return fiat;
}

// return token of currently picked fiat. see `fiatSelector` template
// todo: move to imports
function fiatToken(){
  const fiat = _session.get('fiat');
  if (fiat==="") return `BTC`;
  //todo exploit chg
  if (fiat==="Euro") return 'EUR';
  if (fiat==="US Dollar") return 'USD';
}

export {
  fiat, fiatToken
}
