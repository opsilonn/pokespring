import multer from 'multer'

function fileFilter (req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png']

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Wrong file type !')
    error.code = 'LIMIT_FILE_TYPES'
    return cb(error, false)
  }

  cb(null, true)
}

const upload = multer({
  dest: './temp',
  fileFilter,
  limits: {
    fileSize: 20000000 // 20Mo
  }
})

/**
 * @param { String } fieldName
 */
function middleware (fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (!err) { return next() }

      if (err.code === 'LIMIT_FILE_TYPES') {
        return res.status(400).json('Wrong file type !')
      }
      console.log('Request errored', err) // eslint-disable-line
      res.sendStatus(500)
    })
  }
}

export default middleware
