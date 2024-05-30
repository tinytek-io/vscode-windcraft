import ts from "typescript/lib/tsserverlibrary";
import type { Request, Response, NextFunction } from "express";

export function typescriptProgramMiddleware(
  languageServiceHost: ts.LanguageServiceHost,
  languageService: ts.LanguageService,
  typescript: typeof ts
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    req.languageServiceHost = languageServiceHost;
    req.languageService = languageService;
    req.typescript = typescript;
    next();
  };
}
