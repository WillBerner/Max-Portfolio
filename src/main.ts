import { bootstrapApplication } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .then((appRef) => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');

    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
      const router = appRef.injector.get(Router);
      router.navigateByUrl(redirect, { replaceUrl: true }).catch((err) => console.error(err));
    }
  })
  .catch((err) => console.error(err));
