import { MarkerType, Position } from "@vue-flow/core";
import {  organization} from '~/store/useSiteSettings'

// Measure text width for dynamic sizing
export const measureTextWidth = (text, font = '10px Arial') => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

// Constants for node sizing
export const BASE_CUSTOM_WIDTH = 40;
export const TRIGGER_GAP = 13;
export const MIN_CUSTOM_WIDTH = 120;
export const TRIGGER_Y = 50;
export const TRIGGER_PADDING = 13;

// Calculate trigger width based on label
export const calculateTriggerWidth = (label) => {
  const textWidth = measureTextWidth(label, '10px Arial');
  return Math.ceil(textWidth + TRIGGER_PADDING);
};

// Calculate action node width based on trigger widths
export const calculateActionNodeWidth = (label, triggers) => {
  const triggerWidths = triggers.map(trigger => calculateTriggerWidth(trigger));
  const labelWidths = measureTextWidth(label, '21px Arial') + 20;

  const totalTriggerWidth = triggerWidths.reduce((sum, width) => sum + width, 0);
  const totalGap = (triggers.length - 1) * TRIGGER_GAP;
  return Math.max(labelWidths, MIN_CUSTOM_WIDTH, BASE_CUSTOM_WIDTH + totalTriggerWidth + totalGap) - 19;
};

// Node types based on stencilConfig
export const nodeTypes = [
  {
    type: 'start',
    label: 'Эхлэл',
    icon: 'fa-solid fa-play',
    color: 'blue',
    description: 'Ажлын урсгалын эхлэл',
    subject: {
      object_type: "START",
      subject_type: "ANY_EMP",
      role_id: null,
      user_id: null,
      is_read_only: false,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'action',
    label: 'AI Шийдвэрлэлт',
    icon: 'fa-solid fa-robot',
    color: 'violet',
    description: 'AI-аар шийдвэрлэх шат',
    triggers: ['AI-аар шийдвэрлэсэн', 'AI-аар буцаасан'],
    subject: {
      object_type: "AI_DECISION",
      subject_type: "SYSTEM",
      role_id: null,
      user_id: null,
      is_read_only: true,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'action',
    label: 'Хянах',
    icon: 'fa-solid fa-check',
    color: 'teal',
    description: 'Хянах шат',
    triggers: ['Хянасан', 'Буцаасан'],
    subject: {
      object_type: "CHECK",
      subject_type: "TO_ROLE",
      role_id: null,
      user_id: null,
      is_read_only: false,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'action',
    label: 'Дахин боловсруулах',
    icon: 'fa-solid fa-reply',
    color: 'indigo',
    description: 'Дахин боловсруулах эсвэл төслийг цуцлах',
    triggers: ['Цуцалсан', 'Дахин боловсруулсан'],
    subject: {
      object_type: "RE_CREATE",
      subject_type: "CREATOR",
      role_id: null,
      user_id: null,
      is_read_only: false,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'action',
    label: 'Саналын хуудас бэлтгэх',
    icon: 'fa-solid fa-vote-yea',
    color: 'purple',
    description: 'Саналын хуудас бэлтгэх, санал өгөх албан тушаалтан сонгох',
    triggers: ['Саналын хуудас бэлтгэсэн'],
    subject: {
      object_type: "PREPARE_VOTE",
      subject_type: "CREATOR",
      struct_id: null,
      emp_id: null,
      is_read_only: true,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'action',
    label: 'Санал авах',
    icon: 'fa-solid fa-vote-yea',
    color: 'pink',
    description: 'Санал авах хуудасны дагуу санал авах',
    triggers: ['Зөвшөөрнө', 'Зөвшөөрөхгүй'],
    subject: {
      object_type: "VOTE",
      subject_type: "VOTERS",
      struct_id: null,
      emp_id: null,
      is_read_only: true,
      is_signature_needed: true,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'action',
    label: 'Шийдвэрлэх, цохох',
    icon: 'fa-solid fa-gavel',
    color: 'orange',
    description: 'Шийдвэрлэх, Холбогдох хүмүүст цохох',
    triggers: ['Холбогдох хүмүүст цохсон', 'Шийдвэрлэсэн'],
    subject: {
      object_type: "TRANSFER",
      subject_type: "CREATOR",
      struct_id: null,
      emp_id: null,
      is_read_only: true,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'action',
    label: 'Шийдвэрлэх, цохох 2',
    icon: 'fa-solid fa-gavel',
    color: 'amber',
    description: 'Шийдвэрлэх, Холбогдох хүмүүст цохох',
    triggers: ['Холбогдох хүмүүст цохсон', 'Шийдвэрлэсэн'],
    subject: {
      object_type: "TRANSFER",
      subject_type: "ANY_EMP",
      struct_id: null,
      emp_id: null,
      is_read_only: true,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'action',
    label: 'Хүлээлгэн өгөх',
    icon: 'fa-solid fa-hand-holding',
    color: 'cyan',
    description: 'Ажилтнуудад өгөх',
    triggers: ['Ажилтнуудад өгсөн'],
    subject: {
      object_type: "GIVE",
      subject_type: "CREATOR",
      struct_id: null,
      emp_id: null,
      is_read_only: true,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'action',
    label: 'Хүлээн авах',
    icon: 'fa-solid fa-inbox',
    color: 'lime',
    description: 'Хүлээн авах',
    triggers: ['Хүлээн авсан'],
    subject: {
      object_type: "RECEIVE",
      subject_type: "DIRECT",
      struct_id: null,
      emp_id: null,
      is_read_only: true,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'end',
    label: 'Албажсан',
    icon: 'fa-solid fa-check-circle',
    color: 'green',
    description: 'Ажлын урсгалын төгсгөл',
    subject: {
      object_type: "END",
      subject_type: "CURRENT",
      role_id: null,
      user_id: null,
      is_read_only: false,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'end',
    label: 'Цуцалсан',
    icon: 'fa-solid fa-cancel',
    color: 'red',
    description: 'Ажлын урсгалыг цуцлах',
    subject: {
      object_type: "CANCEL",
      subject_type: "CURRENT",
      role_id: null,
      user_id: null,
      is_read_only: false,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  },
  {
    type: 'end',
    label: 'Хойшлуулах',
    icon: 'fa-solid fa-clock',
    color: 'gray',
    description: 'Ажлын урсгалыг хойшлуулах',
    subject: {
      object_type: "POSTPONE",
      subject_type: "CURRENT",
      role_id: null,
      user_id: null,
      is_read_only: false,
      is_signature_needed: false,
      is_subject_changeable: false,
      org_role_id:2,
      org_id:organization.value.org_id,
    }
  }
];

// Mock nodes with description and subject
export const mockNodes =[
  {
    "id": "1",
    "type": "start",
    "initialized": false,
    "position": {
      "x": 246.60800137671094,
      "y": 25.35199173973438
    },
    "data": {
      "label": "Эхлэл",

      "toolbarPosition": "right",
      "icon": "fa-solid fa-play",
      "color": "blue",
      "description": "Ажлын урсгалын эхлэл",
      "subject": {
        "object_type": "START",
        "subject_type": "ANY_EMP",
        "role_id": null,
        "user_id": null,
        "is_read_only": false,
        "is_signature_needed": false,
        "is_subject_changeable": false
      }
    }
  },
  {
    "id": "2",
    "type": "action",
    "initialized": false,
    "position": {
      "x": 221.17105999464349,
      "y": 139.9098709981252
    },
    "data": {
      "label": "Хянах",

      "toolbarPosition": "right",
      "icon": "fa-solid fa-check",
      "color": "teal",
      "description": "Хянах шат",
      "triggers": [
        "Хянасан",
        "Буцаасан"
      ],
      "subject": {
        "object_type": "CHECK",
        "subject_type": "TO_ROLE",
        "role_id": null,
        "user_id": null,
        "is_read_only": false,
        "is_signature_needed": false,
        "is_subject_changeable": false
      }
    },
    "style": {
      "width": "139px",
      "height": "90px"
    }
  },
  {
    "id": "2-1",
    "type": "trigger",
    "draggable": false,
    "initialized": false,
    "position": {
      "x": 10,
      "y": 50
    },
    "data": {
      "label": "Хянасан",

      "toolbarPosition": "right"
    },
    "parentNode": "2",
    "extent": "parent",
    "expandParent": true,
    "style": {
      "width": "47px"
    }
  },
  {
    "id": "2-2",
    "type": "trigger",
    "draggable": false,
    "initialized": false,
    "position": {
      "x": 70,
      "y": 50
    },
    "data": {
      "label": "Буцаасан",

      "toolbarPosition": "right"
    },
    "parentNode": "2",
    "extent": "parent",
    "expandParent": true,
    "style": {
      "width": "58px"
    }
  },
  {
    "id": "3",
    "type": "end",
    "initialized": false,
    "position": {
      "x": 134.44188083759906,
      "y": 663.288559956622
    },
    "data": {
      "label": "Албажсан",

      "toolbarPosition": "right",
      "icon": "fa-solid fa-check-circle",
      "color": "green",
      "description": "Ажлын урсгалын төгсгөл",
      "subject": {
        "object_type": "END",
        "subject_type": "CURRENT",
        "role_id": null,
        "user_id": null,
        "is_read_only": false,
        "is_signature_needed": false,
        "is_subject_changeable": false
      }
    }
  },
  {
    "id": "node-1752162738850-nt2npcc1x",
    "type": "action",
    "initialized": false,
    "position": {
      "x": 68.91278409150358,
      "y": 277.7422192660912
    },
    "data": {
      "label": "Саналын хуудас бэлтгэх",

      "toolbarPosition": "right",
      "icon": "fa-solid fa-vote-yea",
      "color": "purple",
      "description": "Саналын хуудас бэлтгэх, санал өгөх албан тушаалтан сонгох",
      "subject": {
        "object_type": "PREPARE_VOTE",
        "subject_type": "CREATOR",
        "struct_id": null,
        "emp_id": null,
        "is_read_only": true,
        "is_signature_needed": false,
        "is_subject_changeable": false
      },
      "triggers": [
        "Саналын хуудас бэлтгэсэн"
      ]
    },
    "style": {
      "width": "219.76220703125px",
      "height": "90px"
    }
  },
  {
    "id": "node-1752162738850-nt2npcc1x-1",
    "type": "trigger",
    "draggable": false,
    "initialized": false,
    "position": {
      "x": 10,
      "y": 50
    },
    "data": {
      "label": "Саналын хуудас бэлтгэсэн",

      "toolbarPosition": "right",
      "parentSubject": {
        "object_type": "PREPARE_VOTE",
        "subject_type": "CREATOR",
        "struct_id": null,
        "emp_id": null,
        "is_read_only": true,
        "is_signature_needed": false,
        "is_subject_changeable": false
      }
    },
    "parentNode": "node-1752162738850-nt2npcc1x",
    "extent": "parent",
    "expandParent": true,
    "style": {
      "width": "138px"
    }
  },
  {
    "id": "node-1752162749565-gp93g2m4y",
    "type": "action",
    "initialized": false,
    "position": {
      "x": 149.5485698485462,
      "y": 410.4412101587237
    },
    "data": {
      "label": "Санал авах",

      "toolbarPosition": "right",
      "icon": "fa-solid fa-vote-yea",
      "color": "pink",
      "description": "Санал авах хуудасны дагуу санал авах",
      "subject": {
        "object_type": "VOTE",
        "subject_type": "VOTERS",
        "struct_id": null,
        "emp_id": null,
        "is_read_only": true,
        "is_signature_needed": true,
        "is_subject_changeable": false
      },
      "triggers": [
        "Зөвшөөрнө",
        "Зөвшөөрөхгүй"
      ]
    },
    "style": {
      "width": "180px",
      "height": "90px"
    }
  },
  {
    "id": "node-1752162749565-gp93g2m4y-1",
    "type": "trigger",
    "draggable": false,
    "initialized": false,
    "position": {
      "x": 10,
      "y": 50
    },
    "data": {
      "label": "Зөвшөөрнө",

      "toolbarPosition": "right",
      "parentSubject": {
        "object_type": "VOTE",
        "subject_type": "VOTERS",
        "struct_id": null,
        "emp_id": null,
        "is_read_only": true,
        "is_signature_needed": true,
        "is_subject_changeable": false
      }
    },
    "parentNode": "node-1752162749565-gp93g2m4y",
    "extent": "parent",
    "expandParent": true,
    "style": {
      "width": "66px"
    }
  },
  {
    "id": "node-1752162749565-gp93g2m4y-2",
    "type": "trigger",
    "draggable": false,
    "initialized": false,
    "position": {
      "x": 89,
      "y": 50
    },
    "data": {
      "label": "Зөвшөөрөхгүй",

      "toolbarPosition": "right",
      "parentSubject": {
        "object_type": "VOTE",
        "subject_type": "VOTERS",
        "struct_id": null,
        "emp_id": null,
        "is_read_only": true,
        "is_signature_needed": true,
        "is_subject_changeable": false
      }
    },
    "parentNode": "node-1752162749565-gp93g2m4y",
    "extent": "parent",
    "expandParent": true,
    "style": {
      "width": "80px"
    }
  },
  {
    "id": "node-1752162759355-kvwcbviys",
    "type": "action",
    "initialized": false,
    "position": {
      "x": -82.98050530285559,
      "y": 522.862580747965
    },
    "data": {
      "label": "Хянах",

      "toolbarPosition": "right",
      "icon": "fa-solid fa-check",
      "color": "teal",
      "description": "Хянах шат",
      "subject": {
        "object_type": "CHECK",
        "subject_type": "TO_ROLE",
        "role_id": null,
        "user_id": null,
        "is_read_only": false,
        "is_signature_needed": false,
        "is_subject_changeable": false
      },
      "triggers": [
        "Хянасан",
        "Буцаасан"
      ]
    },
    "style": {
      "width": "139px",
      "height": "90px"
    }
  },
  {
    "id": "node-1752162759355-kvwcbviys-1",
    "type": "trigger",
    "draggable": false,
    "initialized": false,
    "position": {
      "x": 10,
      "y": 50
    },
    "data": {
      "label": "Хянасан",

      "toolbarPosition": "right",
      "parentSubject": {
        "object_type": "CHECK",
        "subject_type": "TO_ROLE",
        "role_id": null,
        "user_id": null,
        "is_read_only": false,
        "is_signature_needed": false,
        "is_subject_changeable": false
      }
    },
    "parentNode": "node-1752162759355-kvwcbviys",
    "extent": "parent",
    "expandParent": true,
    "style": {
      "width": "47px"
    }
  },
  {
    "id": "node-1752162759355-kvwcbviys-2",
    "type": "trigger",
    "draggable": false,
    "initialized": false,
    "position": {
      "x": 70,
      "y": 50
    },
    "data": {
      "label": "Буцаасан",

      "toolbarPosition": "right",
      "parentSubject": {
        "object_type": "CHECK",
        "subject_type": "TO_ROLE",
        "role_id": null,
        "user_id": null,
        "is_read_only": false,
        "is_signature_needed": false,
        "is_subject_changeable": false
      }
    },
    "parentNode": "node-1752162759355-kvwcbviys",
    "extent": "parent",
    "expandParent": true,
    "style": {
      "width": "58px"
    }
  },
  {
    "id": "node-1752162782549-3c5d7tvsv",
    "type": "action",
    "initialized": false,
    "position": {
      "x": 513.6984987858675,
      "y": 418.5631955207271
    },
    "data": {
      "label": "Дахин боловсруулах",

      "toolbarPosition": "right",
      "icon": "fa-solid fa-reply",
      "color": "indigo",
      "description": "Дахин боловсруулах эсвэл төслийг цуцлах",
      "subject": {
        "object_type": "RE_CREATE",
        "subject_type": "CREATOR",
        "role_id": null,
        "user_id": null,
        "is_read_only": false,
        "is_signature_needed": false,
        "is_subject_changeable": false
      },
      "triggers": [
        "Цуцалсан",
        "Дахин боловсруулсан"
      ]
    },
    "style": {
      "width": "208px",
      "height": "90px"
    }
  },
  {
    "id": "node-1752162782549-3c5d7tvsv-1",
    "type": "trigger",
    "draggable": false,
    "initialized": false,
    "position": {
      "x": 10,
      "y": 50
    },
    "data": {
      "label": "Цуцалсан",

      "toolbarPosition": "right",
      "parentSubject": {
        "object_type": "RE_CREATE",
        "subject_type": "CREATOR",
        "role_id": null,
        "user_id": null,
        "is_read_only": false,
        "is_signature_needed": false,
        "is_subject_changeable": false
      }
    },
    "parentNode": "node-1752162782549-3c5d7tvsv",
    "extent": "parent",
    "expandParent": true,
    "style": {
      "width": "59px"
    }
  },
  {
    "id": "node-1752162782549-3c5d7tvsv-2",
    "type": "trigger",
    "draggable": false,
    "initialized": false,
    "position": {
      "x": 82,
      "y": 50
    },
    "data": {
      "label": "Дахин боловсруулсан",

      "toolbarPosition": "right",
      "parentSubject": {
        "object_type": "RE_CREATE",
        "subject_type": "CREATOR",
        "role_id": null,
        "user_id": null,
        "is_read_only": false,
        "is_signature_needed": false,
        "is_subject_changeable": false
      }
    },
    "parentNode": "node-1752162782549-3c5d7tvsv",
    "extent": "parent",
    "expandParent": true,
    "style": {
      "width": "115px"
    }
  },
  {
    "id": "node-1752162797090-1rco45urc",
    "type": "end",
    "initialized": false,
    "position": {
      "x": 323.74992842555747,
      "y": 661.8709953486895
    },
    "data": {
      "label": "Цуцлах",

      "toolbarPosition": "right",
      "icon": "fa-solid fa-cancel",
      "color": "red",
      "description": "Ажлын урсгалыг цуцлах",
      "subject": {
        "object_type": "CANCEL",
        "subject_type": "CURRENT",
        "role_id": null,
        "user_id": null,
        "is_read_only": false,
        "is_signature_needed": false,
        "is_subject_changeable": false
      }
    }
  }
];

export const mockEdges = [
  {
    "id": "e1-2",
    "type": "smoothstep",
    "source": "1",
    "target": "2",
    "data": {},
    "label": "",
    "animated": false,
    "markerEnd": {
      "type": "arrowclosed"
    },
    "sourceX": 289.55331387671094,
    "sourceY": 77.35199173973439,
    "targetX": 290.6710599946435,
    "targetY": 135.9098709981252
  },
  {
    "id": "e2-1-node-1752162738850-nt2npcc1x",
    "type": "smoothstep",
    "source": "2-1",
    "target": "node-1752162738850-nt2npcc1x",
    "sourceHandle": "2-1",
    "targetHandle": null,
    "data": {},
    "label": "",
    "animated": false,
    "markerEnd": {
      "type": "arrowclosed"
    },
    "sourceX": 254.67105999464349,
    "sourceY": 216.5739334981252,
    "targetX": 178.78782022904724,
    "targetY": 273.7422547561095
  },
  {
    "id": "enode-1752162738850-nt2npcc1x-1-node-1752162749565-gp93g2m4y",
    "type": "smoothstep",
    "source": "node-1752162738850-nt2npcc1x-1",
    "target": "node-1752162749565-gp93g2m4y",
    "sourceHandle": "node-1752162738850-nt2npcc1x-1",
    "targetHandle": null,
    "data": {},
    "label": "",
    "animated": false,
    "markerEnd": {
      "type": "arrowclosed"
    },
    "sourceX": 147.91288921583205,
    "sourceY": 354.40630089061085,
    "targetX": 239.54862561455312,
    "targetY": 406.44120165925005
  },
  {
    "id": "enode-1752162759355-kvwcbviys-1-3",
    "type": "smoothstep",
    "source": "node-1752162759355-kvwcbviys-1",
    "target": "3",
    "sourceHandle": "node-1752162759355-kvwcbviys-1",
    "targetHandle": null,
    "data": {},
    "label": "",
    "animated": false,
    "markerEnd": {
      "type": "arrowclosed"
    },
    "sourceX": -49.48049136135386,
    "sourceY": 599.5266183829926,
    "targetX": 186.44188083759906,
    "targetY": 659.288559956622
  },
  {
    "id": "enode-1752162749565-gp93g2m4y-1-node-1752162759355-kvwcbviys",
    "type": "smoothstep",
    "source": "node-1752162749565-gp93g2m4y-1",
    "target": "node-1752162759355-kvwcbviys",
    "sourceHandle": "node-1752162749565-gp93g2m4y-1",
    "targetHandle": null,
    "data": {},
    "label": "",
    "animated": false,
    "markerEnd": {
      "type": "arrowclosed"
    },
    "sourceX": 192.54855448811944,
    "sourceY": 487.10524779375135,
    "targetX": -13.480432611099808,
    "targetY": 518.8625722484913
  },
  {
    "id": "e2-2-node-1752162782549-3c5d7tvsv",
    "type": "smoothstep",
    "source": "2-2",
    "target": "node-1752162782549-3c5d7tvsv",
    "sourceHandle": "2-2",
    "targetHandle": null,
    "data": {},
    "label": "",
    "animated": false,
    "markerEnd": {
      "type": "arrowclosed"
    },
    "sourceX": 320.1710599946435,
    "sourceY": 216.5739334981252,
    "targetX": 617.6986502842703,
    "targetY": 414.56318702125344
  },
  {
    "id": "enode-1752162782549-3c5d7tvsv-2-2",
    "type": "smoothstep",
    "source": "node-1752162782549-3c5d7tvsv-2",
    "target": "2",
    "sourceHandle": "node-1752162782549-3c5d7tvsv-2",
    "targetHandle": null,
    "data": {},
    "label": "",
    "animated": false,
    "markerEnd": {
      "type": "arrowclosed"
    },
    "sourceX": 653.1985189886576,
    "sourceY": 495.22723315575473,
    "targetX": 290.6710599946435,
    "targetY": 135.9098709981252
  },
  {
    "id": "enode-1752162782549-3c5d7tvsv-1-node-1752162797090-1rco45urc",
    "type": "smoothstep",
    "source": "node-1752162782549-3c5d7tvsv-1",
    "target": "node-1752162797090-1rco45urc",
    "sourceHandle": "node-1752162782549-3c5d7tvsv-1",
    "targetHandle": null,
    "data": {},
    "label": "",
    "animated": false,
    "markerEnd": {
      "type": "arrowclosed"
    },
    "sourceX": 553.1985034818338,
    "sourceY": 495.22723315575473,
    "targetX": 375.74999785551523,
    "targetY": 657.8709987572499
  },
  {
    "id": "enode-1752162749565-gp93g2m4y-2-node-1752162797090-1rco45urc",
    "type": "smoothstep",
    "source": "node-1752162749565-gp93g2m4y-2",
    "target": "node-1752162797090-1rco45urc",
    "sourceHandle": "node-1752162749565-gp93g2m4y-2",
    "targetHandle": null,
    "data": {},
    "label": "",
    "animated": false,
    "markerEnd": {
      "type": "arrowclosed"
    },
    "sourceX": 278.5486023543174,
    "sourceY": 487.10524779375135,
    "targetX": 375.74999785551523,
    "targetY": 657.8709987572499
  }
];
