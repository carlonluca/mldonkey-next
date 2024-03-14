import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'
import { uiLogger } from './app/core/MLLogger'

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => uiLogger.error(err))
