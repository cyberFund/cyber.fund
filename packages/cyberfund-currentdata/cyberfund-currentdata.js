// Write your package code here!
CF.CurrentData = {
    selectors: { //todo: rename selectors to avoid confusin (echoes of name->system migration)
        name_symbol: function(name, symbol){
            return {
                "token.token_symbol": symbol,
                system: name
            }
        },
        name: function(name){
            return {
                system: name
            }
        },
        symbol: function(symbol){
            return {"token.token_symbol": symbol}
        },
        dependents: function(system){
            return {"dependencies": system};
        }
    }
};