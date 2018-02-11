import React from 'react'
import AddRecipe from './AddRecipe'
import base from '../base'
import ImageUploader from 'react-firebase-image-uploader'

class Admin extends React.Component
{

  state = {
    uid: null,
    owner: null,
    isUploading: false,
    progress: 0,
    imageURL: ''
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
    const newImage = this.state.imageURL === '' ? recipe.image : this.state.imageURL

    const imageToDelete = recipe.image
    const imageToDeleteA = imageToDelete.split('images%')
    const imageToDeleteB = imageToDeleteA[1].split('%')
    const imageToDeleteC = imageToDeleteB[1].split('?alt')
    const finalImage = 'images/' + this.props.pseudo + '/' + imageToDeleteC[0].substr(2)

    var storage = base.storage()
    var storageRef = storage.ref()
    var imageRef = storageRef.child(finalImage)

    imageRef.delete().then(function() {

    }).catch(function(error) {
      console.log(error)
    })

    const updateRecipe = {
      ...recipe,
      [event.target.name]: event.target.value,
      image: newImage,
    }
    this.props.updateRecipe(key, updateRecipe)
    this.setState({imageURL: ''})
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

  // Functions Image Uploading
	handleUploadStart = () => this.setState({isUploading: true, progress: 0})

	handleProgress = (progress) => this.setState({progress})

  handleUploadError = (error) => {
    this.setState({isUploading: false})
    console.error(error)
  }

  handleUploadSuccess = (filename) => {
    this.setState({image: filename, progress: 100, isUploading: false})
    let dirAndFilename = this.props.pseudo + '/' + filename
    base.storage().ref('images').child(dirAndFilename).getDownloadURL().then(url => this.setState({imageURL: url}))
  }

  deleteImage = () => {
    this.setState({imageURL: ''})
  }

  deleteImageOnServer = (event, key) => {
    const recipe = this.props.recipes[key]
    const imageToDelete = recipe.image
    const imageToDeleteA = imageToDelete.split('images%')
    const imageToDeleteB = imageToDeleteA[1].split('%')
    const imageToDeleteC = imageToDeleteB[1].split('?alt')
    const finalImage = 'images/' + this.props.pseudo + '/' + imageToDeleteC[0].substr(2)

    var storage = base.storage()
    var storageRef = storage.ref()
    var imageRef = storageRef.child(finalImage)

    imageRef.delete().then(function() {
      alert('L\'image a bien été supprimé du serveur. Il se peut qu\'elle apparaise encore à cause de votre cache.')
    }).catch(function(error) {
      console.log(error)
      alert('Ho hooo une erreur est survenue !')
    })
  }

  renderAdmin = key => {
    const recipe = this.props.recipes[key]
    return (
      <div className="card" key={key}>
				<form className="admin-form">

					<input name="name" type="text" placeholder="Nom de la recette"
            value={recipe.name} onChange={e => this.treatChange(e, key)} />

          {this.state.isUploading &&
            <p>Progress: {this.state.progress}</p>
          }
          {recipe.image &&
            <div>
              <label>Image actuelle</label>
              <div className="image">
                <img src={recipe.image} role="presentation" />
              </div>
              <label className="imageDelete" htmlFor="validateImage">
                Supprimer
                <input type="checkbox" name="deleteImage" onClick={e => this.deleteImageOnServer(e, key)}></input>
              </label>
            </div>
          }
          {this.state.imageURL &&
            <div>
              <label>Nouvelle image</label>
              <div className="image">
                <img src={this.state.imageURL} role="presentation" />
              </div>
              <label className="imageValidator" htmlFor="validateImage">
                Valider
                <input type="checkbox" name="validateImage" onClick={e => this.treatChange(e, key)}></input>
              </label>
              <label className="imageDelete" htmlFor="validateImage">
                Abandonner
                <input type="checkbox" name="deleteImage" onClick={this.deleteImage}></input>
              </label>
            </div>
          }

          <ImageUploader
            hidden
            name="image"
            accept="image/*"
            storageRef={base.storage().ref('images/'+this.props.pseudo+'/')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
            onChange={e => this.treatChange(e, key)}
            />

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
        <AddRecipe
          addRecipe={this.props.addRecipe}
          pseudo={this.props.pseudo}
          />
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
