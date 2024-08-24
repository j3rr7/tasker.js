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
 * Class to manage tasks.
 * 
 * @property {Map} tasks - A map of task IDs to Task objects.
 * @property {number} nextTaskId - The next available task ID.
 */
class TaskManager {
  constructor() {
    /**
     * A map of task IDs to Task objects.
     * @type {Map<number, Task>}
     * @private
     */
    this.tasks = new Map();

    /**
     * The next available task ID.
     * @type {number}
     * @private
     */
    this.nextTaskId = 1;
  }

  /**
   * Creates and schedules a new task.
   * @param {Date} targetTime - The time at which the task should be executed.
   * @param {function} callback - The function to be executed when the task is executed.
   * @returns {number} The task ID. This can be used to cancel or reschedule the task.
   */
  createTask(targetTime, callback) {
    const taskId = this.nextTaskId++;
    const task = new Task(taskId, targetTime, callback);
    this.tasks.set(taskId, task);
    this._scheduleTask(task);
    console.debug(`Task ${taskId} created, scheduled for ${targetTime}`);
    return taskId;
  }

  /**
   * Schedules a task for execution. If the task is scheduled in the past, it will be executed immediately.
   * @param {Task} task - The task to schedule.
   * @private
   */
  _scheduleTask(task) {
    const now = Date.now();
    const timeUntilTarget = task.targetTime.getTime() - now;

    if (timeUntilTarget > 0) {
      task.timeoutId = setTimeout(() => this._executeTask(task.id), timeUntilTarget);
      console.debug(`Task ${task.id} scheduled to run in ${timeUntilTarget}ms`);
    } else {
      console.warn(`Task ${task.id} is scheduled in the past. Executing immediately.`);
      this._executeTask(task.id);
    }
  }

  /**
   * Executes a task and removes it from the task list.
   * @param {number} taskId - The ID of the task to execute.
   * @private
   */
  _executeTask(taskId) {
    const task = this.tasks.get(taskId);
    if (task) {
      console.debug(`Executing task ${taskId}`);
      task.callback();
      this.tasks.delete(taskId);
      console.debug(`Task ${taskId} completed and removed from task list`);
    } else {
      console.warn(`Task ${taskId} not found (may have been cancelled)`);
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
      console.debug(`Task ${taskId} cancelled and removed from task list`);
      return true;
    }
    console.warn(`Task ${taskId} not found, cannot cancel`);
    return false;
  }

  /**
   * Gets all tasks. 
   * @returns {Array<{id: number, targetTime: Date}>} An array of objects, each representing an active task.
   */
  getTasks() {
    return Array.from(this.tasks.values()).map(({ id, targetTime }) => ({ id, targetTime }));
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
      console.debug(`Task ${taskId} rescheduled for ${newTargetTime}`);
      return true;
    }
    console.warn(`Task ${taskId} not found, cannot reschedule`);
    return false;
  }
}

export { Task, TaskManager };

export default TaskManager;