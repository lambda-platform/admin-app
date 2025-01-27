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
        is_signature_needed: false,
        is_subject_changeable: false
      },
    }
  },
  {
    name: 'Message',
    attrs: {
      label: {text: 'Хянах'},
      description: {text: 'Хянах шат'},
      icon: {xlinkHref: CONFIRMATION_ICON},
      ports: {
        items: [
          {
            group: 'in'
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Хянасан"}}
          },
          {
            group: 'out',
            attrs: {portLabel: {text: "Буцаасан"}}
          }
        ]
      },
      subject: {
        object_type: "CHECK",
        subject_type: "TO_ROLE",
        role_id: null,
        user_id: null,
        is_read_only: false,
        is_signature_needed: false,
        is_subject_changeable: false
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
        is_signature_needed: false,
        is_subject_changeable: false
      },
    },
  },
    {
      name: 'Message',
      attrs: {
        label: {text: 'Саналын хуудас бэлтгэх'},
        description: {text: 'Саналын хуудас бэлтгэх, санал өгөх албан тушаалтан сонгох'},
        icon: {xlinkHref: VOTE_ICON},
        ports: {
          items: [
            {
              group: 'in'
            },
            {
              group: 'out',
              attrs: {portLabel: {text: "Саналын хуудас бэлтгэсэн"}}
            }
          ]
        },
        subject: {
          object_type: "PREPARE_VOTE",
          subject_type: "CREATOR",
          struct_id: null,
          emp_id: null,
          is_read_only:true,
          is_signature_needed:false,
          is_subject_changeable:false
        },
      }
    }, {
      name: 'Message',
      attrs: {
        label: {text: 'Шийдвэрлэх, цохох'},
        description: {text: 'Шийдвэрлэх, Холбогдох хүмүүст цохох'},
        icon: {xlinkHref: SEND_TO_DOC_ICON},
        ports: {
          items: [
            {
              group: 'in'
            },
            {
              group: 'out',
              attrs: {portLabel: {text: "Холбогдох хүмүүст цохсон"}}
            },
            {
              group: 'out',
              attrs: {portLabel: {text: "Шийдвэрлэсэн"}}
            }
          ]
        },
        subject: {
          object_type: "TRANSFER",
          subject_type: "CREATOR",
          struct_id: null,
          emp_id: null,
          is_read_only:true,
          is_signature_needed:false,
          is_subject_changeable:false,
        },
      },
    }, {
      name: 'Message',
      attrs: {
        label: {text: 'Шийдвэрлэх, цохох 2'},
        description: {text: 'Шийдвэрлэх, Холбогдох хүмүүст цохох'},
        icon: {xlinkHref: SEND_TO_DOC_ICON},
        ports: {
          items: [
            {
              group: 'in'
            },
            {
              group: 'out',
              attrs: {portLabel: {text: "Холбогдох хүмүүст цохсон"}}
            },
            {
              group: 'out',
              attrs: {portLabel: {text: "Шийдвэрлэсэн"}}
            }
          ]
        },
        subject: {
          object_type: "TRANSFER",
          subject_type: "ANY_EMP",
          struct_id: null,
          emp_id: null,
          is_read_only:true,
          is_signature_needed:false,
          is_subject_changeable:false,
        },
      },
    }, {
      name: 'Message',
      attrs: {
        label: {text: 'Хүлээлгэн өгөх'},
        description: {text: 'Ажилтнуудад өгөх'},
        icon: {xlinkHref: SEND_TO_DOC_ICON},
        ports: {
          items: [
            {
              group: 'in'
            },
            {
              group: 'out',
              attrs: {portLabel: {text: "Ажилтнуудад өгсөн"}}
            }
          ]
        },
        subject: {
          object_type: "GIVE",
          subject_type: "CREATOR",
          struct_id: null,
          emp_id: null,
          is_read_only:true,
          is_signature_needed:false,
          is_subject_changeable:false,
        },
      },
    }, {
      name: 'Message',
      attrs: {
        label: {text: 'Хүлээн авах'},
        description: {text: 'Хүлээн авах'},
        icon: {xlinkHref: SEND_TO_DOC_ICON},
        ports: {
          items: [
            {
              group: 'in'
            },
            {
              group: 'out',
              attrs: {portLabel: {text: "Хүлээн авсан"}}
            }
          ]
        },
        subject: {
          object_type: "RECEIVE",
          subject_type: "DIRECT",
          struct_id: null,
          emp_id: null,
          is_read_only:true,
          is_signature_needed:false,
          is_subject_changeable:false,
        },
      },
    },{
      name: 'Message',
      attrs: {
        label: {text: 'Санал авах'},
        description: {text: 'Санал авах хуудасны дагуу санал авах'},
        icon: {xlinkHref: VOTE_ICON},
        ports: {
          items: [
            {
              group: 'in'
            },
            {
              group: 'out',
              attrs: {portLabel: {text: "Зөвшөөрнө"}}
            },
            {
              group: 'out',
              attrs: {portLabel: {text: "Зөвшөөрөхгүй"}}
            }
          ]
        },
        subject: {
          object_type: "VOTE",
          subject_type: "VOTERS",
          struct_id: null,
          emp_id: null,
          is_read_only:true,
          is_signature_needed:true,
          is_subject_changeable:false
        },
      }
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
        is_signature_needed: false,
        is_subject_changeable: false
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
        is_signature_needed: false,
        is_subject_changeable: false
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
        is_signature_needed: false,
        is_subject_changeable: false
      },
    }
  }]
};
