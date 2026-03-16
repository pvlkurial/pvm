import cron from "node-cron";
import { postImage } from "./post-image";

const tasks: ReturnType<typeof cron.schedule>[] = [];

export async function registerReportCron() {
    console.log("[Cron] Registering Report Cron...");

    /* "0 20 * * *" */
    const task = cron.schedule("* * * * *", async () => {
        console.log("[Cron] Report Job Triggered");
        try {
            await postImage();
        } catch (error) {
            console.error("[Cron] Job execution failed:", error);
        }
    });

    tasks.push(task);
    console.log("[Cron] Report Job Scheduled (Runs every day at 20:00)");
}

export function initCronJobs() {
    registerReportCron();
}