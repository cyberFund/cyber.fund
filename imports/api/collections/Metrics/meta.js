module.exports = {
  "fields": [
    [ ['name', 'timeline'], ['type', 'string'], ['values', ['Enum', ['current', null]]] ],
    [ ['name', 'type'], ['type', 'string']],
    [ ['name', 'price_usd'], ['type', 'number'], ['meta', ['Type', 'price']] ],
    [ ['name', 'price_btc'], ['type', 'number'], ['meta', ['Type', 'price']] ],
    [ ['name', 'total_supply'], ['type', 'number'], ['meta', ['Type', 'supply']] ],
    [ ['name', 'available_supply'], ['type', 'number'], ['meta', ['Type', 'supply']] ],
    [ ['name', 'virtual_supply'], ['type', 'number'], ['meta', ['Type', 'supply']] ],
    [ ['name', 'cap_btc'], ['type', 'number'], ['meta', ['Type', 'cap']] ],
    [ ['name', 'cap_usd'], ['type', 'number'], ['meta', ['Type', 'cap']] ],
    [ ['name', 'cap_aud'], ['type', 'number'], ['meta', ['Type', 'cap']] ],
    [ ['name', 'cap_eth'], ['type', 'number'], ['meta', ['Type', 'cap']] ],
    [ ['name', 'meta'], ['type', 'object'] ]
  ]
}
