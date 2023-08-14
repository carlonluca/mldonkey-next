import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'
import { logger } from './app/core/MLLogger'

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => logger.error(err))
