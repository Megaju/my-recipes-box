import React from 'react'

class AddRecipe extends React.Component
{

  addRecipe = event => {
    event.preventDefault()
    const recipe = {
      name: this.name.value,
      image: this.image.value,
      ingredients: this.ingredients.value,
      instructions: this.instructions.value
    }
    this.props.addRecipe(recipe)
    this.recipeForm.reset()
  }

  render() {
    return(
      <div className="card" >
				<form className="admin-form ajouter-recette"
					ref={input => this.recipeForm = input}
					onSubmit={(e) => this.addRecipe(e)}
				>

					<input ref={input => this.name = input} type="text" placeholder="Nom de la recette" />

					<input ref={input => this.image = input} type="text" placeholder="Adresse de l'image" />

					<textarea ref={input => this.ingredients = input} rows="3" placeholder="Liste des ingrédients séparés par une virgule" ></textarea>

					<textarea ref={input => this.instructions = input} rows="15" placeholder="Liste des instructions (une par ligne)" ></textarea>

					<button type="submit">+ Ajouter une recette</button>
				</form>
			</div>
    )
  }

  static propTypes = {
    addRecipe: React.PropTypes.func.isRequired
  }
}

export default AddRecipe
