import React from 'react'

class Card extends React.Component
{
  render() {

    const ingredients = this.props.details.ingredients
      .split(',')
      .map((item, key) => <li key={key}>{item}</li>)

    const instructions = this.props.details.instructions
      .split('\n')
      .map((item, key) => <li key={key}>{item}</li>)

    return(
      <div className="card">
        <div className="image">
          <img src={this.props.details.image} alt={this.props.details.name} />
        </div>
        <div className="recipe">
          <h2>{this.props.details.name}</h2>
          <ul className="list-ingredients">
            {ingredients}
          </ul>
          <ol className="list-instructions">
            {instructions}
          </ol>
        </div>
      </div>
    )
  }

  static propTypes = {
    details: React.PropTypes.object.isRequired
  }
}

export default Card
