import type * as ts from 'typescript/lib/tsserverlibrary';

export {}

declare global {
  namespace Express {
    interface Request {
      typescript: typeof ts;
      languageService: ts.LanguageService;
      languageServiceHost: ts.LanguageServiceHost;
    }
  }
}