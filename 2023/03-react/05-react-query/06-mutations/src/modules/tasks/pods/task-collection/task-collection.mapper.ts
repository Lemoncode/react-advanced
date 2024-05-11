import * as apiModel from "./api/api.model";
import * as vm from "./task-collection.vm";

export const mapTaskFromApiToVm = (task: apiModel.TaskModel): vm.TaskVm => ({
  ...task,
});

export const mapTaskFromVmToApi = (task: vm.TaskVm): apiModel.TaskModel => ({
  ...task,
});
