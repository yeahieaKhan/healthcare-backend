import { addHours, addMinutes, format } from "date-fns";
import { ICreateSchedulePayload } from "./schedule.interface";

const createSchedule = async (payload: ICreateSchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const interval = 30;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  const schedule = [];

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-mm-dd")} ${startTime}`,
          Number(startTime.split(":")[0]),
        ),
        Number(startTime.split(":")[1]),
      ),
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-mm-dd")}`,
          Number(endTime.split(":")[0]),
        ),

        Number(endTime.split(":")[1]),
      ),
    );


    while (startDateTime < endDateTime) {
      
    }
  }
};
