import {CurrentData} from '/imports/api/collections'
import calcs from './calcs'
const calculatables = {
  ns: "CF_CurrentData_calculatables",
  fields: { "calculatable": 1 },
  fieldsExclude: {'calculatable': 0},
  fieldName: "calculatable",
  timestamps: {
    fieldName: '_t_calc',
    fields: {'_t_calc': 1},
    fieldsExclude: {'_t_calc': 0}
  },
  thrrrow: function(message) {
    console.log("THRRRRROWING!" + message);
    throw [this.ns, message].join(": ");
  },
  _calculatables: {},
  addCalculatable: function(name, calculation) {
    if (!name || !_.isFunction(calculation)) {
      this.thrrrow(" addCalculatable requires 2 params - a name, and a function ");
    }
    name = name.trim();
    return this._calculatables[name] = calculation;
  },
  getCursor: function(selector) {
    return CurrentData.find(selector);
  },
  triggerCalc: function(name, selector) {
    var cursor, i;
    i = this;
    if (!this._calculatables[name]) {
      this.thrrrow(" no calculatable named " + name + " registered ");
    }
    if (!selector) {
      selector = {};
    }
    if (selector === 'ALL') {
      selector = {};
    }
    if (_.isString(selector)) {
      selector = selector.split(',');
      _.each(selector, function(item) {
        return item = item.trim();
      });
      selector = {
        _id: {
          $in: selector
        }
      };
    }
    cursor = this.getCursor(selector);
    return cursor.forEach(function(item) {
      var $set, key, updatedAtKey;
      if (!(item || item._id)) {
        return;
      }
      $set = {};
      key = [i.fieldName, name].join('.');
      updatedAtKey = [i.timestamps.fieldName, name].join('.');
      $set[key] = i._calculatables[name](item);
      $set[updatedAtKey] = new Date();
      CurrentData.update({
        _id: item._id
      }, {
        $set: $set
      });
      return true;
    });
  },
  lib: require('./calcs'),
  helpers: require('./helpers'),
  params: require('./params'),
  calcs: calcs
}

module.exports = calculatables;
