Template['fiatSelector'].onRendered(function(){
  this.$select = this.$("select");
  this.$select.material_select();
})

Template['fiatSelector'].helpers({
  isSelected: (fiat) => {
    return CF.Utils._session.get("fiat") === fiat ? 'selected' : ''
  }
})

Template['fiatSelector'].events({
  'change .fiat-selector': function (e, t){
    CF.Utils._session.set('fiat', $(e.currentTarget).val());
  }
})
