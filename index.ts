import { Request, Response, NextFunction } from 'express'
import Logger, { createLogger, LoggerOptions } from 'bunyan'

export function getLogger(opts: LoggerOptions) {
  return createLogger(opts)
}

export function loggerMiddleware(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {

    res.on('finished', () => {
      let headers = Object.keys(req.headers)
        .filter(header => header.toLowerCase() !== 'authorization')
        .reduce((acc, header) => {
          acc[header] = header
          return acc
        }, { } as Record<string, string>)

      logger.info({
        status: res.status,
        method: req.method,
        path: req.path,
        headers: headers
      }, 'after')
    })

    next()
  }
}

export function logErrorMiddleware(logger: Logger) {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    let headers = Object.keys(req.headers)
      .filter(header => header.toLowerCase() !== 'authorization')
      .reduce((acc, header) => {
        acc[header] = header
        return acc
      }, { } as Record<string, string>)

    logger.error({
      status: res.status,
      method: req.method,
      path: req.path,
      headers: headers,
      err: err
    })
    next(err)
  }
}
