// File utility functions for Kiro Project Intelligence Assistant

import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { extname, basename } from 'path';

export async function readFileContent(path: string): Promise<string> {
  return await readFile(path, 'utf-8');
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function getFileExtension(path: string): string {
  return extname(path).toLowerCase();
}

export function isTestFile(path: string): boolean {
  const fileName = basename(path).toLowerCase();
  
  // Check for test file patterns
  if (fileName.includes('.test.') || 
      fileName.includes('.spec.') || 
      fileName.includes('_test.') ||
      fileName.includes('.test-')) {
    return true;
  }
  
  // Check for __tests__ directory
  if (path.includes('__tests__') || path.includes('/__tests__/')) {
    return true;
  }
  
  return false;
}

export function isSourceFile(path: string): boolean {
  const ext = getFileExtension(path);
  const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go', '.rb', '.php', '.cs', '.cpp', '.c'];
  
  return sourceExtensions.includes(ext) && !isTestFile(path);
}

export async function countLines(path: string): Promise<number> {
  try {
    const content = await readFileContent(path);
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

export async function getFileSize(path: string): Promise<number> {
  try {
    const stats = await stat(path);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

export function shouldExclude(path: string): boolean {
  const excludePatterns = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    '.next',
    'out',
    '.cache',
    'vendor',
    '__pycache__',
    '.venv',
    'venv',
    'target',
    'bin',
    'obj'
  ];
  
  return excludePatterns.some(pattern => path.includes(`/${pattern}/`) || path.includes(`\\${pattern}\\`));
}

export function normalizeFilePath(path: string): string {
  return path.replace(/\\/g, '/');
}
