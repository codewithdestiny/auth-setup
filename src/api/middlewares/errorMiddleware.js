import httpStatusCodes from "../../config/httpStatusCodes.js";
import winston from 'winston';

const errorMiddleware = (err, req, res, next) => {
    
    /**
     * @Error Code is 11000  & duplicates
    */
    const error = {...err};


    let logger = new winston.Logger({
        transports: [
            new winston.transports.File({
                level: 'verbose',
                timestamp: new Date(),
                filename: 'logs/error.log',
                json: false
            }),
            new winston.transports.Console({
                level: 'error',
                timestamp: new Date(),
                filename: 'logs/error.log',
                json: false
            })
        ]
    })

    logger.stream = {
        write: function(message, encoding) {
          logger.info(message);
        }
      };
    

    if(err.code === 11000){

        const duplicates = error.keyValue;

        console.log(duplicates)

        Object.entries(duplicates).map( ([key, value]) => {
            return res.status(httpStatusCodes.BAD_REQUEST).json({
                error: true,
                description :`Record Exist || ${value}`
            })
        })
    }

    if(err.code === "ESOCKET"){
        return res.status(httpStatusCodes.BAD_REQUEST).json({
            error: true,
            description: err.message
        })
    }

    if(err?.response?.data['verified'] == "Expired"){
        return res.status(httpStatusCodes.BAD_REQUEST).json({
            error: true,
            description: "Invalid or Expired OTP"
        })
    }

}

export default errorMiddleware;