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

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

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

function getModifiedFiles(hookData) {
  const files = [];

  if (hookData.tool_name === "Write" && hookData.tool_input?.file_path) {
    files.push(hookData.tool_input.file_path);
  } else if (hookData.tool_name === "Edit" && hookData.tool_input?.file_path) {
    files.push(hookData.tool_input.file_path);
  } else if (hookData.tool_name === "MultiEdit" && hookData.tool_input?.file_path) {
    files.push(hookData.tool_input.file_path);
  }

  // Filter to only include JS/TS/JSON files
  return files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".js", ".ts", ".jsx", ".tsx", ".json"].includes(ext);
  });
}

function runBiomeCheck(files) {
  try {
    const fileArgs = files.length > 0 ? files.join(" ") : ".";
    const result = execSync(`npx biome check --apply ${fileArgs}`, {
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

function runBiomeFormat(files) {
  try {
    const fileArgs = files.length > 0 ? files.join(" ") : ".";
    const result = execSync(`npx biome format --write ${fileArgs}`, {
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
    const result = execSync(`npx tsc --noEmit`, {
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

function parseTypeScriptOutput(output, errors) {
  const issues = [];
  const allOutput = (output + "\n" + (errors || "")).trim();

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
        file: file.replace(process.cwd() + "/", ""), // Make path relative
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

function parseBiomeOutput(output) {
  const issues = [];
  const lines = output.split("\n");

  let currentFile = null;
  let currentIssue = null;

  for (const line of lines) {
    // Parse file paths
    if (line.includes("━━━") && line.includes(".")) {
      const match = line.match(/━━━\s*(.+?\.(js|ts|jsx|tsx|json))/);
      if (match) {
        currentFile = match[1];
      }
    }

    // Parse error lines
    if (line.includes("✖") || line.includes("⚠")) {
      const match = line.match(/([✖⚠])\s*(.+?)(?:\s+(\w+\/\w+))?$/);
      if (match) {
        const [, severity, message, ruleId] = match;
        currentIssue = {
          file: currentFile,
          severity: severity === "✖" ? "error" : "warning",
          message: message.trim(),
          rule: ruleId,
          line: null,
        };
      }
    }

    // Parse line numbers
    if (currentIssue && line.includes("│")) {
      const match = line.match(/(\d+)\s*│/);
      if (match) {
        currentIssue.line = Number.parseInt(match[1]);
        issues.push(currentIssue);
        currentIssue = null;
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

function formatErrorOutput(biomeIssues, tsIssues, aiPrompts) {
  const allIssues = [...biomeIssues, ...tsIssues];

  if (allIssues.length === 0) {
    return "All code quality checks passed! ✅";
  }

  let output = `\n🚨 Code Quality Issues Found (${allIssues.length} total)\n\n`;

  // Group issues by file
  const fileIssues = {};
  for (const issue of allIssues) {
    if (!fileIssues[issue.file]) {
      fileIssues[issue.file] = [];
    }
    fileIssues[issue.file].push(issue);
  }

  // Display issues by file
  for (const [file, fileIssuesList] of Object.entries(fileIssues)) {
    output += `📁 ${file}:\n`;
    for (const issue of fileIssuesList) {
      const location = issue.line ? `line ${issue.line}` : "unknown location";
      const column = issue.column ? `:${issue.column}` : "";
      const severity = issue.severity === "error" ? "❌" : "⚠️";
      const sourceIcon = issue.source === "typescript" ? "🔷" : "🔸";

      output += `   ${severity} ${sourceIcon} ${location}${column}: ${issue.message}`;

      if (issue.rule) {
        output += ` (${issue.rule})`;
      } else if (issue.code) {
        output += ` (${issue.code})`;
      }
      output += "\n";
    }
    output += "\n";
  }

  // Display AI assistance prompts for Biome issues
  if (aiPrompts.length > 0) {
    output += "🤖 AI-Assisted Fixes:\n\n";
    for (const prompt of aiPrompts) {
      output += `🔧 ${prompt.rule} (${prompt.count} occurrences):\n`;
      output += `   💡 ${prompt.instruction}\n`;
      output += `   📂 Files: ${prompt.files.join(", ")}\n\n`;
    }
  }

  // Display TypeScript issues summary
  if (tsIssues.length > 0) {
    output += `🔷 TypeScript Issues: ${tsIssues.length} type errors require manual fixes\n\n`;
  }

  // Display summary
  if (biomeIssues.length > 0) {
    output += `🔸 Biome Issues: ${biomeIssues.length} linting issues require manual fixes\n\n`;
  }

  output += "❌ Code quality checks failed. Please fix the issues above before continuing.\n";
  output += "ℹ️ All auto-fixable issues have already been resolved by the hook.\n";

  return output;
}

function generateClaudeInstructions(biomeIssues, tsIssues, aiPrompts, hadInitialIssues = false) {
  // If no actual issues remain, only show auto-fix message if we actually fixed something
  if (biomeIssues.length === 0 && tsIssues.length === 0) {
    if (hadInitialIssues) {
      return "All auto-fixable issues have been resolved. No manual fixes required.";
    } else {
      // This shouldn't happen - if no issues remain and no initial issues, the hook should exit earlier
      return "No code quality issues found.";
    }
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

  // Only process file modification tools
  if (!["Write", "Edit", "MultiEdit"].includes(hookData.tool_name)) {
    process.exit(0);
  }

  const modifiedFiles = getModifiedFiles(hookData);

  if (modifiedFiles.length === 0) {
    // Silent exit for non-relevant files
    process.exit(0);
  }

  // Step 1: Run initial check to see if there are any issues before auto-fixing
  const initialLintResult = runBiomeCheck(modifiedFiles);
  const initialTsResult = runTypeScriptCheck(modifiedFiles);
  const hadInitialIssues = !initialLintResult.success || !initialTsResult.success;

  // Step 2: Run formatting (silently)
  const formatResult = runBiomeFormat(modifiedFiles);

  // Step 3: Run linting with auto-fix (first pass)
  const lintResult1 = runBiomeCheck(modifiedFiles);

  if (!lintResult1.success) {
    // Run Biome again after auto-fix to see if issues remain
    const lintResult2 = runBiomeCheck(modifiedFiles);
  }

  // Step 4: Run TypeScript checking
  const tsResult = runTypeScriptCheck(modifiedFiles);

  // Step 5: Final verification - run all checks again to get current state
  const finalLintResult = runBiomeCheck(modifiedFiles);

  // Parse only remaining issues that couldn't be auto-fixed
  const remainingBiomeIssues = finalLintResult.success
    ? []
    : parseBiomeOutput(finalLintResult.output + "\n" + (finalLintResult.errors || ""));
  const tsIssues = tsResult.success ? [] : parseTypeScriptOutput(tsResult.output, tsResult.errors);

  // Only generate AI prompts for remaining unfixable Biome issues
  const aiPrompts = generateAIPrompts(remainingBiomeIssues);

  // Check if all checks passed after auto-fixing
  if (finalLintResult.success && tsResult.success) {
    if (hadInitialIssues) {
      console.log("✅ All auto-fixable issues have been resolved!");
    } else {
      console.log("✅ All code quality checks passed!");
    }
    process.exit(0);
  } else {
    // Generate specific instructions for Claude to fix the issues
    const instructions = generateClaudeInstructions(
      remainingBiomeIssues,
      tsIssues,
      aiPrompts,
      hadInitialIssues
    );

    // Use advanced JSON output to instruct Claude how to fix the issues
    const hookResponse = {
      decision: "block",
      reason: instructions,
    };

    // Output JSON response to stdout for Claude to process
    console.log(JSON.stringify(hookResponse, null, 2));

    // Exit with code 2 to block execution
    process.exit(2);
  }
}

// Run the main function
main();
