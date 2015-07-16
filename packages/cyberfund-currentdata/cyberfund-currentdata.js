// Write your package code here!
CF.CurrentData = {
    selectors: { //todo: rename selectors to avoid confusin (echoes of name->system migration)
        name_symbol: function(name, symbol){
            return {
                symbol: symbol,
                system: name
            }
        },
        name: function(name){
            return {
                system: name
            }
        },
        symbol: function(symbol){
            return {symbol: symbol}
        }
    }
};