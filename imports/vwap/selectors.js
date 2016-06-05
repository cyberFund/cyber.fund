module.exports = {
  pairsById: (system) => { return { $or: [{base: system}, {quote: system}] }},
  pairsByMarket: (marketUrl) => { return {market: marketUrl}}
};
