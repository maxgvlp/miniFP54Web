const winax = require('winax')
const express = require('express')
const bodyParser = require('body-parser')

const logger = require('./config/winston')

const con = new winax.Object('ecrmini.t400')
const password = '12321'
const speed = '115200'

const app = express()
app.use(bodyParser.json())

const PORT = 3000

const logme = (text) => {
  logger.info(`${(new Date()).toISOString()}: ${text}`)
}

app.get('/api/v1/:comport/cashier-reg', function (req, res) {
  const body = req.body

  con.t400me(`open_port;${req.params.comport};${speed};`)
  const result = con.t400me(`cashier_registration;1;${password};`)
  const status = (con.get_last_result).split(';')
  con.t400me(`close_port;`)
  
  logme('Попытка регистрация кассира')
  logme(`Запрос:
        ${ JSON.stringify(body) }`)

  if(result) {
    logme(`Регистрация кассира прошла успешно.`)
  } else {
    logme(`Регистрация кассира не удалась. Код ошибки: ${status[0]}, описание: ${status[1]}`)
  }

  const response = {
    success: result,
    error_code: status[0],
    error: status[1]
  }

  res.send(JSON.stringify(response))
})

app.get('/api/v1/:comport/empty-receipt', function (req, res) {
  const body = req.body

  con.t400me(`open_port;${req.params.comport};${speed};`)
  const result = con.t400me(`print_empty_receipt;`)
  con.t400me(`close_port;`)

  logme('Попытка печати нулевого чека')
  logme(`Запрос:
        ${ JSON.stringify(body) }`)

  if(result) {
    logme(`Печать нулевого чека прошла успешно.`)
  } else {
    logme(`Печать нулевого чека не удалась. Код ошибки: ${status[0]}, описание: ${status[1]}`)
  }

  const response = {
    success: result,
    error_code: status[0],
    error: status[1]
  }

  res.send(JSON.stringify(response))
})

app.get('/api/v1/:comport/receipt', function (req, res) {
  const body = req.body

  let isCash = 0, isReturn = 0

  if (!body.isCash) isCash = 1
  if (body.isReturn) isReturn = 1

  const goods = body.goods

  logme(`Попытка печати ${ body.isCash ? 'наличного' : 'безналичного' } чека ${ body.isReturn ? 'возврата' : 'продажи' }`)
  logme(`Запрос:
        ${ JSON.stringify(body) }`)

  if(goods) {

    con.t400me(`open_port;${req.params.comport};${speed};`)

    con.t400me(`open_receipt;${isReturn};`)
    
    goods.forEach(element => {
      con.t400me(`add_plu;${element.id};0;1;0;0;0;1;0.00;0;${element.name};${element.qty};`)
      con.t400me(`sale_plu;0;0;1;${element.qty};${element.id};${element.price};`)
    });

    const result = con.t400me(`pay;${isCash};0;`)

    con.t400me(`close_port;`)

    if(result) {
      logme(`Печать чека прошла успешно.`)
    } else {
      logme(`Печать чека не удалась. Код ошибки: ${status[0]}, описание: ${status[1]}`)
    }

    const response = {
      success: result,
      error_code: status[0],
      error: status[1]
    }
  
    res.send(JSON.stringify(response))
  } else {
    logme(`Список товаров пуст.`)
    const response = {
      success: false,
      error_code: '---',
      error: 'Не передан список товаров'
    }
  
    res.send(JSON.stringify(response))
  }
})

app.get('/api/v1/:comport/x-report', function (req, res) {
  const body = req.body

  con.t400me(`open_port;${req.params.comport};${speed};`)
  const result = con.t400me(`execute_report;x1;${password};`)
  const status = (con.get_last_result).split(';')
  con.t400me(`close_port;`)

  logme('Попытка выполнения Х-отчета')
  logme(`Запрос:
        ${ JSON.stringify(body) }`)

  if(result) {
    logme(`Выполнение Х-отчета прошло успешно.`)
  } else {
    logme(`Выполнение Х-отчета не удалось. Код ошибки: ${status[0]}, описание: ${status[1]}`)
  }

  const response = {
    success: result,
    error_code: status[0],
    error: status[1]
  }

  res.send(JSON.stringify(response))
})

app.get('/api/v1/:comport/z-report', function (req, res) {
  const body = req.body

  con.t400me(`open_port;${req.params.comport};${speed};`)
  const result = con.t400me(`execute_report;z1;${password};`)
  console.log(con.get_last_result)
  con.t400me(`close_port;`)

  logme('Попытка выполнения Z-отчета')
  logme(`Запрос:
        ${ JSON.stringify(body) }`)

  if(result) {
    logme(`Выполнение Z-отчета прошло успешно.`)
  } else {
    logme(`Выполнение Z-отчета не удалось. Код ошибки: ${status[0]}, описание: ${status[1]}`)
  }

  const response = {
    success: result,
    error_code: status[0],
    error: status[1]
  }

  res.send(JSON.stringify(response))
})

app.listen(PORT, () => {
  console.log(`Cash app listening at localhost:${PORT}`)
  logme('Веб сервер (пере)запущен успешно')
})