export const idlFactory = ({ IDL }) => {
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const TransferRequest = IDL.Record({
    'to_principal' : IDL.Principal,
    'to_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'amount' : Tokens,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text });
  return IDL.Service({
    'transfer' : IDL.Func([TransferRequest], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
