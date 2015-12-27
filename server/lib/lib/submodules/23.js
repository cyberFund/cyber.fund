var THIS = {
  _get: function(k) {
    return this[k];
  },
  _set: function(k, v) {
    return this[k] = v;
  },
  _default: function(k, v) {
    if (!this[k]) {
      return this._set(k, v);
    }
  },
  "default": 'plain text'
};

CF.libsub = CF.libsub || {}
CF.libsub.THIS = THIS
