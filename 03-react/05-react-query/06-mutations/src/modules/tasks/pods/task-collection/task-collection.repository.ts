import * as apiModel from "./api/api.model";
import { mapTaskFromApiToVm } from "./task-collection.mapper";
import * as vm from "./task-collection.vm";
import { getTaskCollection as getTaskCollecionApi } from "./api/api";

export const getTaskCollection = async (): Promise<vm.TaskVm[]> => {
  const apiTaskCollection: apiModel.TaskModel[] = await getTaskCollecionApi();
  return apiTaskCollection.map(mapTaskFromApiToVm);
};
