import * as tarn from "tarn";
import * as tedious from "tedious";
import { MssqlDialect } from "kysely";

export const dialect = {
    dialect: new MssqlDialect({
      tarn: {
        ...tarn,
        options: {
          min: 0,
          max: 100,
        },
      },
      tedious: {
        ...tedious,
        connectionFactory: () =>
          new tedious.Connection({
            authentication: {
              options: {
                password: process.env.SQL_SERVER_PASSWORD,
                userName: process.env.SQL_SERVER_USER || "sa",
              },
              type: "default",
            },
            options: {
              database: "master",
              port: 1433,
              trustServerCertificate: true,
              connectTimeout: 30000,
            },
            server: process.env.SQL_SERVER_HOST || "localhost",
          }),
      },
    }),
}