import React from 'react'

import base from '../base'
import ImageUploader from 'react-firebase-image-uploader'

class AddRecipe extends React.Component
{

  // States
	state = {
		isUploading: false,
    progress: 0,
    imageURL: ''
	}

  addRecipe = event => {
    event.preventDefault()
    const recipe = {
      name: this.name.value,
      image: this.state.imageURL,
      ingredients: this.ingredients.value,
      instructions: this.instructions.value
    }
    this.props.addRecipe(recipe)
    this.recipeForm.reset()
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

  render() {
    return(
      <div className="card" >
				<form className="admin-form ajouter-recette"
					ref={input => this.recipeForm = input}
					onSubmit={(e) => this.addRecipe(e)}
				>

					<input ref={input => this.name = input} type="text" placeholder="Nom de la recette" />

          {this.state.isUploading &&
            <p>Progress: {this.state.progress}</p>
          }
          {this.state.imageURL &&
            <img src={this.state.imageURL} role="presentation" />
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
            />

					<textarea ref={input => this.ingredients = input} rows="3" placeholder="Liste des ingrédients séparés par une virgule" ></textarea>

					<textarea ref={input => this.instructions = input} rows="15" placeholder="Liste des instructions (une par ligne)" ></textarea>

					<button type="submit">+ Ajouter une recette</button>
				</form>
			</div>
    )
  }

  static propTypes = {
    addRecipe: React.PropTypes.func.isRequired,
		pseudo: React.PropTypes.string.isRequired
  }
}

export default AddRecipe
