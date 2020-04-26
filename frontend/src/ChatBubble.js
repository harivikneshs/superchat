import React from 'react'
import './styles.css'
class Bubble extends React.Component{

    

    
    componentDidUpdate(){
        console.log(this.props)
    }

    render(){
        let d=new Date(this.props.time)
        let times=d.toLocaleDateString().split('/').slice(0,2).join('/')
        times+=' '+d.toLocaleTimeString().split(':').slice(0,2).join(':')
        let f=this.props.filter=='All' || this.props.filter==this.props.name
       

        return(
            
            <div className={this.props.type=='sen'?'bubble sen':'bubble'} style={{'display':f?'block':'none'}} >
            <div style={{'fontWeight':'bold'}}>
                {this.props.type=='sen' && <span className='material-icons' style={{'fontSize':'1em'}}>keyboard_arrow_right</span>}
                {this.props.name} | {times} </div>
            <span style={{whiteSpace:'pre-wrap'}}>{this.props.message}</span>
            </div>
    
                
           
           
        )
    }
}

export default Bubble