import { ICreateSchedulePayload } from "./schedule.interface";

const createSchedule = async (payload: ICreateSchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const interval = 30;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  const schedule = [];
};
