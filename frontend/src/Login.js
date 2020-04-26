import React from 'react'
import $ from 'jquery'
import './styles.css'
import SHA1 from 'crypto-js/sha1'

let BACKEND='/'

class Login extends React.Component{

    constructor(){
        super()
        this.state={'login':true,'error':''}
    }

    
   


    tabsw(e){
        if(e.target.innerText=='Login')
           this.setState({'login':true,'error':''})
        else
            this.setState({'login':false,'error':''})
        
        //console.log(e.target)
    }

    login(e){
        e.preventDefault();
        $('.button').prop('disabled',true)
        $.ajax(
            {
            method:'post',
            url:BACKEND+'login',
            data:{'name':$('#un').val().trim().replace(' ','_'),'pwd':SHA1($('#pwd').val()).toString()},
            success:(data)=>{
                //console.log(data)
                    if(data.token){
                        
                        localStorage.setItem('token',data.token)
                        this.props.login(true)
                    }
                    else{
                        this.setState({'error':data.error})
                        $('.button').prop('disabled',false)
                    }
            }
            }
        )
        
    }

    signup(e){
        e.preventDefault()
        
        
        if($('#pwds').val()!=$('#pwdc').val()){
            this.setState({'error':"Passwords don't match"})
            return
        }

        $('.button').prop('disabled',true)

        $.ajax({
            method:'post',
            url:BACKEND+'signup',
            data:{'name':$('#uns').val().trim().replace(' ','_'),'pwd':SHA1($('#pwds').val()).toString()},
            success:(data)=>{
                if(data.error){
                    this.setState({'error':'user already exists'})
                    $('.button').prop('disabled',false)
                }
                else{
                    localStorage.setItem('token',data.token)
                    this.props.login(true)
                    
                }
                   
            }
        })
        
        
        
    }

    render(){
        let form;
        if(this.state.login){
            form=(
                <form className='inner' onSubmit={e=>this.login(e)}>
                    <input name='name' type='text' id='un' className='inp' placeholder='Username' required style={{'marginTop':'10px'}}/>
                    <input name='name' type='password' id='pwd' className='inp' placeholder='Password' required style={{'marginTop':'10px'}} />
                    <input type='submit' className='button' value='Login'style={{width:'40%',minWidth:'150px',alignSelf:'center',marginTop:'20px'}}/>
                </form>
            )
        }else{
            form=(
                <form className='inner' onSubmit={e=>this.signup(e)}>
                <input name='names' type='text' id='uns' className='inp' placeholder='Username' required style={{'marginTop':'10px'}}/>
                <input name='pwds' type='password' id='pwds' className='inp' placeholder='Password' required style={{'marginTop':'10px'}}/><span></span>
                <input name='pwdc' type='password' id='pwdc' className='inp' placeholder='Confirm Password' required style={{marginTop:'10px'}}/>
                <input type='submit' className='button' value='Create Account'style={{width:'60%',minWidth:'200px',alignSelf:'center',marginTop:'20px'}}/>
            </form>
            )
        }


        return(
            <div id='rooot'>
                
                <div className='code material-icons' onClick={()=>window.open('https://github.com/harivikneshs/superchat','_blank')}>code</div>
                <div className='header'>
                    <span style={{'backgroundColor':'white'}}>Super Chat</span>
                </div>

                <div className='lcard'>

                    <div className='tabs'>
                        <span className={this.state.login?'tab active':'tab'}onClick={(e)=>this.tabsw(e)}>Login</span>
                        <span className={this.state.login?'tab':'tab active'} onClick={(e)=>this.tabsw(e)}>Sign Up</span>
                    </div>
                   {form}
                   {this.state.error &&
                   <div style={{margin:'10px',color:'red'}}>{this.state.error}</div>

                   }
                    

                </div>

            </div>
                )
    }
}

export default Login