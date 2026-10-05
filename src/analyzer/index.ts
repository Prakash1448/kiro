// Project Analyzer - Scans and analyzes project structure

import { glob } from 'glob';
import { resolve, relative, sep, parse } from 'path';
import { stat } from 'fs/promises';
import { 
  ProjectAnalysis, 
  DirectoryNode, 
  AnalysisOptions 
} from '../shared/types.js';
import { 
  isTestFile, 
  isSourceFile, 
  countLines, 
  getFileExtension, 
  shouldExclude,
  normalizeFilePath
} from '../shared/file-utils.js';
import { InvalidPathError } from '../shared/errors.js';

const LARGE_FILE_THRESHOLD = 500;
const MAX_FILES = 100000;

export async function analyzeProject(
  projectPath: string, 
  options: AnalysisOptions = {}
): Promise<ProjectAnalysis> {
  const absolutePath = resolve(projectPath);
  
  // Validate path exists
  try {
    const stats = await stat(absolutePath);
    if (!stats.isDirectory()) {
      throw new InvalidPathError(`Path is not a directory: ${projectPath}`);
    }
  } catch (error) {
    throw new InvalidPathError(`Path does not exist: ${projectPath}`);
  }
  
  // Build ignore patterns from options
  const defaultIgnore = ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**', '**/coverage/**'];
  const ignorePatterns = options.excludePatterns 
    ? [...defaultIgnore, ...options.excludePatterns]
    : defaultIgnore;
  
  // Find all files
  const pattern = `${absolutePath}/**/*`;
  const allFiles = await glob(pattern, { 
    nodir: true,
    ignore: ignorePatterns
  });
  
  // Limit file count for performance
  if (allFiles.length > MAX_FILES) {
    throw new Error(`Project has too many files (${allFiles.length}). Maximum: ${MAX_FILES}`);
  }
  
  // Filter excluded files
  const files = allFiles.filter(f => !shouldExclude(f));
  
  // Classify files
  let sourceFiles = 0;
  let testFiles = 0;
  const filesByExtension: Record<string, number> = {};
  const largeFiles: Array<{ path: string; lines: number }> = [];
  
  // Analyze files in parallel
  await Promise.all(files.map(async (file) => {
    const ext = getFileExtension(file);
    filesByExtension[ext] = (filesByExtension[ext] || 0) + 1;
    
    if (isTestFile(file)) {
      testFiles++;
    } else if (isSourceFile(file)) {
      sourceFiles++;
    }
    
    // Check for large files (only for source files to save time)
    if (isSourceFile(file) || isTestFile(file)) {
      const lines = await countLines(file);
      if (lines > LARGE_FILE_THRESHOLD) {
        const relativePath = relative(absolutePath, file);
        largeFiles.push({ path: normalizeFilePath(relativePath), lines });
      }
    }
  }));
  
  // Sort large files by line count descending
  largeFiles.sort((a, b) => b.lines - a.lines);
  
  // Build directory tree
  const directoryTree = buildDirectoryTree(absolutePath, files);
  
  return {
    totalFiles: files.length,
    sourceFiles,
    testFiles,
    filesByExtension,
    largeFiles: largeFiles.slice(0, 10), // Top 10 largest files
    directoryTree,
    analyzedAt: new Date().toISOString()
  };
}

function buildDirectoryTree(basePath: string, files: string[]): DirectoryNode {
  const root: DirectoryNode = {
    name: parse(basePath).name || basePath,
    type: 'directory',
    children: []
  };
  
  // Build tree structure
  const tree = new Map<string, DirectoryNode>();
  tree.set('', root);
  
  files.forEach(filePath => {
    const relativePath = relative(basePath, filePath);
    const parts = relativePath.split(sep);
    
    let currentPath = '';
    let parentNode = root;
    
    // Create directory nodes
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}${sep}${part}` : part;
      
      if (!tree.has(currentPath)) {
        const dirNode: DirectoryNode = {
          name: part,
          type: 'directory',
          children: []
        };
        parentNode.children = parentNode.children || [];
        parentNode.children.push(dirNode);
        tree.set(currentPath, dirNode);
      }
      
      parentNode = tree.get(currentPath)!;
    }
    
    // Add file node
    const fileName = parts[parts.length - 1];
    const fileNode: DirectoryNode = {
      name: fileName,
      type: 'file'
    };
    parentNode.children = parentNode.children || [];
    parentNode.children.push(fileNode);
  });
  
  // Sort children (directories first, then alphabetically)
  sortTreeNodes(root);
  
  return root;
}

function sortTreeNodes(node: DirectoryNode): void {
  if (node.children) {
    node.children.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
    node.children.forEach(child => {
      if (child.type === 'directory') {
        sortTreeNodes(child);
      }
    });
  }
}

export function classifyFile(filePath: string): 'source' | 'test' | 'other' {
  if (isTestFile(filePath)) {
    return 'test';
  } else if (isSourceFile(filePath)) {
    return 'source';
  }
  return 'other';
}
