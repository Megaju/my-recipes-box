import React from 'react'
import AddRecipe from './AddRecipe'
import base from '../base'

class Admin extends React.Component
{

  state = {
    uid: null,
    owner: null
  }

  componentDidMount() {
    base.onAuth(user => {
      if (user) {
        this.connectionProccess(null, {user})
      }
    })
  }

  treatChange = (event, key) => {
    const recipe = this.props.recipes[key]
    const updateRecipe = {
      ...recipe,
      [event.target.name]: event.target.value
    }
    this.props.updateRecipe(key, updateRecipe)
  }

  connexion = provider => {
    base.authWithOAuthPopup(provider, this.connectionProccess)
  }

  deconnexion = () => {
    base.unauth()
    this.setState({uid: null})
  }

  connectionProccess = (err, authData) => {
    if (err) {
      console.log(err)
      return
    }

    // Récupérer le nom de la boîte
    const boxRef = base.database().ref(this.props.pseudo)

    // Demander à Firebase les données
    boxRef.once('value', snapshot => {
      const data = snapshot.val() || {}

      // Attribuer à la box si elle n'est à personne
      if (!data.owner) {
        boxRef.set({
          owner: authData.user.uid
        })
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      })
    })
  }

  renderLogin = () => {
    return(
      <div className="login">
        <h2>Connecte toi pour créer tes propres recettes !</h2>
        <button className="facebook-button" onClick={() => this.connexion('facebook')}>
          Me connecter avec Facebook
        </button>
      </div>
    )
  }

  renderAdmin = key => {
    const recipe = this.props.recipes[key]
    return (
      <div className="card" key={key}>
				<form className="admin-form">

					<input name="name" type="text" placeholder="Nom de la recette"
            value={recipe.name} onChange={e => this.treatChange(e, key)} />

          <input name="image" type="text" placeholder="Adresse de l'image"
            value={recipe.image} onChange={e => this.treatChange(e, key)} />

          <textarea name="ingredients" rows="3" placeholder="Liste des ingrédients séparés par une virgule"
            value={recipe.ingredients} onChange={e => this.treatChange(e, key)} ></textarea>

          <textarea name="instructions" rows="15" placeholder="Liste des instructions (une par ligne)"
            value={recipe.instructions} onChange={e => this.treatChange(e, key)} ></textarea>

				</form>
        <button onClick={() => this.props.deleteRecipe(key)}>
          Supprimer
        </button>
			</div>
    )
  }

  render() {

    const deconnexion = <button onClick={this.deconnexion}>Se déconnecter</button>

    // Si il existe un propriétaire
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    // Est-ce le propriétaire
    if (this.state.uid !== this.state.owner) {
      return (
        <div className="login">
          {this.renderLogin()}
          <p>Vous n'êtes pas le propriétaire de cette boîte à recette.</p>
        </div>
      )
    }

    const adminCards = Object
      .keys(this.props.recipes)
      .map(this.renderAdmin)

    return(
      <div className="cards">
        <AddRecipe addRecipe={this.props.addRecipe} />
        {adminCards}
        <footer>
          <button onClick={this.props.loadRecipesExample}>
            Remplir
          </button>
          {deconnexion}
        </footer>
      </div>
    )
  }

  static propTypes = {
    recipes: React.PropTypes.object.isRequired,
    pseudo: React.PropTypes.string.isRequired,
    loadRecipesExample: React.PropTypes.func.isRequired,
    addRecipe: React.PropTypes.func.isRequired,
    updateRecipe: React.PropTypes.func.isRequired,
    deleteRecipe: React.PropTypes.func.isRequired
  }
}

export default Admin
