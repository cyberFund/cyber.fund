
import _session from '/imports/api/cfUtils/_session'

Template['fiatSelector'].onRendered(function(){
  this.$select = this.$("select");
  this.$select.material_select();
})

Template['fiatSelector'].helpers({
  isSelected: (fiat) => {
    return _session.get("fiat") === fiat ? 'selected' : ''
  }
})

Template['fiatSelector'].events({
  'change .fiat-selector': function (e, t){
    _session.set('fiat', $(e.currentTarget).val());
  }
})
