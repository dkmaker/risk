#!/usr/bin/env node

/**
 * Code Quality Hook Script
 *
 * This script runs after file modifications to ensure code quality.
 * It uses Biome for linting, formatting, and type checking.
 *
 * Features:
 * - Automatic formatting and linting with Biome
 * - Auto-fix for common issues
 * - AI-assisted error resolution prompts
 * - Blocks execution if unfixable issues remain
 * - Comprehensive error reporting
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AI instructions for common linting issues
const AI_INSTRUCTIONS = {
  noConsoleLog: "Replace console.log with proper logging or remove debugging statements",
  noUnusedVariables: "Remove unused variables or prefix with underscore if intentionally unused",
  noExplicitAny: 'Add proper TypeScript types instead of using "any"',
  noImplicitReturns: "Ensure all code paths return a value or add explicit return undefined",
  noFallthroughCasesInSwitch: "Add break statements or explicit fallthrough comments",
  noUnsafeOptionalChaining: "Add proper null/undefined checks before optional chaining",
  noDoubleEquals: "Use strict equality (===) instead of loose equality (==)",
  noVar: "Use const or let instead of var",
  useConst: "Use const for variables that are never reassigned",
  useTemplate: "Use template literals instead of string concatenation",
  noUselessElse: "Remove unnecessary else blocks or restructure logic",
  noImplicitBoolean: "Be explicit about boolean conversions",
  noParameterAssign: "Avoid reassigning function parameters, use local variables instead",
  noRestrictedGlobals: "Avoid using restricted global variables",
  noShoutyConstants: "Use camelCase for constants unless they are true constants",
  useOptionalChain: "Use optional chaining (?.) for safer property access",
  useSimplifiedLogicExpression: "Simplify complex boolean expressions",
  noExcessiveCognitiveComplexity: "Break down complex functions into smaller, focused functions",
  noUselessCatch: "Remove catch blocks that only re-throw errors without handling them",
  noUselessTernary: "Simplify ternary expressions that can be boolean expressions",
  noUndeclaredVariables: "Declare all variables before use or add proper imports",
  noUnreachable: "Remove unreachable code after return statements",
  noUnusedLabels: "Remove unused labels",
  noSelfAssign: "Remove self-assignments that have no effect",
  noEmptyBlockStatements: "Remove empty blocks or add meaningful content",
  noDuplicateObjectKeys: "Remove duplicate object keys",
  noPrototypeBuiltins: "Use Object.prototype methods safely",
  noSparseArray: "Remove empty slots in arrays",
  useValidTypeof: "Use correct typeof comparisons",
  noGlobalEval: "Avoid using eval() for security reasons",
  noDangerouslySetInnerHtml: "Sanitize HTML content to prevent XSS attacks",
  noNonNullAssertion: "Replace non-null assertion (!) with optional chaining (?.) or proper null checks",
  noArrayIndexKey: "Use stable unique identifiers for React keys instead of array indices",
  useButtonType: "Add explicit type=\"button\" to button elements to prevent form submission",
  useExhaustiveDependencies: "Include all dependencies in React hook dependency arrays",
  useSemanticElements: "Use semantic HTML elements (e.g., <button>) instead of divs with ARIA roles",
  noExcessiveCognitiveComplexity: "Break down complex functions into smaller, focused functions",
};

function parseHookInput() {
  try {
    const input = fs.readFileSync(0, "utf8");
    return JSON.parse(input);
  } catch (error) {
    console.error("Error parsing hook input:", error.message);
    process.exit(1);
  }
}

function saveDebugInfo(hookData, debugInfo) {
  try {
    const debugDir = path.join(path.dirname(__dirname), "hooks_debug");
    
    // Create debug directory if it doesn't exist
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir, { recursive: true });
    }
    
    // Generate filename with timestamp and tool name
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const toolName = hookData.tool_name || "unknown";
    const filename = `${timestamp}_${toolName}.json`;
    const filepath = path.join(debugDir, filename);
    
    // Save debug info
    fs.writeFileSync(filepath, JSON.stringify({
      timestamp: new Date().toISOString(),
      input: hookData,
      ...debugInfo
    }, null, 2));
    
    // Rotate old files - keep only last 10
    const files = fs.readdirSync(debugDir)
      .filter(f => f.endsWith(".json"))
      .map(f => ({ name: f, path: path.join(debugDir, f), time: fs.statSync(path.join(debugDir, f)).mtime }))
      .sort((a, b) => b.time - a.time);
    
    // Delete files beyond the 10th
    if (files.length > 10) {
      files.slice(10).forEach(f => {
        try {
          fs.unlinkSync(f.path);
        } catch (e) {
          // Ignore errors when deleting old files
        }
      });
    }
  } catch (error) {
    // Don't fail the hook if debug logging fails
    console.error("Failed to save debug info:", error.message);
  }
}

function getModifiedFiles(hookData) {
  const files = [];

  if (hookData.tool_name === "Write" && hookData.tool_input?.file_path) {
    files.push(hookData.tool_input.file_path);
  } else if (hookData.tool_name === "Edit" && hookData.tool_input?.file_path) {
    files.push(hookData.tool_input.file_path);
  } else if (hookData.tool_name === "MultiEdit" && hookData.tool_input?.file_path) {
    files.push(hookData.tool_input.file_path);
  }

  // Separate JS/TS files and CSS files
  const jsFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    const isValidExt = [".js", ".ts", ".jsx", ".tsx", ".json"].includes(ext);
    const isInSrc = file.includes("/src/");
    return isValidExt && isInSrc;
  });

  const cssFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    const isValidExt = [".css"].includes(ext);
    const isInSrc = file.includes("/src/");
    return isValidExt && isInSrc;
  });

  return { jsFiles, cssFiles, allFiles: [...jsFiles, ...cssFiles] };
}

function runBiomeCheck(files) {
  try {
    const fileArgs = files.length > 0 ? files.join(" ") : ".";
    const result = execSync(`npx biome check --write --reporter json ${fileArgs}`, {
      encoding: "utf8",
      cwd: process.cwd(),
      stdio: "pipe",
    });
    return { success: true, output: result, json: JSON.parse(result) };
  } catch (error) {
    // Try to parse JSON from stdout even on error
    let jsonOutput = null;
    try {
      if (error.stdout) {
        jsonOutput = JSON.parse(error.stdout);
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    
    return {
      success: false,
      output: error.stdout || "",
      errors: error.stderr || error.message,
      json: jsonOutput
    };
  }
}

function runBiomeFormat(files) {
  try {
    const fileArgs = files.length > 0 ? files.join(" ") : ".";
    const result = execSync(`npx biome format --write --reporter json ${fileArgs}`, {
      encoding: "utf8",
      cwd: process.cwd(),
      stdio: "pipe",
    });
    return { success: true, output: result, json: JSON.parse(result) };
  } catch (error) {
    // Try to parse JSON from stdout even on error
    let jsonOutput = null;
    try {
      if (error.stdout) {
        jsonOutput = JSON.parse(error.stdout);
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    
    return {
      success: false,
      output: error.stdout || "",
      errors: error.stderr || error.message,
      json: jsonOutput
    };
  }
}

function runTypeScriptCheck(files) {
  try {
    // Filter to only TypeScript files
    const tsFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".ts", ".tsx"].includes(ext);
    });

    if (tsFiles.length === 0) {
      return { success: true, output: "No TypeScript files to check" };
    }

    // Run TypeScript compiler on entire project to avoid JSX context issues
    // Individual file checks don't have access to full tsconfig.json context
    const result = execSync("npx tsc --noEmit", {
      encoding: "utf8",
      cwd: process.cwd(),
      stdio: "pipe",
    });
    return { success: true, output: result };
  } catch (error) {
    return {
      success: false,
      output: error.stdout || "",
      errors: error.stderr || error.message,
    };
  }
}

function runStylelintCheck(files) {
  try {
    if (files.length === 0) {
      return { success: true, output: "No CSS files to check" };
    }

    const fileArgs = files.join(" ");
    const result = execSync(`npx stylelint ${fileArgs} --formatter json`, {
      encoding: "utf8",
      cwd: process.cwd(),
      stdio: "pipe",
    });
    
    // Stylelint returns empty array when no issues
    const jsonResult = JSON.parse(result || "[]");
    return { success: true, output: result, json: jsonResult };
  } catch (error) {
    let jsonOutput = null;
    try {
      if (error.stdout) {
        jsonOutput = JSON.parse(error.stdout);
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    
    return {
      success: false,
      output: error.stdout || "",
      errors: error.stderr || error.message,
      json: jsonOutput
    };
  }
}

function runStylelintFix(files) {
  try {
    if (files.length === 0) {
      return { success: true, output: "No CSS files to fix" };
    }

    const fileArgs = files.join(" ");
    const result = execSync(`npx stylelint ${fileArgs} --fix --formatter json`, {
      encoding: "utf8",
      cwd: process.cwd(),
      stdio: "pipe",
    });
    
    const jsonResult = JSON.parse(result || "[]");
    return { success: true, output: result, json: jsonResult };
  } catch (error) {
    let jsonOutput = null;
    try {
      if (error.stdout) {
        jsonOutput = JSON.parse(error.stdout);
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    
    return {
      success: false,
      output: error.stdout || "",
      errors: error.stderr || error.message,
      json: jsonOutput
    };
  }
}

function parseTypeScriptOutput(output, errors) {
  const issues = [];
  const allOutput = `${output}\n${errors || ""}`.trim();

  if (!allOutput) {
    return issues;
  }

  const lines = allOutput.split("\n");

  for (const line of lines) {
    // Parse TypeScript error format: src/file.ts(line,col): error TSxxxx: message
    const match = line.match(/^(.+?\.tsx?)\((\d+),(\d+)\):\s+(error|warning)\s+TS(\d+):\s+(.+)$/);
    if (match) {
      const [, file, lineNum, col, severity, code, message] = match;
      issues.push({
        file: file.replace(`${process.cwd()}/`, ""), // Make path relative
        line: Number.parseInt(lineNum),
        column: Number.parseInt(col),
        severity: severity,
        code: `TS${code}`,
        message: message.trim(),
        source: "typescript",
      });
    }
  }

  return issues;
}

function parseStylelintJsonOutput(jsonOutput) {
  const issues = [];
  
  if (!jsonOutput || !Array.isArray(jsonOutput)) {
    return issues;
  }
  
  // Stylelint JSON format is an array of file results
  for (const fileResult of jsonOutput) {
    if (!fileResult.warnings || fileResult.warnings.length === 0) {
      continue;
    }
    
    const file = fileResult.source;
    
    for (const warning of fileResult.warnings) {
      issues.push({
        file: file,
        line: warning.line || 0,
        column: warning.column || 0,
        severity: warning.severity || "error",
        message: warning.text || "Unknown CSS issue",
        rule: warning.rule || "unknown"
      });
    }
  }
  
  return issues;
}

function parseBiomeJsonOutput(jsonOutput) {
  const issues = [];
  
  if (!jsonOutput || !jsonOutput.diagnostics) {
    return issues;
  }
  
  // Process each diagnostic
  for (const diagnostic of jsonOutput.diagnostics) {
    // Skip if not an error or warning
    if (!["error", "warning"].includes(diagnostic.severity)) {
      continue;
    }
    
    // Extract file path
    let file = "unknown";
    let line = 0;
    let column = 0;
    
    if (diagnostic.location) {
      // Get file path
      if (diagnostic.location.path && diagnostic.location.path.file) {
        file = diagnostic.location.path.file;
      }
      
      // Get line and column from span and source code
      if (diagnostic.location.span && diagnostic.location.sourceCode) {
        const spanStart = diagnostic.location.span[0];
        const sourceCode = diagnostic.location.sourceCode;
        
        // Count lines and columns based on character position
        let charCount = 0;
        let currentLine = 1;
        let currentColumn = 1;
        
        for (let i = 0; i < sourceCode.length && i < spanStart; i++) {
          if (sourceCode[i] === '\n') {
            currentLine++;
            currentColumn = 1;
          } else {
            currentColumn++;
          }
        }
        
        line = currentLine;
        column = currentColumn;
      }
    }
    
    // Extract rule name from category
    const rule = diagnostic.category || "unknown";
    
    // Extract message text
    let message = "Unknown error";
    if (diagnostic.message && Array.isArray(diagnostic.message)) {
      // Message is an array of objects with content
      message = diagnostic.message.map(m => m.content || "").join(" ").trim();
    } else if (diagnostic.description) {
      message = diagnostic.description;
    }
    
    issues.push({
      file: file,
      line: line,
      column: column,
      severity: diagnostic.severity,
      message: message,
      rule: rule
    });
  }
  
  return issues;
}

// Keep the old parser as fallback for when JSON parsing fails
function parseBiomeOutput(output) {
  const issues = [];
  const lines = output.split("\n");

  let currentFile = null;
  let currentLine = null;
  let currentRule = null;
  let currentMessage = null;
  let collectingMessage = false;

  for (const line of lines) {
    // Parse file paths with line numbers and rule names
    // Format: /path/to/file.tsx:10:17 lint/style/noNonNullAssertion
    const fileMatch = line.match(/^(.+?\.(js|ts|jsx|tsx|json)):(\d+):(\d+)\s+lint\/(\w+\/\w+)/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      currentLine = Number.parseInt(fileMatch[3]);
      currentRule = fileMatch[5];
      collectingMessage = false;
      currentMessage = null;
      continue;
    }

    // Parse error indicator line
    if (line.includes("× ") && currentFile) {
      collectingMessage = true;
      currentMessage = line.replace(/^\s*×\s*/, "").trim();
      
      // Create the issue immediately
      if (currentFile && currentLine && currentRule && currentMessage) {
        issues.push({
          file: currentFile,
          line: currentLine,
          severity: "error",
          message: currentMessage,
          rule: currentRule
        });
        
        // Reset for next issue
        currentFile = null;
        currentLine = null;
        currentRule = null;
        currentMessage = null;
        collectingMessage = false;
      }
    }
  }

  return issues;
}

function generateAIPrompts(issues) {
  const prompts = [];
  const ruleCount = {};

  for (const issue of issues) {
    if (issue.rule && AI_INSTRUCTIONS[issue.rule]) {
      if (!ruleCount[issue.rule]) {
        ruleCount[issue.rule] = 0;
      }
      ruleCount[issue.rule]++;
    }
  }

  for (const [rule, count] of Object.entries(ruleCount)) {
    if (AI_INSTRUCTIONS[rule]) {
      prompts.push({
        rule,
        count,
        instruction: AI_INSTRUCTIONS[rule],
        files: issues
          .filter((i) => i.rule === rule)
          .map((i) => i.file)
          .filter((v, i, a) => a.indexOf(v) === i),
      });
    }
  }

  return prompts;
}

// Removed unused formatErrorOutput function - functionality is covered by generateClaudeInstructions

function generateClaudeInstructions(biomeIssues, tsIssues, cssIssues, aiPrompts, hadInitialIssues = false) {
  // If no actual issues remain, only show auto-fix message if we actually fixed something
  if (biomeIssues.length === 0 && tsIssues.length === 0 && cssIssues.length === 0) {
    if (hadInitialIssues) {
      return "All auto-fixable issues have been resolved. No manual fixes required.";
    }
    // This shouldn't happen - if no issues remain and no initial issues, the hook should exit earlier
    return "No code quality issues found.";
  }

  let instructions = "Code quality issues found that require your immediate attention:\n\n";

  // TypeScript issues - highest priority
  if (tsIssues.length > 0) {
    instructions += "🔷 CRITICAL: TypeScript Type Errors (must be fixed first):\n";
    for (const issue of tsIssues) {
      const location = `${issue.file}:${issue.line}:${issue.column}`;
      instructions += `  • ${location}: ${issue.message} (${issue.code})\n`;

      // Add specific fix instructions based on common TypeScript errors
      if (issue.code === "TS2322") {
        instructions += "    → Fix: Correct the type assignment or update the interface\n";
      } else if (issue.code === "TS2339") {
        instructions += "    → Fix: Add the missing property or check the property name\n";
      } else if (issue.code === "TS2304") {
        instructions += "    → Fix: Import the missing type or check the type name\n";
      }
    }
    instructions += "\n";
  }

  // Biome issues - code quality
  if (biomeIssues.length > 0) {
    instructions += "🔸 Code Quality Issues (fix after TypeScript errors):\n";
    const fileGroups = {};
    for (const issue of biomeIssues) {
      if (!fileGroups[issue.file]) {
        fileGroups[issue.file] = [];
      }
      fileGroups[issue.file].push(issue);
    }

    for (const [file, issues] of Object.entries(fileGroups)) {
      instructions += `  📁 ${file}:\n`;
      for (const issue of issues) {
        const location = issue.line ? `line ${issue.line}` : "unknown location";
        instructions += `    • ${location}: ${issue.message}`;
        if (issue.rule) {
          instructions += ` (${issue.rule})`;
        }
        instructions += "\n";
      }
    }
    instructions += "\n";
  }

  // CSS issues
  if (cssIssues.length > 0) {
    instructions += "🎨 CSS Issues:\n";
    const fileGroups = {};
    for (const issue of cssIssues) {
      if (!fileGroups[issue.file]) {
        fileGroups[issue.file] = [];
      }
      fileGroups[issue.file].push(issue);
    }

    for (const [file, issues] of Object.entries(fileGroups)) {
      instructions += `  📁 ${file}:\n`;
      for (const issue of issues) {
        const location = issue.line ? `line ${issue.line}` : "unknown location";
        instructions += `    • ${location}: ${issue.message}`;
        if (issue.rule) {
          instructions += ` (${issue.rule})`;
        }
        instructions += "\n";
      }
    }
    instructions += "\n";
  }

  // AI-assisted fix suggestions
  if (aiPrompts.length > 0) {
    instructions += "💡 Automated Fix Suggestions:\n";
    for (const prompt of aiPrompts) {
      instructions += `  🔧 ${prompt.rule} (${prompt.count} occurrences):\n`;
      instructions += `     ${prompt.instruction}\n`;
      instructions += `     Files: ${prompt.files.join(", ")}\n\n`;
    }
  }

  // Clear action plan
  instructions += "📋 ACTION REQUIRED:\n";
  if (tsIssues.length > 0) {
    instructions += "1. Fix all TypeScript type errors first (these prevent compilation)\n";
  }
  if (biomeIssues.length > 0) {
    instructions += `${tsIssues.length > 0 ? "2" : "1"}. Address the remaining code quality issues\n`;
  }
  instructions += `${tsIssues.length > 0 || biomeIssues.length > 0 ? (tsIssues.length > 0 && biomeIssues.length > 0 ? "3" : "2") : "1"}. Save the file again to re-run quality checks\n\n`;

  instructions +=
    "ℹ️ Note: All auto-fixable formatting and linting issues have already been resolved automatically.\n";

  // Add guidance for expected errors during multi-file refactoring
  if (tsIssues.length > 0) {
    instructions +=
      "⚠️ IMPORTANT: If these TypeScript errors are expected during multi-file refactoring (e.g., adding a new function that will be used in the next file), you may continue with the next file. The errors should resolve once all related files are updated.\n";
  }

  return instructions;
}

function main() {
  const hookData = parseHookInput();
  const debugInfo = {
    startTime: new Date().toISOString(),
    steps: [],
    errors: [],
    finalResult: null
  };

  // Only process file modification tools
  if (!["Write", "Edit", "MultiEdit"].includes(hookData.tool_name)) {
    debugInfo.finalResult = "Skipped - not a file modification tool";
    saveDebugInfo(hookData, debugInfo);
    process.exit(0);
  }

  const { jsFiles, cssFiles, allFiles } = getModifiedFiles(hookData);
  debugInfo.modifiedFiles = { jsFiles, cssFiles, allFiles };

  if (allFiles.length === 0) {
    // Silent exit for non-relevant files
    debugInfo.finalResult = "Skipped - no relevant files";
    saveDebugInfo(hookData, debugInfo);
    process.exit(0);
  }

  // Step 1: Run initial check to see if there are any issues before auto-fixing
  const initialLintResult = jsFiles.length > 0 ? runBiomeCheck(jsFiles) : { success: true };
  const initialTsResult = jsFiles.length > 0 ? runTypeScriptCheck(jsFiles) : { success: true };
  const initialCssResult = cssFiles.length > 0 ? runStylelintCheck(cssFiles) : { success: true };
  const hadInitialIssues = !(initialLintResult.success && initialTsResult.success && initialCssResult.success);
  
  debugInfo.steps.push({
    step: "initial_check",
    lintResult: initialLintResult,
    tsResult: initialTsResult,
    cssResult: initialCssResult,
    hadIssues: hadInitialIssues
  });

  // Step 2: Run formatting (silently)
  const formatResult = jsFiles.length > 0 ? runBiomeFormat(jsFiles) : { success: true };
  const cssFixResult = cssFiles.length > 0 ? runStylelintFix(cssFiles) : { success: true };
  debugInfo.steps.push({
    step: "format",
    jsResult: formatResult,
    cssResult: cssFixResult
  });

  // Step 3: Run linting with auto-fix (first pass)
  const lintResult1 = jsFiles.length > 0 ? runBiomeCheck(jsFiles) : { success: true };
  debugInfo.steps.push({
    step: "lint_pass1",
    result: lintResult1
  });

  if (!lintResult1.success) {
    // Run Biome again after auto-fix to see if issues remain
    const lintResult2 = runBiomeCheck(jsFiles);
    debugInfo.steps.push({
      step: "lint_pass2",
      result: lintResult2
    });
  }

  // Step 4: Run TypeScript checking
  const tsResult = jsFiles.length > 0 ? runTypeScriptCheck(jsFiles) : { success: true };
  debugInfo.steps.push({
    step: "typescript_check",
    result: tsResult
  });

  // Step 5: Final verification - run all checks again to get current state
  const finalLintResult = jsFiles.length > 0 ? runBiomeCheck(jsFiles) : { success: true };
  const finalCssResult = cssFiles.length > 0 ? runStylelintCheck(cssFiles) : { success: true };
  debugInfo.steps.push({
    step: "final_lint_check",
    jsResult: finalLintResult,
    cssResult: finalCssResult
  });

  // Parse only remaining issues that couldn't be auto-fixed
  let remainingBiomeIssues = [];
  if (!finalLintResult.success) {
    if (finalLintResult.json) {
      // Use JSON parser if available
      remainingBiomeIssues = parseBiomeJsonOutput(finalLintResult.json);
    } else {
      // Fallback to text parser
      remainingBiomeIssues = parseBiomeOutput(`${finalLintResult.output}\n${finalLintResult.errors || ""}`);
    }
  }
  const tsIssues = tsResult.success ? [] : parseTypeScriptOutput(tsResult.output, tsResult.errors);
  
  let cssIssues = [];
  if (!finalCssResult.success && finalCssResult.json) {
    cssIssues = parseStylelintJsonOutput(finalCssResult.json);
  }

  // Only generate AI prompts for remaining unfixable Biome issues
  const aiPrompts = generateAIPrompts(remainingBiomeIssues);
  
  debugInfo.parsedIssues = {
    biomeIssues: remainingBiomeIssues,
    tsIssues: tsIssues,
    cssIssues: cssIssues,
    aiPrompts: aiPrompts
  };

  // Check if all checks passed after auto-fixing
  if (finalLintResult.success && tsResult.success && finalCssResult.success) {
    debugInfo.finalResult = hadInitialIssues ? "Success - auto-fixed all issues" : "Success - no issues found";
    saveDebugInfo(hookData, debugInfo);
    if (hadInitialIssues) {
      console.error("✅ All auto-fixable issues have been resolved.");
    }
    process.exit(0);
  } else if (remainingBiomeIssues.length === 0 && tsIssues.length === 0 && cssIssues.length === 0) {
    // No actual issues found, but commands reported failure (e.g., no files to process)
    // Check if it's because no files were processed
    const noFilesProcessed = finalLintResult.errors && finalLintResult.errors.includes("No files were processed");
    if (noFilesProcessed) {
      debugInfo.finalResult = "Success - no files to process (files outside src/)";
    } else {
      debugInfo.finalResult = "Success - no issues found";
    }
    saveDebugInfo(hookData, debugInfo);
    process.exit(0);
  } else {
    // Generate specific instructions for Claude to fix the issues
    const instructions = generateClaudeInstructions(
      remainingBiomeIssues,
      tsIssues,
      cssIssues,
      aiPrompts,
      hadInitialIssues
    );

    // Use advanced JSON output to instruct Claude how to fix the issues
    const hookResponse = {
      decision: "block",
      reason: instructions,
    };
    
    debugInfo.finalResult = "Blocked - issues found";
    debugInfo.hookResponse = hookResponse;
    debugInfo.instructions = instructions;
    saveDebugInfo(hookData, debugInfo);

    // Output the instructions to stderr so Claude can see them
    console.error(instructions);

    // Exit with code 2 to block execution
    process.exit(2);
  }
}

// Run the main function
main();
