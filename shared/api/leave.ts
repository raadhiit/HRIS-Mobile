import dummy from '@/assets/mock/dummy.json';

export type LeaveForm = {
    leaveType: string | null;
    start: string;
    end: string;
    reason: string;
    subtitute: string;
}

export type LeaveResponse = typeof dummy;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitLeave(form: LeaveForm): Promise<LeaveResponse> {
  if (!form?.start || !form?.end || !form?.leaveType || !form?.subtitute || !form?.reason) {
    await sleep(300);
    throw new Error("Form wajib diisi.");
  }

  // Simulasi jaringan
  await sleep(500);

  return {
    ...dummy,
    data: {
      ...dummy.data,
      start: form.start,
      end: form.end,
      subtitute: form.subtitute,
      reason: form.reason ?? dummy.data.reason
    }
  };
}