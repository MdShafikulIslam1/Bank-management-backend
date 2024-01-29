/* eslint-disable no-console */

import app from './app';
import config from './config';

async function bootstrap() {
  try {
    app.listen(config.port, () => {
      console.log(
        `Express Backend Setup Application listening on port ${config.port}`
      );
    });
  } catch (error) {
    console.error('failed to connect', error);
  }
}
bootstrap();
