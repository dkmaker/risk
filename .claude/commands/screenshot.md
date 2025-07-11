---
allowed-tools: mcp__browser__takeScreenshot, Read
description: Take a screenshot and analyze it based on provided arguments
---

# Screenshot Analysis Command

## Context

Taking a screenshot of the current browser state: !`echo "Current screenshot will be captured and analyzed"`

## Your task

1. **Take a screenshot** using the browser MCP tool
2. **Find the latest screenshot** in the `browsermcp/screenshots/` directory
3. **Read and analyze the screenshot** based on the following criteria: $ARGUMENTS

## Analysis Guidelines

When analyzing the screenshot:
- Focus on the specific aspects mentioned in the arguments
- Provide concrete, actionable feedback
- Identify visual issues, layout problems, or improvements
- Consider user experience and accessibility
- Suggest specific fixes or improvements

## Example Usage

```bash
# Analyze layout issues
/screenshot "Check if the layout is responsive and buttons are properly spaced"

# Check specific UI elements
/screenshot "Analyze the color scheme and visual hierarchy"

# Review functionality
/screenshot "Check if all interactive elements are visible and accessible"
```

## Expected Output

- Screenshot capture confirmation
- Visual analysis based on the provided arguments
- Specific recommendations for improvements
- Code suggestions if applicable