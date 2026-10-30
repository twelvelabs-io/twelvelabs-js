import {
    TasksCreateResponseStatus as GeneratedTasksCreateResponseStatus,
    TasksCreateResponseStatusZero,
} from "../../../../api/resources/embed/resources/v2/resources/tasks/types";

export * from "../../../../api/resources/embed/resources/v2";
export * as tasks from "./tasks";

export type TasksCreateResponseStatus = GeneratedTasksCreateResponseStatus;
export const TasksCreateResponseStatus = TasksCreateResponseStatusZero;
