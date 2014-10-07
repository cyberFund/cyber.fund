import _temp

WEBAPP2_CONFIG = {
  'webapp2_extras.sessions': {
    'secret_key': _temp.COOKIE_KEY,
    'session_max_age': None,
    'cookie_args': {
      'max_age': 31556926,
      'path': '/',
      'secure': None,
      'httponly': True}},
  'webapp2_extras.auth': {
    'user_model': 'model.User',
    'user_attributes': ['name']
  }}

SERVICE_ACCOUNT_EMAIL = _temp.SERVICE_ACCOUNT_EMAIL
SERVICE_ACCOUNT_PASSWORD = _temp.SERVICE_ACCOUNT_PASSWORD
GOOGLE_KEY = _temp.GOOGLE_KEY
GOOGLE_SECRET = _temp.GOOGLE_SECRET
FACEBOOK_KEY = _temp.FACEBOOK_KEY
FACEBOOK_SECRET = _temp.FACEBOOK_SECRET
GITHUB_KEY = _temp.GITHUB_KEY
GITHUB_SECRET = _temp.GITHUB_SECRET
TWITTER_KEY = _temp.TWITTER_KEY
TWITTER_SECRET = _temp.TWITTER_SECRET
VK_KEY = _temp.VK_KEY
VK_SECRET = _temp.VK_SECRET
ANGEL_LIST_KEY = _temp.ANGEL_LIST_KEY
ANGEL_LIST_SECRET = _temp.ANGEL_LIST_SECRET

TX_PER_PAGE = 50

DEADLINE = 60
EXCHANGES = ['mtgox', 'btce', 'bter', 'btcchina', 'cryptsy', 'cex', 'blockchain']
EXCHANGES_TO_IGNORE = ['mtgox']

TX_STATES = ['pending', 'in_progress', 'finished', 'canceled']

CURRENCY_DICT = {
  'BTC': {'label': 'Bitcoin', 'type': 'crypto'},
  'USD': {'label': 'US Dollar', 'type': 'fiat'},
  'BHT': {'label': 'Thai Baht', 'type': 'fiat'},
  'RUB': {'label': 'Russian Ruble', 'type': 'fiat'},
  'SATOSHI': {'label': 'Satoshi', 'type': 'product'},
  'KWH': {'label': 'Power supply unit', 'type': 'product'},
  'SQ': {'label': 'Motherboard', 'type': 'product'},
  'GBR': {'label': 'RAM', 'type': 'product'},
  'UNIT': {'label': 'Hardware', 'type': 'product'},
  'GHz': {'label': 'CPU', 'type': 'product'},
  'MHASH': {'label': 'GPU', 'type': 'product'},
  'GHZ': {'label': 'Gigaherz', 'type': 'product'},
  'GBS': {'label': 'SSD', 'type': 'product'},
  'MN1': {'label': 'MiningContract1', 'type': 'service'},
  'MN2': {'label': 'MiningContract2', 'type': 'service'},
  'ASMBL': {'label': 'Assembling', 'type': 'service'},
  'ANC': {'label': 'Anoncoin', 'type': 'crypto'},
  'CGB': {'label': 'CryptogenicBullion', 'type': 'crypto'},
  'DTC': {'label': 'Datacoin', 'type': 'crypto'},
  'DVC': {'label': 'Devcoin', 'type': 'crypto'},
  'DOGE': {'label': 'Dogecoin', 'type': 'crypto'},
  'FTC': {'label': 'Feathercoin', 'type': 'crypto'},
  'IXC': {'label': 'IXCoin', 'type': 'crypto'},
  'LTC': {'label': 'Litecoin', 'type': 'crypto'},
  'MEC': {'label': 'Megacoin', 'type': 'crypto'},
  'NMC': {'label': 'Namecoin', 'type': 'crypto'},
  'NXT': {'label': 'Next', 'type': 'crypto'},
  'NVC': {'label': 'Novacoin', 'type': 'crypto'},
  'PPC': {'label': 'Peercoin', 'type': 'crypto'},
  'XPM': {'label': 'Primecoin', 'type': 'crypto'},
  'PTS': {'label': 'ProtoShares', 'type': 'crypto'},
  'QRK': {'label': 'Quark', 'type': 'crypto'},
  'TRC': {'label': 'Terracoin', 'type': 'crypto'},
  '42': {'label': '42Coin', 'type': 'crypto'},
  'ADT': {'label': 'AndroidsTokensV2', 'type': 'crypto'},
  'ALF': {'label': 'AlphaCoin', 'type': 'crypto'},
  'AMC': {'label': 'AmericanCoin', 'type': 'crypto'},
  'ARG': {'label': 'Argentum', 'type': 'crypto'},
  'ASC': {'label': 'AsicCoin', 'type': 'crypto'},
  'AUR': {'label': 'AuroraCoin', 'type': 'crypto'},
  'BAT': {'label': 'BatCoin', 'type': 'crypto'},
  'BC': {'label': 'BlackCoin', 'type': 'crypto'},
  'BCX': {'label': 'BattleCoin', 'type': 'crypto'},
  'BEN': {'label': 'Benjamins', 'type': 'crypto'},
  'BET': {'label': 'Betacoin', 'type': 'crypto'},
  'BQC': {'label': 'BBQCoin', 'type': 'crypto'},
  'BTB': {'label': 'BitBar', 'type': 'crypto'},
  'BTE': {'label': 'ByteCoin', 'type': 'crypto'},
  'BTG': {'label': 'BitGem', 'type': 'crypto'},
  'BUK': {'label': 'CryptoBuck', 'type': 'crypto'},
  'CACH': {'label': 'CACHeCoin', 'type': 'crypto'},
  'CAP': {'label': 'BottleCaps', 'type': 'crypto'},
  'CASH': {'label': 'CashCoin', 'type': 'crypto'},
  'CAT': {'label': 'CatCoin', 'type': 'crypto'},
  'CLR': {'label': 'CopperLark', 'type': 'crypto'},
  'CMC': {'label': 'Cosmoscoin', 'type': 'crypto'},
  'CNC': {'label': 'CHNCoin', 'type': 'crypto'},
  'CENT': {'label': 'CENT', 'type': 'crypto'},
  'COL': {'label': 'ColossusCoin', 'type': 'crypto'},
  'CPR': {'label': 'CopperBars', 'type': 'crypto'},
  'CRC': {'label': 'CraftCoin', 'type': 'crypto'},
  'CSC': {'label': 'CasinoCoin', 'type': 'crypto'},
  'CTM': {'label': 'Continuumcoin', 'type': 'crypto'},
  'DBL': {'label': 'Doubloons', 'type': 'crypto'},
  'DEM': {'label': 'eMark', 'type': 'crypto'},
  'DGB': {'label': 'Digibyte', 'type': 'crypto'},
  'DGC': {'label': 'DigitalCoin', 'type': 'crypto'},
  'DMC': {'label': 'DamaCoin', 'type': 'crypto'},
  'DMD': {'label': 'Diamond', 'type': 'crypto'},
  'DRK': {'label': 'DarkCoin', 'type': 'crypto'},
  'EAC': {'label': 'EarthCoin', 'type': 'crypto'},
  'ELC': {'label': 'ElaCoin', 'type': 'crypto'},
  'ELP': {'label': 'ElephantCoin', 'type': 'crypto'},
  'EMC2': {'label': 'Einsteinium', 'type': 'crypto'},
  'EMD': {'label': 'Emerald', 'type': 'crypto'},
  'EXE': {'label': 'ExeCoin', 'type': 'crypto'},
  'EZC': {'label': 'EZCoin', 'type': 'crypto'},
  'FFC': {'label': 'FireflyCoin', 'type': 'crypto'},
  'FLAP': {'label': 'FlappyCoin', 'type': 'crypto'},
  'FLO': {'label': 'FlorinCoin', 'type': 'crypto'},
  'FLT': {'label': 'FlutterCoin', 'type': 'crypto'},
  'FRC': {'label': 'FreiCoin', 'type': 'crypto'},
  'FRK': {'label': 'Franko', 'type': 'crypto'},
  'FST': {'label': 'FastCoin', 'type': 'crypto'},
  'GDC': {'label': 'GrandCoin', 'type': 'crypto'},
  'GLC': {'label': 'Globalcoin', 'type': 'crypto'},
  'GLD': {'label': 'GoldCoin', 'type': 'crypto'},
  'GLX': {'label': 'Galaxycoin', 'type': 'crypto'},
  'GME': {'label': 'GameCoin', 'type': 'crypto'},
  'HBN': {'label': 'HoboNickels', 'type': 'crypto'},
  'HVC': {'label': 'HeavyCoin', 'type': 'crypto'},
  'IFC': {'label': 'InfiniteCoin', 'type': 'crypto'},
  'JKC': {'label': 'JunkCoin', 'type': 'crypto'},
  'KARM': {'label': 'KarmaCoin', 'type': 'crypto'},
  'KDC': {'label': 'KlondikeCoin', 'type': 'crypto'},
  'KGC': {'label': 'KrugerCoin', 'type': 'crypto'},
  'LEAF': {'label': 'LeafCoin', 'type': 'crypto'},
  'LK7': {'label': 'Lucky7Coin', 'type': 'crypto'},
  'LKY': {'label': 'LuckyCoin', 'type': 'crypto'},
  'LOT': {'label': 'LottoCoin', 'type': 'crypto'},
  'LYC': {'label': 'LycanCoin', 'type': 'crypto'},
  'MAX': {'label': 'MaxCoin', 'type': 'crypto'},
  'MEM': {'label': 'MemeCoin', 'type': 'crypto'},
  'MEOW': {'label': 'KittehCoin', 'type': 'crypto'},
  'MINT': {'label': 'MintCoin', 'type': 'crypto'},
  'MNC': {'label': 'MinCoin', 'type': 'crypto'},
  'MOON': {'label': 'MoonCoin', 'type': 'crypto'},
  'MRY': {'label': 'MurrayCoin', 'type': 'crypto'},
  'MST': {'label': 'MasterCoin(Hydro)', 'type': 'crypto'},
  'MZC': {'label': 'MazaCoin', 'type': 'crypto'},
  'NAN': {'label': 'NanoToken', 'type': 'crypto'},
  'NBL': {'label': 'Nibble', 'type': 'crypto'},
  'NEC': {'label': 'NeoCoin', 'type': 'crypto'},
  'NET': {'label': 'Netcoin', 'type': 'crypto'},
  'NRB': {'label': 'NoirBits', 'type': 'crypto'},
  'NYAN': {'label': 'NyanCoin', 'type': 'crypto'},
  'ORB': {'label': 'Orbitcoin', 'type': 'crypto'},
  'OSC': {'label': 'OpenSourceCoin', 'type': 'crypto'},
  'PHS': {'label': 'PhilosopherStone', 'type': 'crypto'},
  'POINTS': {'label': 'CryptsyPoints', 'type': 'crypto'},
  'POT': {'label': 'PotCoin', 'type': 'crypto'},
  'PXC': {'label': 'PhoenixCoin', 'type': 'crypto'},
  'PYC': {'label': 'PayCoin', 'type': 'crypto'},
  'RBBT': {'label': 'RabbitCoin', 'type': 'crypto'},
  'RDD': {'label': 'ReddCoin', 'type': 'crypto'},
  'RED': {'label': 'RedCoin', 'type': 'crypto'},
  'RPC': {'label': 'RonPaulCoin', 'type': 'crypto'},
  'RYC': {'label': 'RoyalCoin', 'type': 'crypto'},
  'SAT': {'label': 'SaturnCoin', 'type': 'crypto'},
  'SBC': {'label': 'StableCoin', 'type': 'crypto'},
  'SMC': {'label': 'SmartCoin', 'type': 'crypto'},
  'SPA': {'label': 'SpainCoin', 'type': 'crypto'},
  'SPT': {'label': 'Spots', 'type': 'crypto'},
  'SRC': {'label': 'SecureCoin', 'type': 'crypto'},
  'STR': {'label': 'StarCoin', 'type': 'crypto'},
  'SXC': {'label': 'SexCoin', 'type': 'crypto'},
  'TAG': {'label': 'TagCoin', 'type': 'crypto'},
  'TAK': {'label': 'TakCoin', 'type': 'crypto'},
  'TEK': {'label': 'TekCoin', 'type': 'crypto'},
  'TGC': {'label': 'TigerCoin', 'type': 'crypto'},
  'TIPS': {'label': 'FedoraCoin', 'type': 'crypto'},
  'TIX': {'label': 'Tickets', 'type': 'crypto'},
  'UNO': {'label': 'Unobtanium', 'type': 'crypto'},
  'UTC': {'label': 'UltraCoin', 'type': 'crypto'},
  'VTC': {'label': 'VertCoin', 'type': 'crypto'},
  'WC': {'label': 'WhiteCoin', 'type': 'crypto'},
  'WDC': {'label': 'WorldCoin', 'type': 'crypto'},
  'XJO': {'label': 'JouleCoin', 'type': 'crypto'},
  'XNC': {'label': 'XenCoin', 'type': 'crypto'},
  'YAC': {'label': 'YaCoin', 'type': 'crypto'},
  'YBC': {'label': 'YBCoin', 'type': 'crypto'},
  'ZCC': {'label': 'ZcCoin', 'type': 'crypto'},
  'ZED': {'label': 'ZedCoin', 'type': 'crypto'},
  'ZEIT': {'label': 'ZeitCoin', 'type': 'crypto'},
  'ZET': {'label': 'ZetaCoin', 'type': 'crypto'},
  'XRP': {'label': 'Ripple', 'type': 'crypto'},
  'MSC': {'label': 'MasterCoin', 'type': 'crypto'},
  'AUTOTRADE': {'label': 'BTC hedge fund by BtcAutoTrader', 'type': 'share'},
  'CLOUD': {'label': 'CryptoCloud', 'type': 'share'},
  'COINFARM': {'label': 'DigitalCoinFarm', 'type': 'share'},
  'CRYPTSY': {'label': 'Cryptsy Exchange', 'type': 'share'},
  'NXXS': {'label': 'NexxusCorp', 'type': 'share'},
  'SCRYPT': {'label': 'Scrypts Mining', 'type': 'share'},
  'CCC': {'label': 'CryptoCoinCharts', 'type': 'share'},
  'MADE': {'label': 'MadeSafeCoin', 'type': 'crypto'},
  'CFS': {'label': 'cyberShare', 'type': 'share'},
  'PIE': {'label': 'cyberPie', 'type': 'fund'},
  'MHASH/DAY': {'label': 'MHash per Day', 'type': 'product'}
}
CURRENCY_LIST = [c for c in CURRENCY_DICT]

MASTER_BTC = '1PcyUY1LT5FsK7mRyQ9u86Vb7uZa67rD4U'

BLOCKCHAIN_SECRET = 'v7pHEmtvAFU7SY8dg6K9FPZvUpDASKK3bWEvpWrNHr7TdGqp6XkGTbWAMY'
BLOCKCHAIN_GUID = _temp.BLOCKCHAIN_GUID
BLOCKCHAIN_PASSWORD = _temp.BLOCKCHAIN_PASSWORD
BLOCKCHAIN_SEND_FROM = '16MCXwYkSjLLhHJBeDok9eh5mP6RYTWkNZ'
CONFIRMATIONS_REQUIRED = 1

CURRENCIES = {
  'ANC': 'Anoncoin',
  'CGB': 'CryptogenicBullion',
  'DTC': 'Datacoin',
  'DVC': 'Devcoin',
  'DOGE': 'Dogecoin',
  'FTC': 'Feathercoin',
  'IXC': 'IXCoin',
  'LTC': 'Litecoin',
  'MEC': 'Megacoin',
  'NMC': 'Namecoin',
  'NXT': 'Next',
  'NVC': 'Novacoin',
  'PPC': 'Peercoin',
  'XPM': 'Primecoin',
  'PTS': 'ProtoShares',
  'QRK': 'Quark',
  'TRC': 'Terracoin',
}
