_.extend CF.CurrentData.calculatables,
  {
    ns: "CF.CurrentData.calculatables",
    thrrrow: (message)->
      console.log("THRRRRROWING!" + message)
      throw [@ns, message].join ": "
    # here they would live
    _calculatables: {},

    # add a named function that calculates certain numero per currentData item.
    addCalculatable: (name, calculation)->
      if (not name or not _.isFunction(calculation))
      then @thrrrow " addCalculatable requires 2 params - a name, and a function "
      name = name.trim()
      @_calculatables[name] = calculation

    # get list of items to handle
    getCursor: (selector) ->
      CurrentData.find selector
  }, {
    # run needed calculation agains all or soe of systems.
    # selector going to be list of system names.
    triggerCalc: (name, selector) ->
      i = @
      if not @_calculatables[name]
      then @thrrrow " no calculatable named " + name + " registered "
      if not selector
      then selector = {}
      if selector == 'ALL' then selector = {}

      #if string is passed - then expect it to be comma-separated list
      if _.isString selector
        selector = selector.split ','
        _.each selector, (item) -> item = item.trim()
        selector = {system: {$in: selector}}

      # iterate over selector
      cursor = @getCursor selector
      console.log cursor.fetch().length
      cursor.forEach (item)->
        return if not (item or item._id)
        $set = {}
        key = [CF.CurrentData.calculatables.fieldName, name].join '.'
        updatedAtKey = [CF.CurrentData.calculatables.timestamps.fieldName, name].join '.'
        # calculate value
        $set[key] = i._calculatables[name](item);
        # mark a timestamp - to be changed..?
        $set[updatedAtKey] = new Date();
        CurrentData.update({_id: item._id}, {$set: $set});
        console.log('a')
        true;
  }
