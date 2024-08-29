# Tasker.js

A lightweight and easy-to-use JavaScript task scheduler for Node.js. Useful for basic scheduling needs, but please proceed with caution for more complex or performance-critical scenarios.


**Important Note:** 
This task manager is primarily built using `setTimeout`. While suitable for many use cases, `setTimeout` has limitations, especially for CPU-intensive tasks, precise timing requirements, or recurring tasks where drift could be an issue. For such scenarios, consider more specialized scheduling libraries or alternative approaches. see [node-cron](https://www.npmjs.com/package/node-cron)


## Features

- Simple API: Create, cancel, reschedule, and list tasks with minimal code.
- Lightweight: Minimal dependencies, perfect for small or large projects. 

## How to Use

### Installation
```bash
npm install git+https://github.com/j3rr7/tasker.js.git
```

### Basic Usage
```js
// CommonJS
const { TaskManager } = require('tasker');

const taskManager = new TaskManager();

const taskId = taskManager.createTask(new Date(), () => {
  console.log('Task executed!');
});
```
```js
// ESM
import { TaskManager } from 'tasker';

const taskManager = new TaskManager();

taskManager.createTask(new Date(Date.now() + 1000), () => {
  console.log('Task executed!');
});
```

## Limitations

If your task manager primarily handles short-running tasks (like simple function calls), setTimeout is likely still a reasonable choice.

If you envision handling long-running, recurring, or CPU-intensive tasks, consider incorporating some of the alternatives to ensure your task manager remains efficient and responsive.