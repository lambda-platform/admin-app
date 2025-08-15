// Define a color map for status types
const statusColorMap = {
  START: {
    text: 'text-fuchsia-500', // Emerald for Draft
    border: 'border-fuchsia-500 border-2',
    bg: 'bg-fuchsia-500 text-white',
  },
  CHECK: {
    text: 'text-orange-500', // Orange for Review
    border: 'border-orange-500 border-2',
    bg: 'bg-orange-500 text-white',
  },
  AI_DECISION: {
    text: 'text-blue-600', // Orange for Review
    border: 'border-blue-600 border-2',
    bg: 'bg-blue-600 text-white',
  },
  TRANSFER: {
    text: 'text-blue-500', // Blue for Transfer
    border: 'border-blue-500 border-2',
    bg: 'bg-blue-500 text-white',
  },
  RE_CREATE: {
    text: 'text-teal-500', // Teal for Recreate
    border: 'border-teal-500 border-2',
    bg: 'bg-teal-500 text-white',
  },
  PREPARE_VOTE: {
    text: 'text-amber-500', // Amber for Voting
    border: 'border-amber-500 border-2',
    bg: 'bg-amber-500 text-white',
  },
  VOTE: {
    text: 'text-purple-500', // Purple for Prepare Vote
    border: 'border-purple-500 border-2',
    bg: 'bg-purple-500 text-white',
  },
  ASSIGN: {
    text: 'text-violet-600', // Violet for Assign
    border: 'border-violet-600 border-2',
    bg: 'bg-violet-600 text-white',
  },
  DATE: {
    text: 'text-cyan-700', // Cyan for Schedule
    border: 'border-cyan-700 border-2',
    bg: 'bg-cyan-700 text-white',
  },
  PRE_END: {
    text: 'text-sky-300', // Sky Blue for Pre-End
    border: 'border-sky-300 border-2',
    bg: 'bg-sky-300 text-white',
  },
  END: {
    text: 'text-green-500', // Green for Done
    border: 'border-green-500 border-2',
    bg: 'bg-green-500 text-white',
  },
  CANCEL: {
    text: 'text-red-600', // Red for Cancel
    border: 'border-red-600 border-2',
    bg: 'bg-red-600 text-white',
  },
  POSTPONE: {
    text: 'text-orange-500', // Orange for Postpone
    border: 'border-orange-500 border-2',
    bg: 'bg-orange-500 text-white',
  },
  GIVE: {
    text: 'text-cyan-500', // Cyan for Give
    border: 'border-cyan-500 border-2',
    bg: 'bg-cyan-500 text-white',
  },
  RECEIVE: {
    text: 'text-lime-500', // Lime for Receive
    border: 'border-lime-500 border-2',
    bg: 'bg-lime-500 text-white',
  },

};

// Default color for unknown statuses (replacing gray with neutral blue)
const defaultColor = {
  text: 'text-blue-500',
  border: 'border-blue-500 border-2',
  bg: 'bg-blue-500 text-white',
};

// Get text color for a status type
export function getStatusColor(statusType) {
  return statusColorMap[statusType]?.text || defaultColor.text;
}

// Get border color for a status type
export function getStatusBorderColor(statusType) {
  return statusColorMap[statusType]?.border || defaultColor.border;
}

// Get background color for a status type
export function getStatusBgColor(statusType) {
  return statusColorMap[statusType]?.bg || defaultColor.bg;
}

// Retain the createStatusHistory function as is
export async function createStatusHistory(step, user, statusHistory) {

  let role_id = null;
  let user_id = null;
  let org_role_id = null;
  let org_id = null;
  let struct_id = null;
  let job_id = null;
  let emp_id = null;

  if (step.data.subject.subject_type === "ANY_EMP" || step.data.subject.subject_type === "CURRENT" || step.data.subject.object_type === "END" || step.data.subject.object_type === "CANCEL") {
    role_id = user ? user.role * 1 : null;
    user_id = user ? user.id : null;
  } else if (step.data.subject.subject_type === "VOTERS") {
    role_id = null;
  } else if (step.data.subject.subject_type === "DIRECT") {
    role_id = step.data.subject.role_id ? step.data.subject.role_id : null;
    user_id = step.data.subject.user_id ? step.data.subject.user_id : null;
  } else if (step.data.subject.subject_type === "TO_ORG_STRUCT") {
    org_role_id = step.data.subject.org_role_id ? step.data.subject.org_role_id : null;
    org_id = step.data.subject.org_id ? step.data.subject.org_id : null;
    struct_id = step.data.subject.struct_id ? step.data.subject.struct_id : null;
  } else if (step.data.subject.subject_type === "TO_ORG_JOB") {
    org_role_id = step.data.subject.org_role_id ? step.data.subject.org_role_id : null;
    org_id = step.data.subject.org_id ? step.data.subject.org_id : null;
    struct_id = step.data.subject.struct_id ? step.data.subject.struct_id : null;
    job_id = step.data.subject.job_id ? step.data.subject.job_id : null;
  } else if (step.data.subject.subject_type === "TO_ORG_EMPLOYEE") {
    org_role_id = step.data.subject.org_role_id ? step.data.subject.org_role_id : null;
    org_id = step.data.subject.org_id ? step.data.subject.org_id : null;
    struct_id = step.data.subject.struct_id ? step.data.subject.struct_id : null;
    job_id = step.data.subject.job_id ? step.data.subject.job_id : null;
    emp_id = step.data.subject.emp_id ? step.data.subject.emp_id : null;
  } else if (step.data.subject.subject_type === "TO_ROLE") {
    role_id = step.data.subject.role_id ? step.data.subject.role_id : null;
  } else if (step.data.subject.subject_type === "CREATOR") {
    const index = statusHistory.findIndex(h => h.status_type === "START");
    if (index >= 0) {
      role_id = statusHistory[index].role_id;
      user_id = statusHistory[index].user_id;
      org_role_id = statusHistory[index].org_role_id;
      org_id = statusHistory[index].org_id;
      struct_id = statusHistory[index].struct_id;
      job_id = statusHistory[index].job_id;
      emp_id = statusHistory[index].emp_id;
    }
  }
  return {
    id: null,
    row_id: null,
    role_id,
    user_id,
    org_role_id,
    org_id,
    struct_id,
    job_id,
    emp_id,
    status: step.data.label,
    status_type: step.data.subject.object_type,
    is_subject_changeable: step.data.subject.is_subject_changeable,
    status_id: step.id,
    subject_type: step.data.subject.subject_type,
    is_read_only: step.data.subject.is_read_only,
    is_signature_needed: step.data.subject.is_signature_needed,
    description: null,
    is_done: 0,
    signature: null,
    step_data: step,
  };
}

