import * as apiModel from "./api/api.model";
import {
  mapTaskFromApiToVm,
  mapTaskFromVmToApi,
} from "./task-collection.mapper";
import * as vm from "./task-collection.vm";
import {
  getTaskCollection as getTaskCollecionApi,
  insertTask as insertTaskApi,
  updateTask as updateTaskApi,
} from "./api/api";

export const getTaskCollection = async (): Promise<vm.TaskVm[]> => {
  const apiTaskCollection: apiModel.TaskModel[] = await getTaskCollecionApi();
  return apiTaskCollection.map(mapTaskFromApiToVm);
};

export const insertTask = async (task: vm.TaskVm): Promise<vm.TaskVm> => {
  const apiTask = mapTaskFromVmToApi(task);
  const insertedTask = await insertTaskApi(apiTask);
  return mapTaskFromApiToVm(insertedTask);
};

export const updateTask = async (task: vm.TaskVm): Promise<vm.TaskVm> => {
  const apiTask = mapTaskFromVmToApi(task);
  const updatedTask = await updateTaskApi(apiTask);
  return mapTaskFromApiToVm(updatedTask);
};
