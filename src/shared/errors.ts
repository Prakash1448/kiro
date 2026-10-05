// Custom error classes for Kiro Project Intelligence Assistant

export class InvalidPathError extends Error {
  constructor(path: string) {
    super(`Invalid path: ${path}`);
    this.name = 'InvalidPathError';
  }
}

export class AnalysisError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'AnalysisError';
  }
}

export class ReviewError extends Error {
  constructor(message: string, public readonly filePath?: string) {
    super(message);
    this.name = 'ReviewError';
  }
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
