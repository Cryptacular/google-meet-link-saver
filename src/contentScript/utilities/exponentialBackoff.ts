type BackOffOption =
  | {
      attempt: number;
      timeoutMs: number;
      shouldStop?: boolean;
    }
  | {
      attempt: number;
      timeoutMs?: number;
      shouldStop: true;
    };

export const executeWithExponentialBackoff = async (
  f: Function,
  timeoutMs: number,
  backoffOptions: BackOffOption[],
  attempt: number = 0
) => {
  let timeout = timeoutMs;

  for (const option of backoffOptions) {
    if (attempt === option.attempt) {
      if (option.shouldStop) {
        console.log(`Reached attempt number '${attempt}'. Stopping.`);
        return;
      } else {
        timeout = option.timeoutMs;
        console.log(
          `Reached attempt number '${attempt}'. Setting timeout to '${option.timeoutMs}'`
        );
      }
    }
  }

  try {
    await f();
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error(err);
    }

    setTimeout(() => {
      executeWithExponentialBackoff(f, timeout, backoffOptions, attempt + 1);
    }, timeout);
  }
};
