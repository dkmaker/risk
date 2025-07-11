import { useEffect, useState } from "preact/hooks";
import "virtual:uno.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Basic setup to verify Preact is working
    console.log("Preact app initialized successfully!");
  }, []);

  return (
    <div class="screen-container">
      <div class="screen-content">
        <header class="text-center py-8">
          <h1 class="text-heading text-primary">Risk Dice Battle</h1>
          <p class="text-caption mt-2">Modern Preact + TypeScript + UnoCSS Setup</p>
        </header>

        <main class="flex-col-center flex-1 gap-8">
          <div class="card-base text-center">
            <h2 class="text-subheading mb-4">Development Environment Ready</h2>
            <p class="text-body mb-6">
              The development environment has been successfully set up with:
            </p>
            <ul class="text-left space-y-2 text-body">
              <li>✅ Preact {/* {preactVersion} */}</li>
              <li>✅ TypeScript with strict configuration</li>
              <li>✅ UnoCSS with custom theme</li>
              <li>✅ Vitest for testing</li>
              <li>✅ Vite with optimized build</li>
            </ul>
          </div>

          <div class="card-base text-center">
            <h3 class="text-subheading mb-4">Test Counter</h3>
            <p class="text-body mb-4">Count: {count}</p>
            <div class="flex gap-4 justify-center">
              <button class="btn-primary" onClick={() => setCount(count + 1)}>
                Increment
              </button>
              <button class="btn-secondary" onClick={() => setCount(count - 1)}>
                Decrement
              </button>
              <button class="btn-danger" onClick={() => setCount(0)}>
                Reset
              </button>
            </div>
          </div>

          <div class="card-base text-center">
            <h3 class="text-subheading mb-4">Next Steps</h3>
            <p class="text-body mb-4">
              The development environment is ready for Phase 2 - Component Migration
            </p>
            <div class="flex gap-4 justify-center">
              <button class="btn-success">Start Migration</button>
            </div>
          </div>
        </main>

        <footer class="text-center py-4">
          <p class="text-caption">Phase 1 Task 1 Complete - Development Environment Setup</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
