import React from 'react'

class Menu extends React.Component
{
  render() {
    return(
      <nav className="menu">
        <ul>
          <li className="view" onClick={this.props.showUserPanel}></li>
          <li className="edit" onClick={this.props.showAdminPanel}></li>
        </ul>
      </nav>
    )
  }

  static propTypes = {
    showUserPanel: React.PropTypes.func.isRequired,
    showAdminPanel: React.PropTypes.func.isRequired
  }
}

export default Menu
