"use strict";
import winston from 'winston'
import util from ('util')

var ansi = {
  "reset": "\x1B[0m",
  "hicolor": "\x1B[1m",
  "underline": "\x1B[4m",
  "inverse": "\x1B[7m",
  // foreground colors
  "black": "\x1B[30m",
  "red": "\x1B[31m",
  "green": "\x1B[32m",
  "yellow": "\x1B[33m",
  "blue": "\x1B[34m",
  "magenta": "\x1B[35m",
  "cyan": "\x1B[36m",
  "white": "\x1B[37m",
  // background colors
  "bg_black": "\x1B[40m",
  "bg_red": "\x1B[41m",
  "bg_green": "\x1B[42m",
  "bg_yellow": "\x1B[43m",
  "bg_blue": "\x1B[44m",
  "bg_magenta": "\x1B[45m",
  "bg_cyan": "\x1B[46m",
  "bg_white": "\x1B[47m"
}

_.extend(CF.Utils, {


  logger: logger,
});

export default {
  logger: logger,
//  getLogger: Logger
}
