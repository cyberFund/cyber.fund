const byId = (system) => { $or: [{base: system}, {quote: system}] };
const byMarket = (marketUrl) => { market: marketUrl };
const byTwoIdsOrdered = (base, quote) => { return {base, quote} }
const byTwoIds = (system, other) => {
    return { $or: [
    {base: system, quote: other},
    {quote: system, base: other}
  ] }
};

export { byId, byMarket, byTwoIds, ByTwoIdsOrdered }

const old = {
  // all pairs (direct + reverse) for a system
  byId: function(system) { return { $or: [{base: system}, {quote: system}] }},

  // all pairs on market. n/a for weighted feed
  byMarket: function(marketUrl) { return {market: marketUrl}},

  // all pairs for 2 systems
  byTwoIds: function(system, other) { return { $or: [
    {base: system, quote: other},
    {quote: system, base: other}
  ] }},

  // all pairs by 2 ids, respecting base/quote.
  // for weighted feed there will be only one
  byTwoIdsOrdered: function(base, quote) { return {base: base, quote: quote}}
};
