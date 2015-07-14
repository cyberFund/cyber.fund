// Write your package code here!
CF.CurrentData = {
    selectors: {
        name_symbol: function(name, symbol){
            return {
                symbol: symbol,
                $or: [{"aliases.CurrencyName": name},{"name": name}]
            }
        },
        name: function(name){
            return {
                $or: [{"aliases.CurrencyName": name},{"name": name}]
            }
        },
        symbol: function(symbol){
            return {symbol: symbol}
        }
    }
};