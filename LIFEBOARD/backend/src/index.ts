import app from './app';
import { env } from './config/env';

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`🚀 LifeBoard API running on port ${PORT}`);
  console.log(`📝 Environment: ${env.nodeEnv}`);
});
