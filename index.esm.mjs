/**
 * @module TaskManager
 */

/**
 * A task that is scheduled to be executed at a specific time.
 *
 * @property {string} id - The ID of the task.
 * @property {Date} targetTime - The time at which the task should be executed.
 * @property {function} callback - The callback function to be executed when the task is executed.
 * @property {number} timeoutId - The ID of the timeout that is used to execute the task.
 */

class Task {
  constructor(id, targetTime, callback) {
    this.id = id;
    this.targetTime = targetTime;
    this.callback = callback;
    this.timeoutId = null;
  }
}

/**
 * Represents a task scheduled for execution at a specific time.
 * @typedef {Object} Task
 * @property {number} id - The unique identifier of the task.
 * @property {Date} targetTime - The time at which the task should be executed.
 * @property {Function} callback - The function to be executed when the task runs.
 * @property {number} timeoutId - The ID of the setTimeout used to schedule the task.
 */

/**
 * Manages the creation, scheduling, and execution of tasks.
 */
class TaskManager {
  /**
   * Creates a new TaskManager instance.
   */
  constructor() {
    /** @private @type {Map<number, Task>} */
    this.tasks = new Map();

    /** @private @type {number} */
    this.nextTaskId = 1;
  }

  /**
   * Creates and schedules a new task.
   * @param {Date} targetTime - The time at which the task should be executed.
   * @param {Function} callback - The function to be executed when the task runs.
   * @returns {number} The unique identifier of the created task.
   */
  createTask(targetTime, callback) {
    const taskId = this.nextTaskId++;
    const task = { id: taskId, targetTime, callback };
    this.tasks.set(taskId, task);
    this._scheduleTask(task);
    return taskId;
  }

  /**
   * Schedules a task for execution.
   * @private
   * @param {Task} task - The task to schedule.
   */
  _scheduleTask(task) {
    const timeUntilTarget = task.targetTime.getTime() - Date.now();
    task.timeoutId =
      timeUntilTarget > 0
        ? setTimeout(() => this._executeTask(task.id), timeUntilTarget)
        : setTimeout(() => this._executeTask(task.id), 0);
  }

  /**
   * Executes a task and removes it from the task list.
   * @private
   * @param {number} taskId - The ID of the task to execute.
   */
  _executeTask(taskId) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.callback();
      this.tasks.delete(taskId);
    }
  }

  /**
   * Cancels a scheduled task and removes it from the task list.
   * @param {number} taskId - The ID of the task to cancel.
   * @returns {boolean} True if the task was found and cancelled, false otherwise.
   */
  cancelTask(taskId) {
    const task = this.tasks.get(taskId);
    if (task) {
      clearTimeout(task.timeoutId);
      this.tasks.delete(taskId);
      return true;
    }
    return false;
  }

  /**
   * Retrieves all active tasks.
   * @returns {Array<{id: number, targetTime: Date}>} An array of objects representing active tasks.
   */
  getTasks() {
    return Array.from(this.tasks.values(), ({ id, targetTime }) => ({
      id,
      targetTime,
    }));
  }

  /**
   * Reschedules a task to a new target time.
   * @param {number} taskId - The ID of the task to reschedule.
   * @param {Date} newTargetTime - The new target time for the task.
   * @returns {boolean} True if the task was found and rescheduled, false otherwise.
   */
  rescheduleTask(taskId, newTargetTime) {
    const task = this.tasks.get(taskId);
    if (task) {
      clearTimeout(task.timeoutId);
      task.targetTime = newTargetTime;
      this._scheduleTask(task);
      return true;
    }
    return false;
  }
}

export { Task, TaskManager, TaskManager as default };
