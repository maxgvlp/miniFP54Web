const appRoot = require('app-root-path')
const winston = require('winston')
require('winston-daily-rotate-file')

const transport = new winston.transports.DailyRotateFile({
  filename: `${appRoot}/logs/%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  zippedArchive: false
})

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    transport
  ]
})

module.exports = logger