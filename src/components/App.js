// React
import React from 'react'
import Header from './Header'
import Admin from './Admin'
import Card from './Card'
// Load recipes
import recipes from '../recipes'
// Firebase
import base from '../base'


class App extends React.Component {

	// States
	state = {
		recipes: {}
	}

	// Life cycle
	componentWillMount() {
		this.ref = base.syncState(`${this.props.params.pseudo}/recipes`, {
			context: this,
			state: 'recipes'
		})
	}

	componentWillUnount() {
		base.removeBinding(this.ref)
	}

	// Functions
	loadRecipesExample = () => {
		this.setState({ recipes })
	}

	addRecipe = (recipe) => {
		const recipes = {...this.state.recipes}
		const timestamp = Date.now()
		recipes[`recipe-${timestamp}`] = recipe
		this.setState({recipes})
	}

	updateRecipe = (key, updateRecipe) => {
		const recipes = {...this.state.recipes}
		recipes[key] = updateRecipe
		this.setState({recipes})
	}

	deleteRecipe = key => {
		const recipes = {...this.state.recipes}
		recipes[key] =  null
		this.setState({recipes})
	}

	// Render
	render() {
		// forEach
		const cards = Object
			.keys(this.state.recipes)
			.map(key => <Card key={key} details={this.state.recipes[key]} />)

		return (
			<div className="box">
				<Header pseudo={this.props.params.pseudo} />
				<div className="cards">
					{cards}
				</div>
				<Admin
					recipes={this.state.recipes}
					loadRecipesExample={this.loadRecipesExample}
					addRecipe={this.addRecipe}
					updateRecipe={this.updateRecipe}
					deleteRecipe={this.deleteRecipe}
					pseudo={this.props.params.pseudo}
				/>
			</div>
		)
	}

	static propTypes = {
	  params: React.PropTypes.object.isRequired
	};
}

export default App;