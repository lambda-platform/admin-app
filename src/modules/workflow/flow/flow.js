export class Flow {
  constructor(data) {
    this.data = data;
    this.starts = [];
    this.ends = [];
    this.cancels = [];
    this.steps = [];
    this.links = [];
    this.cells = [];
    this.ports = [];
    this.withVote = false;
    this.voteIndex = -1;
    this.initialize();

  }

  initialize() {
    if (!this.data || !Array.isArray(this.data.cells)) {
      throw new Error("Invalid data");
    }
    this.data.cells.forEach((cell, index) => {

      if (cell.ports && cell.ports.items && cell.ports.items.length >= 1) {
        this.ports = [...this.ports, ...cell.ports.items];
      }
      switch (cell.type) {
        case "app.FlowchartStart":
          this.starts.push(cell);
          break;
        case "app.FlowchartEnd":
          this.ends.push(cell);
          break;
        case "app.FlowchartCancel":
          this.cancels.push(cell);
          break;
        case "app.FlowchartPostpone":
          this.cancels.push(cell);
          break;
        case "app.Message":
          this.steps.push(cell);
          if (cell.attrs.subject.object_type === "VOTE") {
            this.withVote = true;
            this.voteIndex = index;
          }
          break;
        case "app.Link":
          this.links.push(cell);
          break;
        default:
          console.warn("Unknown type: ", cell.type);
      }
    });
  }


  getCellById(id) {
    return this.data.cells.find(cell => cell.id === id);
  }

  getCellIndex(id) {
    return this.data.cells.findIndex(cell => cell.id === id);
  }

  getPortById(id) {
    return this.ports.find(port => port.id === id);
  }

  getNextSteps(cell) {

    const outgoingLinks = this.links.filter(link => link.source.id === cell.id);

    const nextSteps = outgoingLinks.map(link => {
      let sourcePortLabel = null
      const port = this.getPortById(link.source.port);

      if (port && port.attrs && port.attrs.portLabel && port.attrs.portLabel.text) {
        sourcePortLabel = port.attrs.portLabel.text;
      }
      return {...this.getCellById(link.target.id), sourcePortLabel: sourcePortLabel, open: false}
    });

    return nextSteps;
  }

}
