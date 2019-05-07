import React from "react";
import { Form, Button, InputGroup, Col, Modal } from "react-bootstrap";

import "./App.css";
import Menu from "../components/Menu";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ageRanges: [],
      alertModalTitle: "",
      alertModalMessage: "",
      currentItem: "",
      formValidated: false,
      showAlertModal: false
    };

    this.handleChangeMenuItem = this.handleChangeMenuItem.bind(this);
    this.toggleModalAlert = this.toggleModalAlert.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.resetFormToInitialState = this.resetFormToInitialState.bind(this);
    this.sendFormDataToService = this.sendFormDataToService.bind(this);
  }

  componentWillMount() {
    let ageRangeVar = [];

    for (let i = 18; i <= 100; i++) {
      ageRangeVar.push(i);
    }

    this.setState({
      ageRanges: ageRangeVar
    });
  }

  handleChangeMenuItem(newItem) {
    this.setState({
      currentItem: newItem
    });
  }

  sendFormDataToService(formValue) {
    const formElements = formValue.elements;

    const formValues = {
      item: this.state.currentItem,
      name: formElements.namedItem("formName").value,
      email: formElements.namedItem("formEmail").value,
      phone: formElements.namedItem("formPhone").value,
      ageRange: formElements.namedItem("formAge").value
    };

    fetch("http://localhost:8000/mi-servicio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues)
    })
      .then(result => {
        this.toggleModalAlert(
          true,
          "Confirmación",
          "Tu información fue enviada con éxito, estaremos en contacto contigo",
          formValue
        );
      })
      .catch(error => {
        console.log("Form sent", error, this);
        this.toggleModalAlert(
          true,
          "Ops!",
          `Sucedió un error al enviar tus datos, ${error}`
        );
      });
  }

  toggleModalAlert(newState, title, message, formReference) {
    this.setState({
      showAlertModal: newState,
      alertModalTitle: newState ? title : "",
      alertModalMessage: newState ? message : ""
    });

    if (newState) {
      setTimeout(() => {
        this.toggleModalAlert(false);
        if (formReference) {
          this.resetFormToInitialState(formReference);
        }
      }, 5000);
    }
  }

  resetFormToInitialState(formReference) {
    formReference.reset();
    this.setState({
      alertModalTitle: "",
      alertModalMessage: "",
      currentItem: "",
      formValidated: false
    });
  }

  handleSubmitForm(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      this.sendFormDataToService(form);
    }

    this.setState({ formValidated: true });
  }

  render() {
    const {
      currentItem,
      ageRanges,
      formValidated,
      showAlertModal,
      alertModalTitle,
      alertModalMessage
    } = this.state;

    return (
      <div className="app">
        <header className="app-header">
          <p>BlackSip - Prueba técnica Front End</p>
        </header>

        {currentItem ? (
          <p>Puedes cambiar tu selección presionando otra opción:</p>
        ) : (
          <p>Por favor selecciona un elemento antes de continuar:</p>
        )}

        <Menu onSelectNewItem={this.handleChangeMenuItem} />

        {currentItem ? (
          <>
            <div className="form-container">
              <p>
                Hola, bienvenido, sabemos que quieres viajar en un {currentItem}
              </p>

              <Form
                noValidate
                validated={formValidated}
                onSubmit={this.handleSubmitForm}
              >
                <Form.Row>
                  <Form.Group as={Col} controlId="formName" sm>
                    <Form.Label>Nombre completo</Form.Label>

                    <Form.Control type="text" placeholder="John Doe" required />

                    <Form.Control.Feedback type="invalid">
                      Por favor escribe un nombre válido
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formEmail" sm>
                    <Form.Label>Email</Form.Label>

                    <Form.Control
                      type="email"
                      placeholder="johndoe@example.com"
                      required
                    />

                    <Form.Control.Feedback type="invalid">
                      Por favor escribe un email válido
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formPhone" sm>
                    <Form.Label>Celular</Form.Label>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputPhonePrepend">
                          +57
                        </InputGroup.Text>
                      </InputGroup.Prepend>

                      <Form.Control
                        type="phone"
                        placeholder="3001234567"
                        aria-describedby="inputPhonePrepend"
                        minLength={10}
                        required
                      />

                      <Form.Control.Feedback type="invalid">
                        Por favor escribe un número de télefono, minimo 10
                        digitos
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formAge" sm>
                    <Form.Label>Rango de edad</Form.Label>

                    <Form.Control as="select" required>
                      {ageRanges.map(range => (
                        <option key={range}>{range}</option>
                      ))}
                    </Form.Control>

                    <Form.Control.Feedback type="invalid">
                      Por favor elige un rango de edad
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Button variant="success" type="submit">
                  Enviar formulario
                </Button>
              </Form>
            </div>

            <Modal show={showAlertModal} centered>
              <Modal.Header>
                <Modal.Title>{alertModalTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>{alertModalMessage}</Modal.Body>
            </Modal>
          </>
        ) : null}
      </div>
    );
  }
}

export default App;
