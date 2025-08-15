// modules/workflow/flow/flow.js
export class Flow {
  constructor(data) {
    this.data = data;
    this.starts = [];
    this.ends = [];
    this.actions = [];
    this.triggers = [];
    this.edges = [];
    this.withVote = false;
    this.withEndVote = false;
    this.voteIndex = -1;
    this.initialize();
  }

  initialize() {
    if (!this.data || !this.data.nodes || !this.data.edges) {
      throw new Error("Invalid data");
    }

    this.data.nodes.forEach((node, index) => {
      switch (node.type) {
        case "start":
          this.starts.push(node);
          break;
        case "end":
          this.ends.push(node);
          break;
        case "action":
          this.actions.push(node);
          if (node.data.subject.object_type === "VOTE") {
            this.withVote = true;
            this.voteIndex = index;
          }
          if (node.data.subject.object_type === "END_VOTE") {
            this.withEndVote = true;
          }
          break;
        case "trigger":
          this.triggers.push(node);
          break;
        default:
          console.warn("Unknown node type: ", node.type);
      }
    });

    this.edges = this.data.edges;
  }

  getNodeById(id) {
    return this.data.nodes.find((node) => node.id === id);
  }

  getNodeIndex(id) {
    return this.data.nodes.findIndex((node) => node.id === id);
  }

  getNextSteps(node) {
    // For action nodes, find trigger nodes and their outgoing edges
    if (node.type === "action") {
      const triggerNodes = this.triggers.filter((t) => t.parentNode === node.id);
      const nextSteps = triggerNodes
        .map((trigger) => {
          const outgoingEdge = this.edges.find((edge) => edge.source === trigger.id);
          if (outgoingEdge) {
            const targetNode = this.getNodeById(outgoingEdge.target);
            if (targetNode) {
              return {
                ...targetNode,
                sourcePortLabel: trigger.data.label, // Trigger label as port label
                open: false,
              };
            }
          }
          return null;
        })
        .filter((step) => step !== null);
      return nextSteps;
    }

    // For start or end nodes, find direct outgoing edges
    const outgoingEdges = this.edges.filter((edge) => edge.source === node.id);
    const nextSteps = outgoingEdges
      .map((edge) => {
        const targetNode = this.getNodeById(edge.target);
        if (targetNode) {
          return {
            ...targetNode,
            sourcePortLabel: null, // No port label for non-action nodes
            open: false,
          };
        }
        return null;
      })
      .filter((step) => step !== null);

    return nextSteps;
  }
}
