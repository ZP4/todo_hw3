import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';

class ListScreen extends Component {
    state = {
        name: '',
        owner: '',
    };

    handleChange = (e) => {
        const { target } = e;
        const firestore = this.props.firestore;
        console.log(target.id);
        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
        firestore.collection('todoLists').doc(this.props.todoList.id).update({
            [target.id]: target.value
        })

    };

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        //console.log(this.props.match.url);
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container white">
                <h3 className="grey-text text-darken-3">Todo List</h3>
                <div className="input-field">
                    <label htmlFor="email" className="active">Name</label>
                    <input className="active" type="text" name="name" id="name" onChange={this.handleChange} value={todoList.name} />
                </div>
                <div className="input-field">
                    <label htmlFor="password" className="active">Owner</label>
                    <input className="active" type="text" name="owner" id="owner" onChange={this.handleChange} value={todoList.owner} />
                </div>
                <ItemsList todoList={todoList} listId={this.props.id} />
            </div>

        );
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log("aasd "+ownProps.match.params.toString());
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  todoList.id = id;
  return {
    todoList,
    auth: state.firebase.auth,
    firestore: state.firestore
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ListScreen);