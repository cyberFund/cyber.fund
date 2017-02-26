export default function () {
  return {
    "flags.rating_do_not_display": {
      $ne: true
    },
    "calculatable.RATING.sum": {
      $gte: 1
    },
    "metrics.tradeVolume": {
      $gte: 0.2
    }
  };
}
