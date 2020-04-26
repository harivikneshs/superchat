import React from 'react'
import{BrowserRouter as Router,Route} from 'react-router-dom'
import Chat from './Chatbox'
import Login from './Login'



    


class App extends React.Component{

    constructor(){
        super()
        this.state={'isAuth':localStorage.getItem('token')?true:false}
        this.login=this.login.bind(this)
    }

    login(l){
        this.setState({isAuth:l})
    }

    render(){
        let comp
        if(!this.state.isAuth)
            comp=<Login login={this.login}/>
        else
            comp=<Chat login={this.login}/>

        return(
            <div>
            {comp}
            </div>

            /*<Router>
                <Route path='/' exact component={Login}/>
                <Route path='/chat' component={Chat}/>
            </Router>*/

        )
    }
}

export default App;


