// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { run } from './send-email-cron.impl';

run()
  .then((appContext) => appContext.close())
  .then(() => {
    // tslint:disable-next-line:no-console
    console.log('shutting down process');
    process.exit(0);
  })
  .catch((err) => {
    // tslint:disable-next-line:no-console
    console.error(err);
    process.exit(1);
  });
