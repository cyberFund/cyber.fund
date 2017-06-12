const turnover = function(systemDocument){
  let instance = systemDocument;

  let metrics = instance.metrics;
  if (metrics.cap && metrics.cap.btc) {
    return 100.0 * metrics.turnover;
  }
  return 0;

}
export {
  turnover
}
