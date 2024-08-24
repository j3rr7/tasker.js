import { jest } from '@jest/globals';
import { Task, TaskManager } from '../src/task';

jest.useFakeTimers();

describe('Task', () => {
  it('should create a new task with the correct properties', () => {
    const callback = jest.fn();
    const targetTime = new Date();
    const task = new Task(1, targetTime, callback);
    expect(task.id).toBe(1);
    expect(task.targetTime).toBe(targetTime);
    expect(task.callback).toBe(callback);
    expect(task.timeoutId).toBeNull();
  });
});

describe('TaskManager', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(global, 'clearTimeout');
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it('should create a new task manager', () => {
    expect(taskManager).toBeInstanceOf(TaskManager);
    expect(taskManager.tasks).toBeInstanceOf(Map);
    expect(taskManager.nextTaskId).toBe(1);
  });

  it('should create a new task', () => {
    const targetTime = new Date(Date.now() + 1000);
    const callback = jest.fn();
    const taskId = taskManager.createTask(targetTime, callback);

    expect(taskId).toBe(1);
    expect(taskManager.tasks.size).toBe(1);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  it('should execute a task', () => {
    const targetTime = new Date(Date.now() - 1000);
    const callback = jest.fn();
    const taskId = taskManager.createTask(targetTime, callback);
    jest.runAllTimers(); 

    expect(callback).toHaveBeenCalledTimes(1);
    expect(taskManager.tasks.size).toBe(0);
  });

  it('should cancel a task', () => {
    const targetTime = new Date(Date.now() + 1000);
    const callback = jest.fn();
    const taskId = taskManager.createTask(targetTime, callback);
    const cancelled = taskManager.cancelTask(taskId);

    expect(cancelled).toBe(true);
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(taskManager.tasks.size).toBe(0);
  });

  it('should reschedule a task', () => {
    const targetTime = new Date(Date.now() + 1000);
    const newTargetTime = new Date(Date.now() + 2000);
    const callback = jest.fn();
    const taskId = taskManager.createTask(targetTime, callback);
    const rescheduled = taskManager.rescheduleTask(taskId, newTargetTime);

    expect(rescheduled).toBe(true);
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(taskManager.tasks.get(taskId).targetTime).toBe(newTargetTime);
  });

  it('should get all tasks', () => {
    const targetTime1 = new Date(Date.now() + 1000);
    const targetTime2 = new Date(Date.now() + 2000);
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const taskId1 = taskManager.createTask(targetTime1, callback1);
    const taskId2 = taskManager.createTask(targetTime2, callback2);

    const tasks = taskManager.getTasks();

    expect(tasks).toEqual([
      { id: taskId1, targetTime: targetTime1 },
      { id: taskId2, targetTime: targetTime2 },
    ]);
  });
});