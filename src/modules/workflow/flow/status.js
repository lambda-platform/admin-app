// import axios from "~/plugins/core/axios";
export function getStatusColor(statusType) {
  switch (statusType) {
    case "START":
      return "text-[#4648dc] border-[#4648dc]"; // Ноорог - Хөх
    case "CHECK":
      return "text-orange-400 border-orange-400"; // Хянах - Улбар шар
    case "TRANSFER":
      return "text-blue-400 border-blue-400"; // Шилжүүлэг - Цэнхэр
    case "RE_CREATE":
      return "text-teal-400 border-teal-400"; // Дахин боловсруулах - Ногоон цэнхэр
    case "VOTE":
      return "text-amber-400 border-amber-400"; // Санал хураалт - Хар шар
    case "ASSIGN":
      return "text-violet-600 border-violet-600"; // Хуваарилах - Бараан улаан
    case "DATE":
      return "text-cyan-700 border-cyan-700"; // Товлох - Цэнхэр ногоон
    case "COURT":
      return "text-blue-600 border-blue-600"; // Шүүх хуралдаан - Хүнд цэнхэр
    case "PRE_END":
      return "text-sky-300 border-sky-300"; // Хэвлэх, дугаар олгох - Тэнгэрийн цэнхэр
    case "END":
      return "text-green-500 border-green-500"; // Дууссан - Ногоон
    case "CANCEL":
      return "text-red-600 border-red-600"; // Цуцлагдсан - Улаан
    case "POSTPONE":
      return "text-orange-400 border-orange-400"; // Хойшлуулах - Улбар шар
    default:
      return "text-gray-500 border-gray-500"; // Анхдагч буюу үл мэдэгдэх төлөв - Гялгар улаан
  }
}

export function getStatusBgColor(statusType) {
  switch (statusType) {
    case "START":
      return "bg-[#4648dc] text-white"; // Ноорог - Хар
    case "CHECK":
      return "bg-orange-400 text-white"; // Хянах - Улбар шар
    case "TRANSFER":
      return "bg-blue-400 text-white"; // Шилжүүлэг - Цэнхэр
    case "RE_CREATE":
      return "bg-teal-400 text-white"; // Дахин боловсруулах - Ногоон цэнхэр
    case "VOTE":
      return "bg-amber-400 text-white"; // Санал хураалт - Хар шар
    case "ASSIGN":
      return "bg-violet-600 text-white"; // Хуваарилах - Бараан улаан
    case "DATE":
      return "bg-cyan-700 text-white"; // Товлох - Цэнхэр ногоон
    case "COURT":
      return "bg-blue-600 text-white"; // Шүүх хуралдаан - Хүнд цэнхэр
    case "PRE_END":
      return "bg-sky-300 text-white"; // Хэвлэх, дугаар олгох - Тэнгэрийн цэнхэр
    case "END":
      return "bg-green-500 text-white"; // Дууссан - Ногоон
    case "CANCEL":
      return "bg-red-600 text-white"; // Цуцлагдсан - Улаан
    case "POSTPONE":
      return "bg-orange-400 text-white"; // Хойшлуулах - Улбар шар
    default:
      return "bg-gray-500 text-white"; // Анхдагч буюу үл мэдэгдэх төлөв - Гялгар улаан
  }
}

export async function createStatusHistory(step, user, statusHistory) {
  let role_id = null;
  let user_id = null;

  if (step.attrs.subject.subject_type === "ANY_EMP" || step.attrs.subject.subject_type === "CURRENT" || step.attrs.subject.object_type === "END" || step.attrs.subject.object_type === "CANCEL") {
    role_id = user ? user.role * 1 : null;
    user_id = user ? user.id : null;
  }
  else if (step.attrs.subject.subject_type === "VOTERS") {
    role_id = null;
  }
  else if (step.attrs.subject.subject_type === "DIRECT") {
    role_id = step.attrs.subject.role_id ? step.attrs.subject.role_id : null;
    user_id = step.attrs.subject.user_id ? step.attrs.subject.user_id : null;
  }
  else if (step.attrs.subject.subject_type === "TO_ROLE") {
    role_id = step.attrs.subject.role_id ? step.attrs.subject.role_id : null;
  }
  else if (step.attrs.subject.subject_type === "CREATOR") {
    const index = statusHistory.findIndex(h => h.status_type === "START");
    if (index >= 0) {
      role_id = statusHistory[index].role_id;
      user_id = statusHistory[index].user_id;
    }
  }
  return {
    "id": null,
    "row_id": null,
    "role_id": role_id,
    "user_id": user_id,
    "status": step.attrs.label.text,
    "status_type": step.attrs.subject.object_type,
    "is_subject_changeable": step.attrs.subject.is_subject_changeable,
    "status_id": step.id,
    "subject_type": step.attrs.subject.subject_type,
    "is_read_only": step.attrs.subject.is_read_only,
    "is_signature_needed": step.attrs.subject.is_signature_needed,
    "description": null,
    "is_done": 0,
    "signature": null,
    "step_data": step
  }
}
