import {
  BACK_ICON, BUDGET_ICON,
  CONFIRMATION2_ICON,
  CONFIRMATION_ICON,
  DARK_COLOR,
  ENTITY_ICON,
  FONT_FAMILY,
  LIGHT_COLOR,
  LINE_WIDTH,
  MESSAGE_ICON,
  OUT_PORT_HEIGHT,
  OUT_PORT_WIDTH,
  PADDING_L,
  PADDING_S,
  PORT_BORDER_RADIUS,
  REMOVE_PORT_SIZE,
  SEEN_ICON, SEND_TO_DOC_ICON,
  USER_INPUT_ICON, VOTE_ICON, BANK_ICON
} from '../../theme';
import {outputPortPositionTop} from "~/modules/workflow/workflow/rappid/shapes/app.shapes";

export const stencilConfig = {
  shapes: [{
    name: 'FlowchartStart',
    attrs: {
      subject: {
        object_type: "START",
        subject_type: "ANY_EMP",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false
      },
    }
  },
  {
    name: 'Message',
    attrs: {
      label: {text: 'Хэргийн иж бүрдэл бүрэн эсэх'},
      description: {text: 'Мэдээлэл лавлагааны мэргэжилтэн цахимаар хүлээн авах'},
      icon: {xlinkHref: CONFIRMATION_ICON},
      ports: {
        items: [
          {
            group: 'in'
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Бүрэн"}}
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Бүрэн бус"}}
          }
        ]
      },
      subject: {
        object_type: "CASE",
        subject_type: "TO_ROLE",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false
      },
    }
  },
  {
    name: 'Message',
    attrs: {
      label: {text: 'Дахин боловсруулах'},
      description: {text: 'Дахин боловсруулах эсвэл төслийг цуцлах'},
      icon: {xlinkHref: BACK_ICON},
      ports: {
        items: [
          {
            group: 'in'
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Цуцалсан"}}
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Дахин боловсруулсан"}}
          }

        ],

      },
      subject: {
        object_type: "RE_CREATE",
        subject_type: "CREATOR",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false
      },
    },
  },
  {
    name: 'Message',
    attrs: {
      label: {text: 'Шүүгчид хуваарилах'},
      description: {text: 'Дарааллын дагуу автоматаар'},
      icon: {xlinkHref: SEND_TO_DOC_ICON},
      ports: {
        items: [
          {
            group: 'in'
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Хуваарилсан"}}
          }
        ]
      },
      subject: {
        object_type: "ASSIGN",
        subject_type: "TO_ROLE",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false
      },
    },
  },
  {
    name: 'Message',
    attrs: {
      label: {text: 'Шүүх хуралдааны тов гаргах'},
      description: {text: 'Шүүгчийн заавраар шүүгчийн туслах тов гаргах, хэргийн оролцогчдод /Улсын яллагч, Сэжигтэн, яллагдагчийн өмгөөлөгч/ мэдэгдэх.'},
      icon: {xlinkHref: VOTE_ICON},
      ports: {
        items: [
          {
            group: 'in'
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Мэдэгдэх"}}
          }
        ]
      },
      subject: {
        object_type: "DATE",
        subject_type: "TO_ROLE",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false
      },
    },
  },
  {
    name: 'Message',
    attrs: {
      label: {text: 'Шүүх хуралдаан'},
      description: {text: '24-н цагийн дотор шүүх прокурорын саналыг хянан хэлэлцэх'},
      icon: {xlinkHref: BANK_ICON},
      ports: {
        items: [
          {
            group: 'in'
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Зөвшөөрөх"}}
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Татгалзах"}}
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Хойшлуулах"}}
          }
        ]
      },
      subject: {
        object_type: "COURT",
        subject_type: "TO_ROLE",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false
      },
    },
  },
  {
    name: 'Message',
    attrs: {
      label: {text: 'Шүүх хуралдааны тэмдэглэл баталгаажуулах'},
      description: {text: 'ШХНБичгийн тэмдэглэлийг шүүгч баталгаажуулах'},
      icon: {xlinkHref: SEEN_ICON},
      ports: {
        items: [
          {
            group: 'in'
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Баталгаажуулах"}}
          }
        ]
      },
      subject: {
        object_type: "DETAIN",
        subject_type: "TO_ROLE",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false
      },
    },
  },
  {
    name: 'FlowchartEnd',
    attrs: {
      subject: {
        object_type: "END",
        subject_type: "CURRENT",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false
      },
    }
  },
  {
    name: 'FlowchartCancel',
    attrs: {
      subject: {
        object_type: "CANCEL",
        subject_type: "CURRENT",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false
      },
    }
  },
  {
    name: 'FlowchartPostpone',
    attrs: {
      subject: {
        object_type: "POSTPONE",
        subject_type: "CURRENT",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false
      },
    }
  }]
};
