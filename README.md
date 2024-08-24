# Tasker.js

A lightweight and easy-to-use JavaScript task scheduler for Node.js. Useful for basic scheduling needs, but please proceed with caution for more complex or performance-critical scenarios.


**Important Note:** 
This task manager is primarily built using `setTimeout`. While suitable for many use cases, `setTimeout` has limitations, especially for CPU-intensive tasks, precise timing requirements, or recurring tasks where drift could be an issue. For such scenarios, consider more specialized scheduling libraries or alternative approaches. see [node-cron](https://www.npmjs.com/package/node-cron)


## Features

- Simple API: Create, cancel, reschedule, and list tasks with minimal code.
- Lightweight: Minimal dependencies, perfect for small or large projects. 

## Limitations

If your task manager primarily handles short-running tasks (like simple function calls), setTimeout is likely still a reasonable choice.

If you envision handling long-running, recurring, or CPU-intensive tasks, consider incorporating some of the alternatives to ensure your task manager remains efficient and responsive.