// import winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

// const fileRotateTransport = new DailyRotateFile({
//     filename: 'logs/application-%DATE%.log',
//     datePattern: 'YYYY-MM-DD-HH-mm',
//     maxSize: '1m', // 1MB
//     maxFiles: '14d', // keep logs for 14 days
//     zippedArchive: true,
// });

// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp({
//             format: 'YYYY-MM-DD HH:mm:ss'
//         }),
//         winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
//     ),
//     transports: [
//         new winston.transports.Console(),
//         fileRotateTransport
//     ],
// });

// export default logger;
