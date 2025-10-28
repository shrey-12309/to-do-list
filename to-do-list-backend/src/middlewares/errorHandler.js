export default function errorHandler(err, req, res, next) {
  try {
    if (res.statusCode === 200) {
      res.statusCode = 500
    }

    const status = res.statusCode || 500

    res.status(status).json({
      error: err.message || 'Internal Server Error',
      success: false,
    })
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
