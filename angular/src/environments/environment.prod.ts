import { Config } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'Quizlet_Fake',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44340',
    redirectUri: baseUrl,
    clientId: 'Quizlet_Fake_App',
    responseType: 'code',
    scope: 'offline_access Quizlet_Fake',
  },
  apis: {
    default: {
      url: 'https://localhost:44340',
      rootNamespace: 'Quizlet_Fake',
    },
  },
} as Config.Environment;
