module.exports.errorsCheck = (err, req, res, next) => {
  res.status(505).send({message: 'тестовая ошибка'})

}

