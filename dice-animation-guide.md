# Complete Guide to Dice Rolling Animations: CSS, JavaScript & Advanced Techniques

## Table of Contents
1. [Introduction](#introduction)
2. [Basic CSS 3D Dice Creation](#basic-css-3d-dice-creation)
3. [JavaScript Animation Control](#javascript-animation-control)
4. [Advanced CSS Animations](#advanced-css-animations)
5. [Shake and Bounce Effects](#shake-and-bounce-effects)
6. [Physics-Based Animations](#physics-based-animations)
7. [Popular Libraries and Frameworks](#popular-libraries-and-frameworks)
8. [Performance Optimization](#performance-optimization)
9. [Sound Effects Integration](#sound-effects-integration)
10. [Complete Working Examples](#complete-working-examples)
11. [Best Practices](#best-practices)

---

## Introduction

Creating realistic dice rolling animations for web applications involves combining CSS 3D transforms, JavaScript timing controls, and often physics simulations. This guide provides comprehensive code examples and techniques for implementing dice animations that look and feel authentic.

### Key Technologies
- **CSS 3D Transforms**: For basic 3D dice visualization
- **JavaScript**: For animation control and timing
- **CSS Keyframes**: For smooth animation sequences
- **Physics Libraries**: For realistic movement (Three.js, Cannon.js)
- **GSAP**: For advanced animation control

---

## Basic CSS 3D Dice Creation

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Dice Animation</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="dice-container">
        <div class="dice" id="dice">
            <div class="dice-face front">
                <div class="dot"></div>
            </div>
            <div class="dice-face back">
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="dice-face right">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="dice-face left">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="dice-face top">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="dice-face bottom">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    </div>
    
    <button onclick="rollDice()">Roll Dice</button>
    
    <script src="script.js"></script>
</body>
</html>
```

### CSS for 3D Dice

```css
/* Basic styling and container setup */
body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    font-family: Arial, sans-serif;
}

.dice-container {
    perspective: 1000px;
    perspective-origin: center center;
}

/* Main dice styling */
.dice {
    position: relative;
    width: 100px;
    height: 100px;
    transform-style: preserve-3d;
    transition: transform 0.5s;
    margin: 50px;
}

/* Dice face styling */
.dice-face {
    position: absolute;
    width: 100px;
    height: 100px;
    background: #fff;
    border: 2px solid #333;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
}

/* 3D positioning for each face */
.front  { transform: rotateY(  0deg) translateZ(50px); }
.back   { transform: rotateY(180deg) translateZ(50px); }
.right  { transform: rotateY( 90deg) translateZ(50px); }
.left   { transform: rotateY(-90deg) translateZ(50px); }
.top    { transform: rotateX( 90deg) translateZ(50px); }
.bottom { transform: rotateX(-90deg) translateZ(50px); }

/* Dice dots */
.dot {
    width: 16px;
    height: 16px;
    background: #333;
    border-radius: 50%;
    margin: 4px;
}

/* Specific face layouts */
.front { /* Face 1 */
    justify-content: center;
    align-items: center;
}

.back { /* Face 2 */
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    padding: 20px;
}

.right { /* Face 3 */
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    padding: 15px;
}
.right .dot:nth-child(2) {
    align-self: center;
}

.left { /* Face 4 */
    justify-content: space-between;
    align-items: stretch;
    flex-direction: column;
    padding: 15px;
}
.left .dot:nth-child(1),
.left .dot:nth-child(2) {
    align-self: flex-start;
}
.left .dot:nth-child(3),
.left .dot:nth-child(4) {
    align-self: flex-end;
}

.top { /* Face 5 */
    justify-content: space-between;
    align-items: stretch;
    flex-direction: column;
    padding: 15px;
}
.top .dot:nth-child(1),
.top .dot:nth-child(2) {
    align-self: flex-start;
}
.top .dot:nth-child(3) {
    align-self: center;
}
.top .dot:nth-child(4),
.top .dot:nth-child(5) {
    align-self: flex-end;
}

.bottom { /* Face 6 */
    justify-content: space-between;
    align-items: stretch;
    flex-direction: column;
    padding: 15px;
}
.bottom .dot:nth-child(1),
.bottom .dot:nth-child(2),
.bottom .dot:nth-child(3) {
    align-self: flex-start;
}
.bottom .dot:nth-child(4),
.bottom .dot:nth-child(5),
.bottom .dot:nth-child(6) {
    align-self: flex-end;
}

/* Animation classes */
.dice.rolling {
    animation: rollDice 2s ease-out;
}

@keyframes rollDice {
    0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
    25% { transform: rotateX(90deg) rotateY(180deg) rotateZ(90deg); }
    50% { transform: rotateX(180deg) rotateY(360deg) rotateZ(180deg); }
    75% { transform: rotateX(270deg) rotateY(540deg) rotateZ(270deg); }
    100% { transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg); }
}

/* Final positions for each face */
.dice[data-face="1"] { transform: rotateX(0deg) rotateY(0deg); }
.dice[data-face="2"] { transform: rotateX(0deg) rotateY(180deg); }
.dice[data-face="3"] { transform: rotateX(0deg) rotateY(-90deg); }
.dice[data-face="4"] { transform: rotateX(0deg) rotateY(90deg); }
.dice[data-face="5"] { transform: rotateX(-90deg) rotateY(0deg); }
.dice[data-face="6"] { transform: rotateX(90deg) rotateY(0deg); }

/* Button styling */
button {
    padding: 12px 24px;
    font-size: 16px;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
    transition: background 0.3s;
}

button:hover {
    background: #ff5252;
}

button:disabled {
    background: #ccc;
    cursor: not-allowed;
}
```

---

## JavaScript Animation Control

### Basic Dice Rolling Function

```javascript
// Global variables
let isRolling = false;
const dice = document.getElementById('dice');

// Main dice rolling function
function rollDice() {
    if (isRolling) return; // Prevent multiple rolls
    
    isRolling = true;
    const button = document.querySelector('button');
    button.disabled = true;
    
    // Add rolling animation class
    dice.classList.add('rolling');
    
    // Generate random number (1-6)
    const result = Math.floor(Math.random() * 6) + 1;
    
    // Remove rolling class and set final position after animation
    setTimeout(() => {
        dice.classList.remove('rolling');
        dice.setAttribute('data-face', result);
        
        // Re-enable button
        setTimeout(() => {
            isRolling = false;
            button.disabled = false;
        }, 500);
    }, 2000);
    
    console.log(`Dice rolled: ${result}`);
}

// Advanced rolling with custom duration and easing
function rollDiceAdvanced(duration = 2000, finalValue = null) {
    return new Promise((resolve) => {
        if (isRolling) return resolve(null);
        
        isRolling = true;
        const result = finalValue || Math.floor(Math.random() * 6) + 1;
        
        // Start animation
        dice.classList.add('rolling');
        
        // End animation
        setTimeout(() => {
            dice.classList.remove('rolling');
            dice.setAttribute('data-face', result);
            
            setTimeout(() => {
                isRolling = false;
                resolve(result);
            }, 300);
        }, duration);
    });
}

// Frame-by-frame animation for more control
function rollDiceFrameByFrame() {
    if (isRolling) return;
    
    isRolling = true;
    let frame = 0;
    const totalFrames = 60; // 1 second at 60fps
    const finalResult = Math.floor(Math.random() * 6) + 1;
    
    function animate() {
        frame++;
        
        // Random intermediate rotations
        const randomX = Math.random() * 360;
        const randomY = Math.random() * 360;
        const randomZ = Math.random() * 360;
        
        dice.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg) rotateZ(${randomZ}deg)`;
        
        if (frame < totalFrames) {
            requestAnimationFrame(animate);
        } else {
            // Set final position
            dice.setAttribute('data-face', finalResult);
            dice.style.transform = ''; // Reset to CSS-controlled transform
            isRolling = false;
        }
    }
    
    requestAnimationFrame(animate);
}
```

### Advanced Animation with Easing

```javascript
// Custom easing functions
const easingFunctions = {
    easeOut: t => 1 - Math.pow(1 - t, 3),
    easeInOut: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    bounce: t => {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }
};

// Enhanced dice rolling with easing
function rollDiceWithEasing(duration = 2000, easing = 'easeOut') {
    if (isRolling) return;
    
    isRolling = true;
    const startTime = performance.now();
    const finalResult = Math.floor(Math.random() * 6) + 1;
    const initialRotation = { x: 0, y: 0, z: 0 };
    const targetRotation = {
        x: 720 + (finalResult * 60), // Extra spins plus final position
        y: 900 + (finalResult * 45),
        z: 450 + (finalResult * 30)
    };
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunctions[easing](progress);
        
        // Interpolate rotation values
        const currentRotation = {
            x: initialRotation.x + (targetRotation.x - initialRotation.x) * easedProgress,
            y: initialRotation.y + (targetRotation.y - initialRotation.y) * easedProgress,
            z: initialRotation.z + (targetRotation.z - initialRotation.z) * easedProgress
        };
        
        dice.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg) rotateZ(${currentRotation.z}deg)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Set final position
            dice.setAttribute('data-face', finalResult);
            dice.style.transform = ''; // Reset to CSS-controlled transform
            isRolling = false;
        }
    }
    
    requestAnimationFrame(animate);
}
```

---

## Advanced CSS Animations

### Complex Keyframe Animations

```css
/* Multi-stage rolling animation */
@keyframes complexRoll {
    0% {
        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        animation-timing-function: ease-out;
    }
    20% {
        transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg) translateY(-30px);
        animation-timing-function: ease-in-out;
    }
    40% {
        transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg) translateY(-50px);
        animation-timing-function: ease-in-out;
    }
    60% {
        transform: rotateX(1080deg) rotateY(540deg) rotateZ(270deg) translateY(-30px);
        animation-timing-function: ease-in-out;
    }
    80% {
        transform: rotateX(1440deg) rotateY(720deg) rotateZ(360deg) translateY(-10px);
        animation-timing-function: ease-out;
    }
    90% {
        transform: rotateX(1620deg) rotateY(810deg) rotateZ(405deg) translateY(0px);
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    100% {
        transform: rotateX(1800deg) rotateY(900deg) rotateZ(450deg);
        animation-timing-function: ease-in;
    }
}

/* Bounce effect animation */
@keyframes bounceRoll {
    0% {
        transform: rotateX(0deg) rotateY(0deg) scale(1) translateY(0px);
    }
    25% {
        transform: rotateX(180deg) rotateY(90deg) scale(1.1) translateY(-20px);
    }
    50% {
        transform: rotateX(360deg) rotateY(180deg) scale(1) translateY(0px);
    }
    65% {
        transform: rotateX(450deg) rotateY(225deg) scale(0.95) translateY(5px);
    }
    75% {
        transform: rotateX(540deg) rotateY(270deg) scale(1.05) translateY(-10px);
    }
    85% {
        transform: rotateX(630deg) rotateY(315deg) scale(0.98) translateY(2px);
    }
    95% {
        transform: rotateX(710deg) rotateY(355deg) scale(1.02) translateY(-5px);
    }
    100% {
        transform: rotateX(720deg) rotateY(360deg) scale(1) translateY(0px);
    }
}

/* Elastic animation with overshoot */
@keyframes elasticRoll {
    0% {
        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    60% {
        transform: rotateX(900deg) rotateY(600deg) rotateZ(300deg);
        animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    100% {
        transform: rotateX(720deg) rotateY(540deg) rotateZ(270deg);
    }
}

/* Apply animations */
.dice.rolling-complex { animation: complexRoll 3s ease-out; }
.dice.rolling-bounce { animation: bounceRoll 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.dice.rolling-elastic { animation: elasticRoll 2s ease-out; }
```

### CSS Custom Properties for Dynamic Animations

```css
:root {
    --dice-size: 100px;
    --animation-duration: 2s;
    --bounce-height: 30px;
    --rotation-multiplier: 720deg;
}

.dice {
    width: var(--dice-size);
    height: var(--dice-size);
    animation-duration: var(--animation-duration);
}

.dice-face {
    width: var(--dice-size);
    height: var(--dice-size);
}

/* Dynamic animation with CSS custom properties */
@keyframes dynamicRoll {
    0% {
        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0px);
    }
    25% {
        transform: 
            rotateX(calc(var(--rotation-multiplier) * 0.25)) 
            rotateY(calc(var(--rotation-multiplier) * 0.3)) 
            rotateZ(calc(var(--rotation-multiplier) * 0.2))
            translateY(calc(var(--bounce-height) * -1));
    }
    50% {
        transform: 
            rotateX(calc(var(--rotation-multiplier) * 0.5)) 
            rotateY(calc(var(--rotation-multiplier) * 0.6)) 
            rotateZ(calc(var(--rotation-multiplier) * 0.4))
            translateY(calc(var(--bounce-height) * -1.5));
    }
    75% {
        transform: 
            rotateX(calc(var(--rotation-multiplier) * 0.75)) 
            rotateY(calc(var(--rotation-multiplier) * 0.9)) 
            rotateZ(calc(var(--rotation-multiplier) * 0.6))
            translateY(calc(var(--bounce-height) * -0.5));
    }
    100% {
        transform: 
            rotateX(var(--rotation-multiplier)) 
            rotateY(var(--rotation-multiplier)) 
            rotateZ(var(--rotation-multiplier))
            translateY(0px);
    }
}

.dice.rolling-dynamic {
    animation: dynamicRoll var(--animation-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## Shake and Bounce Effects

### CSS Shake Animations

```css
/* Horizontal shake */
@keyframes horizontalShake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}

/* Vertical shake */
@keyframes verticalShake {
    0%, 100% { transform: translateY(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateY(-10px); }
    20%, 40%, 60%, 80% { transform: translateY(10px); }
}

/* Rotation shake */
@keyframes rotationShake {
    0%, 100% { transform: rotate(0deg); }
    10%, 30%, 50%, 70%, 90% { transform: rotate(-3deg); }
    20%, 40%, 60%, 80% { transform: rotate(3deg); }
}

/* Combined shake and bounce */
@keyframes shakeAndBounce {
    0% {
        transform: translateX(0) translateY(0) rotate(0deg);
    }
    10% {
        transform: translateX(-5px) translateY(-15px) rotate(-2deg);
    }
    20% {
        transform: translateX(5px) translateY(-25px) rotate(2deg);
    }
    30% {
        transform: translateX(-3px) translateY(-20px) rotate(-1deg);
    }
    40% {
        transform: translateX(3px) translateY(-10px) rotate(1deg);
    }
    50% {
        transform: translateX(-2px) translateY(-5px) rotate(0deg);
    }
    60% {
        transform: translateX(2px) translateY(-8px) rotate(0.5deg);
    }
    70% {
        transform: translateX(-1px) translateY(-3px) rotate(-0.5deg);
    }
    80% {
        transform: translateX(1px) translateY(-1px) rotate(0deg);
    }
    90% {
        transform: translateX(0) translateY(-0.5px) rotate(0deg);
    }
    100% {
        transform: translateX(0) translateY(0) rotate(0deg);
    }
}

/* Dice-specific shake effects */
.dice.shaking-horizontal { animation: horizontalShake 0.5s ease-in-out; }
.dice.shaking-vertical { animation: verticalShake 0.5s ease-in-out; }
.dice.shaking-rotation { animation: rotationShake 0.3s ease-in-out; }
.dice.shaking-bounce { animation: shakeAndBounce 1s ease-out; }

/* Pre-roll shake animation */
@keyframes preRollShake {
    0%, 100% {
        transform: translateX(0) translateY(0) rotateZ(0deg);
    }
    10% {
        transform: translateX(-2px) translateY(-1px) rotateZ(-1deg);
    }
    20% {
        transform: translateX(2px) translateY(1px) rotateZ(1deg);
    }
    30% {
        transform: translateX(-3px) translateY(-2px) rotateZ(-2deg);
    }
    40% {
        transform: translateX(3px) translateY(2px) rotateZ(2deg);
    }
    50% {
        transform: translateX(-2px) translateY(-1px) rotateZ(-1deg);
    }
    60% {
        transform: translateX(2px) translateY(1px) rotateZ(1deg);
    }
    70% {
        transform: translateX(-1px) translateY(-0.5px) rotateZ(-0.5deg);
    }
    80% {
        transform: translateX(1px) translateY(0.5px) rotateZ(0.5deg);
    }
    90% {
        transform: translateX(-0.5px) translateY(-0.25px) rotateZ(-0.25deg);
    }
}

.dice.pre-roll-shake {
    animation: preRollShake 0.8s ease-in-out;
}
```

### JavaScript Shake Control

```javascript
// Shake before rolling
function shakeAndRoll() {
    if (isRolling) return;
    
    // Add shake effect
    dice.classList.add('pre-roll-shake');
    
    // After shake, start rolling
    setTimeout(() => {
        dice.classList.remove('pre-roll-shake');
        rollDice();
    }, 800);
}

// Random shake intensity
function addRandomShake() {
    const shakeTypes = ['shaking-horizontal', 'shaking-vertical', 'shaking-rotation', 'shaking-bounce'];
    const randomShake = shakeTypes[Math.floor(Math.random() * shakeTypes.length)];
    
    dice.classList.add(randomShake);
    
    setTimeout(() => {
        dice.classList.remove(randomShake);
    }, 1000);
}

// Customizable shake function
function customShake(intensity = 1, duration = 500, type = 'all') {
    const keyframes = [];
    const steps = 10;
    
    for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const amplitude = intensity * (1 - progress); // Decrease amplitude over time
        
        let transform = '';
        
        if (type === 'horizontal' || type === 'all') {
            const x = (Math.random() - 0.5) * amplitude * 20;
            transform += `translateX(${x}px) `;
        }
        
        if (type === 'vertical' || type === 'all') {
            const y = (Math.random() - 0.5) * amplitude * 20;
            transform += `translateY(${y}px) `;
        }
        
        if (type === 'rotation' || type === 'all') {
            const rotation = (Math.random() - 0.5) * amplitude * 10;
            transform += `rotate(${rotation}deg)`;
        }
        
        keyframes.push({
            offset: progress,
            transform: transform
        });
    }
    
    dice.animate(keyframes, {
        duration: duration,
        easing: 'ease-out'
    });
}
```

---

## Physics-Based Animations

### Three.js and Cannon.js Implementation

```javascript
// Three.js + Cannon.js Physics Dice
class PhysicsDice {
    constructor() {
        this.scene = null;
        this.world = null;
        this.renderer = null;
        this.camera = null;
        this.dice = [];
        this.init();
    }
    
    init() {
        // Initialize Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x202030);
        
        // Initialize camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        
        // Initialize renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
        
        // Initialize Cannon.js physics world
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        
        // Create ground
        this.createGround();
        
        // Create lights
        this.createLights();
        
        // Start render loop
        this.animate();
    }
    
    createGround() {
        // Three.js ground
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x404040 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Cannon.js ground
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.add(groundBody);
    }
    
    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }
    
    createDice(position = { x: 0, y: 5, z: 0 }) {
        // Three.js dice mesh
        const diceGeometry = new THREE.BoxGeometry(1, 1, 1);
        const diceMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const diceMesh = new THREE.Mesh(diceGeometry, diceMaterial);
        diceMesh.position.set(position.x, position.y, position.z);
        diceMesh.castShadow = true;
        this.scene.add(diceMesh);
        
        // Cannon.js dice body
        const diceShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        const diceBody = new CANNON.Body({ mass: 1 });
        diceBody.addShape(diceShape);
        diceBody.position.set(position.x, position.y, position.z);
        
        // Add some random initial rotation and velocity
        diceBody.angularVelocity.set(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        );
        diceBody.velocity.set(
            Math.random() * 5 - 2.5,
            Math.random() * 2,
            Math.random() * 5 - 2.5
        );
        
        this.world.add(diceBody);
        
        // Store reference
        const dice = { mesh: diceMesh, body: diceBody };
        this.dice.push(dice);
        
        return dice;
    }
    
    rollDice() {
        // Clear existing dice
        this.dice.forEach(dice => {
            this.scene.remove(dice.mesh);
            this.world.remove(dice.body);
        });
        this.dice = [];
        
        // Create new dice
        const dice = this.createDice();
        
        // Wait for dice to settle and get result
        setTimeout(() => {
            const result = this.getDiceValue(dice);
            console.log('Dice result:', result);
        }, 3000);
    }
    
    getDiceValue(dice) {
        // Get the up-facing normal vector
        const upVector = new THREE.Vector3(0, 1, 0);
        const diceRotation = dice.mesh.quaternion;
        
        // Define face normals for a cube
        const faceNormals = [
            new THREE.Vector3(0, 0, 1),   // Face 1
            new THREE.Vector3(0, 0, -1),  // Face 6
            new THREE.Vector3(1, 0, 0),   // Face 3
            new THREE.Vector3(-1, 0, 0),  // Face 4
            new THREE.Vector3(0, 1, 0),   // Face 5
            new THREE.Vector3(0, -1, 0)   // Face 2
        ];
        
        // Find which face is most aligned with up vector
        let maxDot = -1;
        let topFace = 1;
        
        faceNormals.forEach((normal, index) => {
            const rotatedNormal = normal.clone().applyQuaternion(diceRotation);
            const dot = rotatedNormal.dot(upVector);
            
            if (dot > maxDot) {
                maxDot = dot;
                topFace = index + 1;
            }
        });
        
        return topFace;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Step physics simulation
        this.world.step(1/60);
        
        // Update dice positions
        this.dice.forEach(dice => {
            dice.mesh.position.copy(dice.body.position);
            dice.mesh.quaternion.copy(dice.body.quaternion);
        });
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize physics dice
const physicsDice = new PhysicsDice();

// Roll function
function rollPhysicsDice() {
    physicsDice.rollDice();
}
```

### Simplified Physics Simulation

```javascript
// Simplified physics simulation without external libraries
class SimpleDicePhysics {
    constructor(element) {
        this.element = element;
        this.position = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.angularVelocity = { x: 0, y: 0, z: 0 };
        this.gravity = -0.5;
        this.friction = 0.95;
        this.isAnimating = false;
    }
    
    roll() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Set initial velocities
        this.velocity = {
            x: (Math.random() - 0.5) * 10,
            y: Math.random() * 5 + 10,
            z: (Math.random() - 0.5) * 10
        };
        
        this.angularVelocity = {
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 20,
            z: (Math.random() - 0.5) * 20
        };
        
        this.animate();
    }
    
    animate() {
        // Update physics
        this.velocity.y += this.gravity;
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;
        
        this.rotation.x += this.angularVelocity.x;
        this.rotation.y += this.angularVelocity.y;
        this.rotation.z += this.angularVelocity.z;
        
        // Bounce off ground
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y *= -0.6; // Bounce damping
            this.velocity.x *= this.friction;
            this.velocity.z *= this.friction;
            this.angularVelocity.x *= this.friction;
            this.angularVelocity.y *= this.friction;
            this.angularVelocity.z *= this.friction;
        }
        
        // Apply transform
        this.element.style.transform = `
            translate3d(${this.position.x}px, ${-this.position.y}px, ${this.position.z}px)
            rotateX(${this.rotation.x}deg)
            rotateY(${this.rotation.y}deg)
            rotateZ(${this.rotation.z}deg)
        `;
        
        // Check if still moving
        const isMoving = Math.abs(this.velocity.x) > 0.1 || 
                        Math.abs(this.velocity.y) > 0.1 || 
                        Math.abs(this.velocity.z) > 0.1 ||
                        Math.abs(this.angularVelocity.x) > 1 ||
                        Math.abs(this.angularVelocity.y) > 1 ||
                        Math.abs(this.angularVelocity.z) > 1;
        
        if (isMoving) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.stop();
        }
    }
    
    stop() {
        this.isAnimating = false;
        
        // Snap to final position
        const finalValue = Math.floor(Math.random() * 6) + 1;
        this.element.setAttribute('data-face', finalValue);
        this.element.style.transform = '';
        
        console.log('Dice settled on:', finalValue);
    }
}

// Usage
const simplePhysics = new SimpleDicePhysics(document.getElementById('dice'));

function rollWithSimplePhysics() {
    simplePhysics.roll();
}
```

---

## Popular Libraries and Frameworks

### Using GSAP (GreenSock)

```javascript
// GSAP dice rolling animation
function rollDiceWithGSAP() {
    if (isRolling) return;
    
    isRolling = true;
    const finalValue = Math.floor(Math.random() * 6) + 1;
    
    // Create timeline
    const tl = gsap.timeline({
        onComplete: () => {
            dice.setAttribute('data-face', finalValue);
            isRolling = false;
        }
    });
    
    // Pre-roll shake
    tl.to(dice, {
        duration: 0.5,
        x: "random(-10, 10)",
        y: "random(-5, 5)",
        rotation: "random(-5, 5)",
        ease: "power2.inOut",
        repeat: 3,
        yoyo: true
    })
    // Main roll animation
    .to(dice, {
        duration: 2,
        rotationX: 720 + (finalValue * 60),
        rotationY: 900 + (finalValue * 45),
        rotationZ: 450 + (finalValue * 30),
        y: -50,
        ease: "power2.out"
    }, "-=0.2")
    // Bounce back down
    .to(dice, {
        duration: 0.8,
        y: 0,
        ease: "bounce.out"
    }, "-=0.8")
    // Final settling
    .to(dice, {
        duration: 0.3,
        rotationX: getFinalRotation(finalValue).x,
        rotationY: getFinalRotation(finalValue).y,
        rotationZ: 0,
        ease: "power2.inOut"
    });
}

// Helper function to get final rotation for each face
function getFinalRotation(face) {
    const rotations = {
        1: { x: 0, y: 0 },
        2: { x: 0, y: 180 },
        3: { x: 0, y: -90 },
        4: { x: 0, y: 90 },
        5: { x: -90, y: 0 },
        6: { x: 90, y: 0 }
    };
    return rotations[face];
}

// GSAP with custom easing
gsap.registerEase("dice", "0.68, -0.55, 0.265, 1.55");

function rollDiceWithCustomEasing() {
    gsap.to(dice, {
        duration: 2.5,
        rotationX: 1080,
        rotationY: 720,
        rotationZ: 360,
        y: -30,
        ease: "dice",
        onComplete: () => {
            const finalValue = Math.floor(Math.random() * 6) + 1;
            dice.setAttribute('data-face', finalValue);
        }
    });
}
```

### Using Lottie Animations

```javascript
// Lottie dice animation integration
class LottieDice {
    constructor(container) {
        this.container = container;
        this.animation = null;
        this.loadAnimation();
    }
    
    loadAnimation() {
        this.animation = lottie.loadAnimation({
            container: this.container,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: 'dice-animation.json' // Your Lottie JSON file
        });
        
        this.animation.addEventListener('complete', () => {
            this.onAnimationComplete();
        });
    }
    
    roll() {
        if (this.animation) {
            const finalValue = Math.floor(Math.random() * 6) + 1;
            
            // Trigger animation
            this.animation.goToAndPlay(0);
            
            // Store result for later
            this.pendingResult = finalValue;
        }
    }
    
    onAnimationComplete() {
        // Show final result
        this.showResult(this.pendingResult);
    }
    
    showResult(value) {
        // Update display with final dice value
        console.log('Dice rolled:', value);
        // Update your UI here
    }
}
```

### Using roll-a-die NPM Package

```javascript
// Install: npm install roll-a-die

import rollADie from 'roll-a-die';

// Basic usage
function rollWithLibrary() {
    rollADie({
        element: document.getElementById('dice-container'),
        numberOfDice: 2,
        callback: (results) => {
            console.log('Dice results:', results);
        }
    });
}

// Advanced usage with options
function rollWithOptions() {
    rollADie({
        element: document.getElementById('dice-container'),
        numberOfDice: 1,
        callback: (results) => {
            console.log('Result:', results[0]);
        },
        noSound: false,
        delay: 1000,
        values: [3] // Force specific result
    });
}
```

---

## Performance Optimization

### CSS Optimization

```css
/* Performance-optimized dice */
.dice-optimized {
    /* Use transform3d to trigger hardware acceleration */
    transform: translate3d(0, 0, 0);
    
    /* Optimize for animations */
    will-change: transform;
    
    /* Use backface-visibility for better performance */
    backface-visibility: hidden;
    
    /* Reduce repaints */
    transform-style: preserve-3d;
}

.dice-face-optimized {
    /* Use transform3d instead of transform */
    transform: translate3d(0, 0, 50px);
    
    /* Optimize rendering */
    backface-visibility: hidden;
    
    /* Reduce layout thrashing */
    position: absolute;
    top: 0;
    left: 0;
}

/* Use contain property for better performance */
.dice-container-optimized {
    contain: layout style paint;
    perspective: 1000px;
}

/* Efficient animation keyframes */
@keyframes optimizedRoll {
    0% {
        transform: translate3d(0, 0, 0) rotate3d(0, 0, 0, 0deg);
    }
    100% {
        transform: translate3d(0, 0, 0) rotate3d(1, 1, 1, 720deg);
    }
}

/* Use transform instead of changing individual properties */
.dice.rolling-optimized {
    animation: optimizedRoll 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### JavaScript Performance Optimization

```javascript
// Debounced rolling function
function createDebouncedRoll(delay = 300) {
    let timeoutId;
    
    return function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            rollDice();
        }, delay);
    };
}

const debouncedRoll = createDebouncedRoll();

// Object pooling for multiple dice
class DicePool {
    constructor(size = 10) {
        this.pool = [];
        this.activeObjects = [];
        
        // Pre-create dice objects
        for (let i = 0; i < size; i++) {
            this.pool.push(this.createDiceObject());
        }
    }
    
    createDiceObject() {
        const diceElement = document.createElement('div');
        diceElement.className = 'dice';
        // Add faces...
        return {
            element: diceElement,
            isActive: false,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 }
        };
    }
    
    getDice() {
        let dice = this.pool.pop();
        if (!dice) {
            dice = this.createDiceObject();
        }
        dice.isActive = true;
        this.activeObjects.push(dice);
        return dice;
    }
    
    returnDice(dice) {
        dice.isActive = false;
        const index = this.activeObjects.indexOf(dice);
        if (index > -1) {
            this.activeObjects.splice(index, 1);
            this.pool.push(dice);
        }
    }
}

// RequestAnimationFrame optimization
class AnimationManager {
    constructor() {
        this.animations = [];
        this.isRunning = false;
    }
    
    addAnimation(animationFunction) {
        this.animations.push(animationFunction);
        if (!this.isRunning) {
            this.start();
        }
    }
    
    removeAnimation(animationFunction) {
        const index = this.animations.indexOf(animationFunction);
        if (index > -1) {
            this.animations.splice(index, 1);
        }
        
        if (this.animations.length === 0) {
            this.stop();
        }
    }
    
    start() {
        this.isRunning = true;
        this.tick();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    tick() {
        if (!this.isRunning) return;
        
        this.animations.forEach(animation => animation());
        requestAnimationFrame(() => this.tick());
    }
}

// Memory-efficient dice rolling
function optimizedDiceRoll(element) {
    // Use CSS custom properties instead of inline styles
    const root = document.documentElement;
    const finalValue = Math.floor(Math.random() * 6) + 1;
    
    // Set CSS custom properties
    root.style.setProperty('--dice-final-x', `${finalValue * 60}deg`);
    root.style.setProperty('--dice-final-y', `${finalValue * 45}deg`);
    root.style.setProperty('--dice-final-z', `${finalValue * 30}deg`);
    
    // Trigger animation via class
    element.classList.add('rolling-optimized');
    
    // Clean up after animation
    setTimeout(() => {
        element.classList.remove('rolling-optimized');
        element.setAttribute('data-face', finalValue);
        
        // Clean up custom properties
        root.style.removeProperty('--dice-final-x');
        root.style.removeProperty('--dice-final-y');
        root.style.removeProperty('--dice-final-z');
    }, 2000);
}
```

---

## Sound Effects Integration

### Web Audio API Implementation

```javascript
class DiceSoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.masterVolume = 1.0;
        this.init();
    }
    
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await this.loadSounds();
        } catch (error) {
            console.warn('Audio not supported:', error);
        }
    }
    
    async loadSounds() {
        const soundFiles = {
            shake: 'sounds/dice-shake.mp3',
            roll: 'sounds/dice-roll.mp3',
            bounce: 'sounds/dice-bounce.mp3',
            settle: 'sounds/dice-settle.mp3'
        };
        
        for (const [name, url] of Object.entries(soundFiles)) {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.sounds[name] = audioBuffer;
            } catch (error) {
                console.warn(`Failed to load sound ${name}:`, error);
            }
        }
    }
    
    playSound(name, volume = 1.0, playbackRate = 1.0) {
        if (!this.audioContext || !this.sounds[name]) return;
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = this.sounds[name];
        source.playbackRate.value = playbackRate;
        gainNode.gain.value = volume * this.masterVolume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start();
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
}

// Initialize sound manager
const soundManager = new DiceSoundManager();

// Enhanced dice rolling with sound
async function rollDiceWithSound() {
    if (isRolling) return;
    
    isRolling = true;
    
    // Play shake sound
    soundManager.playSound('shake');
    
    // Add visual shake
    dice.classList.add('pre-roll-shake');
    
    setTimeout(() => {
        dice.classList.remove('pre-roll-shake');
        
        // Play roll sound
        soundManager.playSound('roll');
        
        // Start rolling animation
        dice.classList.add('rolling');
        
        // Play bounce sound during animation
        setTimeout(() => {
            soundManager.playSound('bounce', 0.7);
        }, 1000);
        
        // Final result
        setTimeout(() => {
            dice.classList.remove('rolling');
            const result = Math.floor(Math.random() * 6) + 1;
            dice.setAttribute('data-face', result);
            
            // Play settle sound
            soundManager.playSound('settle', 0.5);
            
            isRolling = false;
        }, 2000);
    }, 800);
}
```

### Simple HTML5 Audio Implementation

```javascript
class SimpleDiceAudio {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }
    
    loadSounds() {
        const soundFiles = {
            shake: 'sounds/dice-shake.mp3',
            roll: 'sounds/dice-roll.mp3',
            bounce: 'sounds/dice-bounce.mp3',
            settle: 'sounds/dice-settle.mp3'
        };
        
        for (const [name, src] of Object.entries(soundFiles)) {
            const audio = new Audio(src);
            audio.preload = 'auto';
            audio.volume = 0.5;
            this.sounds[name] = audio;
        }
    }
    
    play(soundName, volume = 0.5) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.volume = volume;
            sound.currentTime = 0; // Reset to beginning
            sound.play().catch(error => {
                console.warn('Audio play failed:', error);
            });
        }
    }
    
    setVolume(soundName, volume) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.volume = Math.max(0, Math.min(1, volume));
        }
    }
}

// Simple audio implementation
const simpleAudio = new SimpleDiceAudio();

function rollDiceWithSimpleAudio() {
    simpleAudio.play('shake', 0.3);
    
    setTimeout(() => {
        simpleAudio.play('roll', 0.5);
        rollDice(); // Your existing roll function
    }, 500);
    
    setTimeout(() => {
        simpleAudio.play('settle', 0.4);
    }, 2500);
}
```

---

## Complete Working Examples

### Example 1: Simple CSS/JS Dice

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Dice Roller</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #2c3e50;
            color: white;
            font-family: Arial, sans-serif;
        }
        
        .dice-container {
            perspective: 1000px;
            margin: 50px;
        }
        
        .dice {
            width: 100px;
            height: 100px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.5s;
        }
        
        .dice-face {
            position: absolute;
            width: 100px;
            height: 100px;
            background: white;
            border: 2px solid #333;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40px;
            font-weight: bold;
            color: #333;
        }
        
        .dice-face:nth-child(1) { transform: rotateY(0deg) translateZ(50px); }
        .dice-face:nth-child(2) { transform: rotateY(180deg) translateZ(50px); }
        .dice-face:nth-child(3) { transform: rotateY(-90deg) translateZ(50px); }
        .dice-face:nth-child(4) { transform: rotateY(90deg) translateZ(50px); }
        .dice-face:nth-child(5) { transform: rotateX(90deg) translateZ(50px); }
        .dice-face:nth-child(6) { transform: rotateX(-90deg) translateZ(50px); }
        
        .dice.rolling {
            animation: spin 2s ease-out;
        }
        
        @keyframes spin {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(720deg) rotateY(720deg); }
        }
        
        .dice[data-face="1"] { transform: rotateX(0deg) rotateY(0deg); }
        .dice[data-face="2"] { transform: rotateX(0deg) rotateY(180deg); }
        .dice[data-face="3"] { transform: rotateX(0deg) rotateY(90deg); }
        .dice[data-face="4"] { transform: rotateX(0deg) rotateY(-90deg); }
        .dice[data-face="5"] { transform: rotateX(-90deg) rotateY(0deg); }
        .dice[data-face="6"] { transform: rotateX(90deg) rotateY(0deg); }
        
        button {
            padding: 15px 30px;
            font-size: 18px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 20px;
        }
        
        button:hover {
            background: #c0392b;
        }
        
        button:disabled {
            background: #95a5a6;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <h1>Simple Dice Roller</h1>
    
    <div class="dice-container">
        <div class="dice" id="dice" data-face="1">
            <div class="dice-face">1</div>
            <div class="dice-face">6</div>
            <div class="dice-face">4</div>
            <div class="dice-face">3</div>
            <div class="dice-face">5</div>
            <div class="dice-face">2</div>
        </div>
    </div>
    
    <button onclick="rollDice()" id="rollButton">Roll Dice</button>
    <p id="result">Click to roll!</p>
    
    <script>
        let isRolling = false;
        const dice = document.getElementById('dice');
        const button = document.getElementById('rollButton');
        const result = document.getElementById('result');
        
        function rollDice() {
            if (isRolling) return;
            
            isRolling = true;
            button.disabled = true;
            result.textContent = 'Rolling...';
            
            dice.classList.add('rolling');
            
            const finalValue = Math.floor(Math.random() * 6) + 1;
            
            setTimeout(() => {
                dice.classList.remove('rolling');
                dice.setAttribute('data-face', finalValue);
                result.textContent = `You rolled a ${finalValue}!`;
                
                setTimeout(() => {
                    isRolling = false;
                    button.disabled = false;
                }, 500);
            }, 2000);
        }
        
        // Initialize with random face
        window.addEventListener('load', () => {
            const initialFace = Math.floor(Math.random() * 6) + 1;
            dice.setAttribute('data-face', initialFace);
        });
    </script>
</body>
</html>
```

### Example 2: Advanced Multi-Dice with Physics

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Dice Roller</title>
    <style>
        body {
            margin: 0;
            background: #1a1a2e;
            color: white;
            font-family: 'Arial', sans-serif;
            overflow-x: hidden;
        }
        
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        
        .dice-area {
            display: flex;
            gap: 30px;
            margin: 50px 0;
            min-height: 200px;
            align-items: center;
        }
        
        .dice {
            width: 80px;
            height: 80px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.3s;
        }
        
        .dice-face {
            position: absolute;
            width: 80px;
            height: 80px;
            background: linear-gradient(145deg, #ffffff, #e6e6e6);
            border: 1px solid #ccc;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
        }
        
        .dice-face:nth-child(1) { transform: rotateY(0deg) translateZ(40px); }
        .dice-face:nth-child(2) { transform: rotateY(180deg) translateZ(40px); }
        .dice-face:nth-child(3) { transform: rotateY(-90deg) translateZ(40px); }
        .dice-face:nth-child(4) { transform: rotateY(90deg) translateZ(40px); }
        .dice-face:nth-child(5) { transform: rotateX(90deg) translateZ(40px); }
        .dice-face:nth-child(6) { transform: rotateX(-90deg) translateZ(40px); }
        
        .dot {
            width: 12px;
            height: 12px;
            background: #333;
            border-radius: 50%;
            margin: 2px;
        }
        
        .controls {
            display: flex;
            gap: 20px;
            margin: 20px 0;
        }
        
        button {
            padding: 12px 24px;
            background: #16213e;
            color: white;
            border: 2px solid #0f3460;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
        }
        
        button:hover {
            background: #0f3460;
            transform: translateY(-2px);
        }
        
        .results {
            margin: 20px 0;
            font-size: 18px;
        }
        
        .dice.rolling {
            animation: complexRoll 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes complexRoll {
            0% {
                transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0px);
            }
            25% {
                transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg) translateY(-40px);
            }
            50% {
                transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg) translateY(-60px);
            }
            75% {
                transform: rotateX(1080deg) rotateY(540deg) rotateZ(270deg) translateY(-20px);
            }
            100% {
                transform: rotateX(1440deg) rotateY(720deg) rotateZ(360deg) translateY(0px);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Advanced Dice Roller</h1>
        
        <div class="dice-area" id="diceArea">
            <!-- Dice will be dynamically generated -->
        </div>
        
        <div class="controls">
            <button onclick="addDice()">Add Dice</button>
            <button onclick="removeDice()">Remove Dice</button>
            <button onclick="rollAllDice()" id="rollButton">Roll All Dice</button>
            <button onclick="clearResults()">Clear Results</button>
        </div>
        
        <div class="results" id="results">
            <p>Click "Roll All Dice" to start!</p>
        </div>
    </div>
    
    <script>
        class AdvancedDiceRoller {
            constructor() {
                this.dice = [];
                this.isRolling = false;
                this.rollHistory = [];
                this.init();
            }
            
            init() {
                // Start with 2 dice
                this.addDice();
                this.addDice();
            }
            
            createDiceElement() {
                const dice = document.createElement('div');
                dice.className = 'dice';
                dice.innerHTML = `
                    <div class="dice-face">${this.createDots(1)}</div>
                    <div class="dice-face">${this.createDots(6)}</div>
                    <div class="dice-face">${this.createDots(4)}</div>
                    <div class="dice-face">${this.createDots(3)}</div>
                    <div class="dice-face">${this.createDots(5)}</div>
                    <div class="dice-face">${this.createDots(2)}</div>
                `;
                return dice;
            }
            
            createDots(number) {
                const patterns = {
                    1: '<div class="dot"></div>',
                    2: '<div class="dot"></div><div class="dot"></div>',
                    3: '<div class="dot"></div><div class="dot"></div><div class="dot"></div>',
                    4: '<div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div>',
                    5: '<div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div>',
                    6: '<div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div>'
                };
                return patterns[number] || '';
            }
            
            addDice() {
                if (this.dice.length >= 6) return; // Maximum 6 dice
                
                const diceElement = this.createDiceElement();
                const diceArea = document.getElementById('diceArea');
                diceArea.appendChild(diceElement);
                
                this.dice.push({
                    element: diceElement,
                    value: 1
                });
                
                // Set random initial face
                const initialValue = Math.floor(Math.random() * 6) + 1;
                this.setDiceFace(diceElement, initialValue);
            }
            
            removeDice() {
                if (this.dice.length <= 1) return; // Keep at least 1 dice
                
                const lastDice = this.dice.pop();
                lastDice.element.remove();
            }
            
            setDiceFace(diceElement, value) {
                const rotations = {
                    1: 'rotateX(0deg) rotateY(0deg)',
                    2: 'rotateX(-90deg) rotateY(0deg)',
                    3: 'rotateX(0deg) rotateY(90deg)',
                    4: 'rotateX(0deg) rotateY(-90deg)',
                    5: 'rotateX(90deg) rotateY(0deg)',
                    6: 'rotateX(180deg) rotateY(0deg)'
                };
                
                diceElement.style.transform = rotations[value];
                diceElement.setAttribute('data-face', value);
            }
            
            async rollAllDice() {
                if (this.isRolling) return;
                
                this.isRolling = true;
                document.getElementById('rollButton').disabled = true;
                
                // Start all dice rolling
                this.dice.forEach(dice => {
                    dice.element.classList.add('rolling');
                });
                
                // Generate results
                const results = this.dice.map(() => Math.floor(Math.random() * 6) + 1);
                
                // Wait for animation to complete
                await this.wait(2500);
                
                // Set final faces
                this.dice.forEach((dice, index) => {
                    dice.element.classList.remove('rolling');
                    dice.value = results[index];
                    this.setDiceFace(dice.element, results[index]);
                });
                
                // Update results display
                this.updateResults(results);
                
                // Store in history
                this.rollHistory.push({
                    timestamp: new Date(),
                    results: [...results],
                    total: results.reduce((sum, val) => sum + val, 0)
                });
                
                this.isRolling = false;
                document.getElementById('rollButton').disabled = false;
            }
            
            updateResults(results) {
                const total = results.reduce((sum, val) => sum + val, 0);
                const resultsElement = document.getElementById('results');
                
                resultsElement.innerHTML = `
                    <p><strong>Results:</strong> ${results.join(', ')}</p>
                    <p><strong>Total:</strong> ${total}</p>
                    <p><strong>Average:</strong> ${(total / results.length).toFixed(2)}</p>
                `;
            }
            
            clearResults() {
                this.rollHistory = [];
                document.getElementById('results').innerHTML = '<p>Results cleared. Roll dice to start again!</p>';
            }
            
            wait(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }
        
        // Initialize the dice roller
        const diceRoller = new AdvancedDiceRoller();
        
        // Global functions for buttons
        function addDice() {
            diceRoller.addDice();
        }
        
        function removeDice() {
            diceRoller.removeDice();
        }
        
        function rollAllDice() {
            diceRoller.rollAllDice();
        }
        
        function clearResults() {
            diceRoller.clearResults();
        }
    </script>
</body>
</html>
```

---

## Best Practices

### Performance Best Practices

1. **Use `transform3d()` instead of 2D transforms** to trigger hardware acceleration
2. **Add `will-change: transform`** to elements that will be animated
3. **Use `backface-visibility: hidden`** to prevent rendering back faces
4. **Prefer CSS animations over JavaScript** for simple animations
5. **Use `requestAnimationFrame`** for JavaScript animations
6. **Implement object pooling** for multiple dice games
7. **Debounce rapid user interactions** to prevent performance issues

### Animation Best Practices

1. **Start with anticipation** (shake before roll)
2. **Add secondary animation** (bounce, settle)
3. **Use appropriate easing functions** for realistic motion
4. **Vary timing** for different dice to feel more natural
5. **Include overshoot and settle** for satisfying feedback
6. **Layer animations** (roll + bounce + settle)

### User Experience Best Practices

1. **Provide immediate feedback** when user clicks
2. **Disable controls during animation** to prevent conflicts
3. **Show loading states** for longer animations
4. **Add sound effects** for enhanced feedback
5. **Allow skipping animations** for accessibility
6. **Provide haptic feedback** on mobile devices
7. **Make animations configurable** (speed, effects)

### Accessibility Considerations

```css
/* Respect user preferences for reduced motion */
@media (prefers-reduced-motion: reduce) {
    .dice.rolling {
        animation: none;
        transform: none;
    }
    
    .dice[data-face] {
        /* Instant transition to final state */
        transition: none;
    }
}

/* Ensure sufficient contrast */
.dice-face {
    background: white;
    color: #333;
    border: 2px solid #333;
}

/* Focus indicators for keyboard navigation */
button:focus {
    outline: 2px solid #007acc;
    outline-offset: 2px;
}
```

### Code Organization

```javascript
// Modular dice system
class DiceSystem {
    constructor(options = {}) {
        this.options = {
            container: document.body,
            diceSize: 100,
            animationDuration: 2000,
            soundEnabled: true,
            maxDice: 6,
            ...options
        };
        
        this.dice = [];
        this.isRolling = false;
        this.soundManager = null;
        
        this.init();
    }
    
    init() {
        this.setupContainer();
        this.setupSounds();
        this.setupEventListeners();
    }
    
    // ... implementation
}

// Usage
const diceSystem = new DiceSystem({
    container: document.getElementById('game-area'),
    diceSize: 80,
    animationDuration: 2500,
    soundEnabled: true
});
```

This comprehensive guide provides everything you need to implement realistic, performant, and accessible dice rolling animations in your web applications. Choose the techniques that best fit your project's requirements and performance constraints.