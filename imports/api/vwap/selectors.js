module.exports = {

  // all pairs (direct + reverse) for a system
  pairsById: (system) => { return { $or: [{base: system}, {quote: system}] }},

  // all pairs on market. n/a for weighted feed
  pairsByMarket: (marketUrl) => { return {market: marketUrl}},

  // all pairs for 2 systems
  pairsByTwoIds: (system, other) => { return { $or: [
    {base: system, quote: other},
    {quote: system, base: other}
  ] }},

  // all pairs by 2 ids, respecting base/quote.
  // for weighted feed there will be only one
  pairsByTwoIdsOrdered: (base, quote) => { return {base: base, quote: quote}}
};
