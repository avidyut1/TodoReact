import React, {Component} from 'react';
import '../style.css';
import uniqueId, {setId, getId} from "./uniqueId";

class TodoList extends Component {
    constructor(props) {
        super(props);
        let localStorageTodos = JSON.parse(localStorage.getItem('todos'+this.props.id));
        if (localStorageTodos) {
            let newChildrenComponent = [];
            for(let i = 0; i < localStorageTodos.length; i++) {
                newChildrenComponent.push(
                    <TodoList done={localStorageTodos[i].done} parentid={this.props.id}
                              id={localStorageTodos[i].id} key={localStorageTodos[i].key}
                              todo={localStorageTodos[i].todo} indexInParent={i}/>)
            }
            this.state = {
                thisTodo: this.props.todo,
                newTodoVal: this.props.todo,
                todo: '',
                children: newChildrenComponent,
                edit: false,
                done: this.props.done
            };
            this.setMaxIdDfs(localStorageTodos);
        }
        else {
            this.state = {
                thisTodo: this.props.todo,
                newTodoVal: this.props.todo,
                todo: '',
                children: [],
                edit: false,
                done: this.props.done
            };
        }
    }
    setMaxIdDfs(todos) {
        let max = -1;
        for(let i = 0; i < todos.length; i++) {
            max = Math.max(max, todos[i].id);
        }
        setId(Math.max(getId(), max));
    }
    toggleDone() {
        let parentId = this.props.parentid;
        let position = this.props.indexInParent;
        let parentTodos = JSON.parse(localStorage.getItem("todos"+parentId));
        let oldTodo = parentTodos.splice(position, 1);
        oldTodo[0].done = !oldTodo[0].done;
        parentTodos.splice(position, 0, oldTodo[0]);
        this.setState({
            done: oldTodo[0].done
        });
        localStorage.setItem("todos"+parentId, JSON.stringify(parentTodos));
    }
    createTodo() {
        if (this.state.todo === '') {
            alert("enter content");
            return;
        }
        let newId = uniqueId();
        let key = this.state.children.length;
        this.setState({
            children: [...this.state.children, <TodoList id={newId} parentid={this.props.id} indexInParent={key - 1} todo={this.state.todo} key={key} done={false}/>]
        });
        this.refs.todoInput.value = "";
        let data = {id: newId, key: key, todo: this.state.todo, done: false, parentid: this.props.id};
        let newData = JSON.parse(localStorage.getItem("todos"+this.props.id));
        if (!newData) {
            newData = [];
        }
        newData.push(data);
        localStorage.setItem("todos"+this.props.id, JSON.stringify(newData));
        this.setState({
            todo: ''
        })
    }
    showEditBox() {
        this.setState({
            edit: true
        })
    }
    setTodo(event) {
        this.setState({
            todo: event.target.value
        });
    }
    updateTodo(){
        let parentId = this.props.parentid;
        let position = this.props.indexInParent;
        let parentTodos = JSON.parse(localStorage.getItem("todos"+parentId));
        let oldTodo = parentTodos.splice(position, 1);
        oldTodo[0].todo = this.state.newTodoVal;
        parentTodos.splice(position, 0, oldTodo[0]);
        localStorage.setItem("todos"+parentId, JSON.stringify(parentTodos));
        this.setState({thisTodo: this.state.newTodoVal, edit: false});
    }
    setNewTodo() {
        this.setState({
            newTodoVal: this.refs.newTodoValue.value
        })
    }
    delete() {
        let parentId = this.props.parentid;
        let parentTodos = JSON.parse(localStorage.getItem("todos"+parentId));
        let oldTodo = parentTodos.splice(this.props.indexInParent, 1);
        localStorage.setItem("todos"+parentId, JSON.stringify(parentTodos));
        this.deleteDfs(oldTodo[0].id);
        this.setState({deleted: true});
    }
    deleteDfs(id) {
        let children = JSON.parse(localStorage.getItem("todos"+id));
        if (children) {
            for (let i = 0; i < children.length; i++) {
                this.deleteDfs(children[i].id);
            }
        }
        localStorage.removeItem("todos"+id);
    }
    render() {
        return this.state.deleted ? (<span></span>) : (
            <div className="margin-left">
                <div>
                    {this.state.edit ? <div>
                        <input ref="newTodoValue" defaultValue={this.state.thisTodo} onChange={this.setNewTodo.bind(this)} />
                        <button onClick={this.updateTodo.bind(this)}>Update</button>
                    </div>: <span onClick={this.showEditBox.bind(this)}>{this.state.thisTodo}</span>}
                    {this.props.id > 0 ?
                        this.state.done ? <input type="checkbox" checked={true} onChange={this.toggleDone.bind(this)}/> :
                            <input type="checkbox" onChange={this.toggleDone.bind(this)}/>
                        : <span></span> }
                    {this.props.id > 0 ? <button onClick={this.delete.bind(this)} >Delete</button>: <span></span>}
                </div>
                <input type="text" ref="todoInput" onChange={this.setTodo.bind(this)}/>
                <button onClick={this.createTodo.bind(this)}>Create</button>
                {this.state.children.map(function (child){
                    return child;
                })}
            </div>
        );
    }
}

export default TodoList;
