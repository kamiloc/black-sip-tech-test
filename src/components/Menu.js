import React from "react";
import { Alert, Button } from "react-bootstrap";

import "./Menu.css";

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      selectedItem: null
    };

    this.onSelectItem = this.onSelectItem.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8000/mi-servicio")
      .then(res => res.json())
      .then(
        items => {
          this.setState({
            items,
            isLoaded: true
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  onSelectItem(itemId) {
    const selectedItem = this.state.items.find(item => item.id === itemId);

    this.setState({ selectedItem });
    this.props.onSelectNewItem(selectedItem.name);
  }

  render() {
    const { error, isLoaded, items } = this.state;

    if (error) {
      return <Alert variant="danger">Error: {error.message}</Alert>;
    } else if (!isLoaded) {
      return <Alert variant="primary">Loading items</Alert>;
    } else if (items) {
      return (
        <ul className="list-menu list-unstyled">
          {items.map(item => (
            <li key={item.id}>
              <Button onClick={e => this.onSelectItem(item.id)} block>
                {item.name}
              </Button>
            </li>
          ))}
        </ul>
      );
    } else {
      return <Alert variant="warning">No items to load</Alert>;
    }
  }
}

export default Menu;
