import React from 'react';

import TodoForm from './components/TodoComponents/TodoForm';
import TodoList from './components/TodoComponents/TodoList';

import './App.scss';

class App extends React.Component {

  constructor() {

    super();

    let todoList = [];

    if (localStorage.todoCount) {

      for (let i = 0; i < localStorage.todoCount; i++) {

        todoList.push(JSON.parse(localStorage[`todo${i}`]));

      }

    }

    this.state = {

      todoItems: todoList,
      formInput: '',
      searchInput: '',
      filteredItems: todoList

    }

    this.btnClick = this.btnClick.bind(this);
    this.formEntry = this.formEntry.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);

  }

  createTodoItem(task) {

    return {

      task: task,
      id: Date.now(),
      completed: false

    }

  }

  saveToStorage() {

    localStorage.todoCount = this.state.todoItems.length;

    for (let i = 0; i < this.state.todoItems.length; i++) {

      localStorage[`todo${i}`] = JSON.stringify(this.state.todoItems[i]);

    }

  }

  btnClick(e) {

    e.preventDefault();

    if (e.target.name === 'submitButton') {

      const newItems = [...this.state.todoItems, this.createTodoItem(this.state.formInput)];

      this.setState({
        todoItems: newItems,
        formInput: ''
      }, () => {
        this.saveToStorage();
        this.filterItems();
      });

    }

    else if (e.target.name === "clearButton"){

      this.setState({

        todoItems: this.state.todoItems.filter(item => !item.completed),
        formInput: '',
        filteredItems: []

      }, () => {
        localStorage.clear();
        this.saveToStorage();
        this.filterItems();
      });

    }

  }

  formEntry(e) {

    const name = e.target.name;

    this.setState({

      [e.target.name]: e.target.value

    }, () => {

      if (name === "searchInput") {

        this.filterItems();

      }

    });

  }

  filterItems() {

    this.setState({
      filteredItems: this.state.todoItems.filter(item => item.task.toUpperCase().includes(this.state.searchInput.toUpperCase()))
    });

  }

  toggleCompleted(id) {

    this.setState({

      todoItems: this.state.todoItems.map(item => {
        if (item.id === id)
          item.completed = !item.completed;
        return item;
      })

    }, this.saveToStorage);

  }

  render() {
    return (
      <div className='todo-container'>
        <h1>React Todo App</h1>
        <TodoForm entryHandler={this.formEntry} btnHandler={this.btnClick} formInput={this.state.formInput} searchInput={this.state.searchInput}/>
        <TodoList list={this.state.filteredItems} clickHandler={this.toggleCompleted}/>
      </div>
    );
  }
}

export default App;
