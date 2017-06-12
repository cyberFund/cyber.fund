module.exports = {
  tradePairs: {
    // all pairs (direct + reverse) for a system
    byId: (system) => { return { $or: [{base: system}, {quote: system}] }},

    // all pairs on market. n/a for weighted feed
    byMarket: (marketUrl) => { return {market: marketUrl}},

    // all pairs for 2 systems
    byTwoIds: (system, other) => { return { $or: [
      {base: system, quote: other},
      {quote: system, base: other}
    ] }},

    // all pairs by 2 ids, respecting base/quote.
    // for weighted feed there will be only one
    byTwoIdsOrdered: (base, quote) => { return {base: base, quote: quote}}
  }
};
