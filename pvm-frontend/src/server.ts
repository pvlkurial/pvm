export async function register() {
    // only run the the runtime is nodejs
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { initCronJobs } = await import("./app/server");
        // start cron jobs / server
        initCronJobs();
    }
}