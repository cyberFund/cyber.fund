// Write your package code here!
CF.CurrentData = {
    selectors: {
        system_symbol: function(name, symbol){
            return {
                "token.token_symbol": symbol,
                system: name
            }
        },
        system: function(name){
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