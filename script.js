function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} //Define operators and their names
const commonButs = "0123456789+-*/.";
const labels = "zero,one,two,three,four,five,six,seven,eight,nine,add,subtract,multiply,divide,decimal";
const faButtons = [
{ id: "multiply", div: /*#__PURE__*/React.createElement("i", { class: "fas fa-times" }) },
{ id: "divide", div: /*#__PURE__*/React.createElement("i", { class: "fas fa-divide" }) },
{ id: "add", div: /*#__PURE__*/React.createElement("i", { class: "fas fa-plus" }) },
{ id: "subtract", div: /*#__PURE__*/React.createElement("i", { class: "fas fa-minus" }) }];

const toRender = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, faButtons[2].div, faButtons[3].div, faButtons[0].div, faButtons[1].div, "."];
//Turn into array for use
const commonArray = commonButs.split("");
const labelsArray = labels.split(",");
//Turn into list of objects for quick pairing
const buttonObjects = [];
for (let i = 0; i < commonArray.length; i++) {
  buttonObjects[i] = {
    value: commonArray[i],
    label: labelsArray[i],
    icon: toRender[i] };

}
//For input filtering:
const operators = ["*", "/", "+"];
const defaultState = {
  equation: '', display: '0', input: '', decimal: false, justCalculated: false };

class Calculator extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "input",
    value => {
      //console.log("Input called with value "+value);
      if (value === ".") {
        this.updateMaths("decimal", value);
      } else if (value === "0") {
        if (this.state.display !== "0") {
          this.updateMaths("type", value);
        }
      } else if (value === "-") {
        this.updateMaths("negate", value);
      } else if (operators.includes(value)) {
        if (!$.isNumeric(this.state.display)) {
          this.updateMaths("change", value);
        } else {
          this.updateMaths("push", value);
        }
      } else {
        this.updateMaths("type", value);
      }
    });this.state = defaultState;this.clear = this.clear.bind(this);this.clearEntry = this.clearEntry.bind(this);this.getRoot = this.getRoot.bind(this);this.percent = this.percent.bind(this);this.plusMinus = this.plusMinus.bind(this);this.undo = this.undo.bind(this);this.input = this.input.bind(this);this.updateMaths = this.updateMaths.bind(this);this.calculate = this.calculate.bind(this);}updateMaths(action, x) {if (this.state.justCalculated === true) {if (action === "type" || action === "decimal") {this.setState({ equation: '', display: x, input: x, justCalculated: false });} else {this.setState(prevstate => ({ equation: prevstate.display + x, display: x, input: x, justCalculated: false }));}} else {if (action === "type") {if (this.state.display === "0" || operators.includes(this.state.input) || !$.isNumeric(this.state.display) && this.state.display !== "-") {this.setState({ display: x, input: x });} else if (this.state.display === "-") {if (this.state.input === "-") {this.setState({ display: x, input: x });} else if (this.state.input === 'negated') {this.setState({ display: "-" + x, input: x });}} else {this.setState(prevstate => ({ display: prevstate.display + x, input: x }));}} else if (action === "decimal") {if (!this.state.display.includes(".") && $.isNumeric(this.state.display)) {this.setState(prevstate => ({ input: x, display: prevstate.display + x }));}} else if (action === "negate") {if (operators.includes(this.state.input)) {this.setState(prevstate => ({ display: x, input: 'negated' }));} else if (this.state.display === "0") {this.setState({ display: x, input: x });} else if (this.state.display[this.state.display.length - 1] === "-" && this.state.input === "-") {this.setState({ input: 'negated' });} else {this.updateMaths("push", x);}} else if (action === "push") {if ($.isNumeric(this.state.display)) {this.setState(prevstate => ({ equation: prevstate.equation + this.checkNeg(prevstate.display) + x, input: x, display: x }));}} else if (action === "change") {this.setState(prevstate => ({ equation: prevstate.equation.slice(0, -1) + x, input: x, display: x }));};}}

  clear() {
    this.setState(defaultState);
  }

  clearEntry() {
    this.setState({
      input: '',
      display: '0' });

  }

  plusMinus() {
    if ($.isNumeric(this.state.display)) {
      if (this.state.display[0] === "-") {
        let posNum = this.state.display.slice(1);
        this.setState({ display: posNum });
      } else {
        let negNum = "-" + this.state.display;
        this.setState({ display: negNum });
      }
    }
  }

  getRoot() {
    if ($.isNumeric(this.state.display)) {
      if (Number(this.state.display) >= 0) {
        let x = Math.sqrt(Number(this.state.display)).toFixed(7);
        this.setState(prevstate => ({
          input: '',
          display: x,
          equation: "√" + prevstate.display + "=" + x,
          justCalculated: true }));

      } else {
        this.setState({
          input: '',
          equation: '',
          display: 'Invalid' });

      }
    }
  }

  percent() {
    if ($.isNumeric(this.state.display)) {
      let percentage = parseFloat((this.state.display / 100).toFixed(7));
      this.setState(prevstate => ({
        input: '',
        display: percentage,
        equation: prevstate.display + "%=" + percentage,
        justCalculated: true }));

    }
  }

  undo() {
    if ($.isNumeric(this.state.display)) {
      if (this.state.display.length > 1) {
        this.setState(prevstate => ({
          input: prevstate.display[prevstate.display.length - 1],
          display: prevstate.display.slice(0, -1) }));

      } else {
        this.setState({
          input: '0',
          display: '0' });

      }
    }
  }

  checkNeg(x) {
    if (x[0] === "-") {
      return "(" + x + ")";
    } else {return x;}
  }

  calculate() {
    if (!operators.includes(this.state.input)) {
      let completeEquation = this.state.equation + this.checkNeg(this.state.display);
      let result = parseFloat(eval(completeEquation).toFixed(7));
      this.setState({
        equation: completeEquation + "=" + result,
        display: result,
        input: result,
        justCalculated: true });

    }
  }

  render() {
    const allOtherButtons = buttonObjects.map(
    i => /*#__PURE__*/React.createElement("button", { class: "numpad-button", id: i.label, onClick: () => this.input(i.value) }, i.icon));


    return /*#__PURE__*/(
      React.createElement("div", { id: "calculator" }, /*#__PURE__*/
      React.createElement("div", { class: "number-display equation", id: "equation" }, this.state.equation), /*#__PURE__*/
      React.createElement("div", { class: "number-display display", id: "display" }, this.state.display), /*#__PURE__*/
      React.createElement("div", { class: "numpad", id: "numpad" }, /*#__PURE__*/
      React.createElement("button", { class: "numpad-button", id: "clear", onClick: this.clear }, "C"), /*#__PURE__*/
      React.createElement("button", { class: "numpad-button", id: "clear-entry", onClick: this.clearEntry }, "CE"), /*#__PURE__*/
      React.createElement("button", { class: "numpad-button", id: "undo", onClick: this.undo }, /*#__PURE__*/React.createElement("i", { class: "fa fa-delete-left" })), /*#__PURE__*/
      React.createElement("button", { class: "numpad-button", id: "percent", onClick: this.percent }, /*#__PURE__*/React.createElement("i", { class: "fa fa-percent" })), /*#__PURE__*/
      React.createElement("button", { class: "numpad-button", id: "plus-minus", onClick: this.plusMinus }, /*#__PURE__*/React.createElement("i", { class: "fa-solid fa-plus-minus" })), /*#__PURE__*/
      React.createElement("button", { class: "numpad-button", id: "sqrt", onClick: this.getRoot }, /*#__PURE__*/React.createElement("i", { class: "fas fa-square-root-alt" })), /*#__PURE__*/
      React.createElement("button", { class: "numpad-button", id: "equals", onClick: this.calculate }, /*#__PURE__*/React.createElement("i", { class: "fas fa-equals" }), /*#__PURE__*/React.createElement("span", { class: "hidden" }, "=")),
      allOtherButtons)));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(Calculator, null), document.getElementById("container"));