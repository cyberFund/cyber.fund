exports.cfIsAccountHidden = function isHidden(accountId){
  return Session.get("hideAccount_"+(accountId));
};
