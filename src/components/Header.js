import React from 'react'

class Header extends React.Component
{

  convertPseudo = (pseudo) => {
    /* regex avec React. le /i signifie qu'il regarde
    * si c'est en majucule ou minuscule.
    * pseudo[0], parcequ'on va tester uniquement la 1er lettre du pseudo.
    */
    return /[aeiouy]/i.test(pseudo[0]) ? `d'${pseudo}` : `de ${pseudo}`
  }

  render() {
    return(
      <header>
        <h1>La boîte à recette {this.convertPseudo(this.props.pseudo)}</h1>
      </header>
    )
  }

  static propTypes = {
    pseudo: React.PropTypes.string.isRequired
  }
}

export default Header
