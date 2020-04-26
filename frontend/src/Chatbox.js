import React from 'react'
import qs from'query-string'
import sc from 'socket.io-client'
import $ from 'jquery'
import './styles.css'
import Bubble from './ChatBubble'


let BACKEND='/'

var io=sc(BACKEND);


const welcome=(
    <div style={{'margin':'auto','padding':'10px'}}>

    Tap <span className='material-icons'>add_circle</span> button to add friends and start chatting.
    <br/><br/>
    Use <strong>@someone message-text</strong> to send messages
</div>)





class Chat extends React.Component{

    constructor(props){
        super(props)
        this.state={'name':'','pop':'none','fpop':'none','friends':[],'messages':[],'last':'','loading':true,'filter':'All'}
        this.send=this.send.bind(this)
        this.add=this.add.bind(this)
        this.type=this.type.bind(this)
        this.filter=this.filter.bind(this)
    }

    
    componentDidMount(){
        
        $.ajax({
            method:'post',
            url:BACKEND+'check',
            data:{'token':localStorage.getItem('token')},
            success:(data)=>{
               // console.log(data)
                if(!data.verified){
                    localStorage.removeItem('token')
                    this.props.login(false)
                }
                else{
                    this.setState({'name':data.name})
                    io.emit('join',{'name':this.state.name})
                }
            },
            error:(data)=>{
                /*localStorage.removeItem('token')
                this.props.login(false);*/
            }
        })




        $.post(BACKEND+'fetch',{'token':localStorage.getItem('token')},(data)=>{
            //console.log(data)
            if(data.error){
                /*localStorage.removeItem('token')
                this.props.login(false);*/
            }
            var f=[]
            let b=data.map((m)=>{
                if(m.from!=this.state.name && !f.includes(m.from))
                    f.push(m.from)
                    
                if(m.to!=this.state.name && !f.includes(m.to))
                    f.push(m.to)
            })
            
            




            this.setState({'messages':data,'friends':f,'last':f[f.length-1]})
            if(data.length==0)
                this.setState({'welcome':welcome})
            else
                this.setState({'welcome':<div></div>})

        
        

            //console.log(data)

        })


        

        

        io.on('msg',(m)=>{
           
            this.setState({'messages':this.state.messages.concat(m)})
            if(!this.state.friends.includes(m.from)){
                this.setState({'friends':this.state.friends.concat(m.from)})
            }
            this.setState({'last':m.from})
        })

        $('.main').scrollTop($('.main')[0].scrollHeight)


        $('.material-icons').on('mousedown',()=>{
            return false;
        })

        $('.material-icons').on('selectstart',()=>{
            return false;
        })


    }
    

    componentDidUpdate(){

        if(this.state.welcome==welcome && this.state.messages.length>0)
            this.setState({'welcome':<div></div>})

        //console.log(this.state.filter)
        //console.log('update',this.state.messages)
        $('.main').scrollTop($('.main')[0].scrollHeight)
       
    }

    componentWillUnmount(){
        io.disconnect();
    }

    add(){
        let usr=$('.add > input').val()
       $.post(BACKEND+'usr',{'usr':usr},(data)=>{
        if(data){
            if(!this.state.friends.find((e)=>e==usr)){
                this.setState({'friends':this.state.friends.concat(usr),'last':usr})
            }
            this.setState({'adderr':<strong>User added successfully<br/>You can use <em>@{usr}</em> to chat with <em>{usr} </em></strong>})
        }else
        this.setState({'adderr':<strong>User not found</strong>})
           
       })

        
    }

   

    type(e){

        if(!e.target.value){
            this.setState({'results':[]})
            return
        }
       
        let friends=this.state.friends
        if(e.target.value && e.target.value[0]!='@'){
            e.target.value='@'+this.state.last+' '+e.target.value
            
        }
        //console.log(e.target.value.substr(1))
        let r=friends.filter((f)=>{
            if(f.substr(0,e.target.value.length-1)==e.target.value.substr(1))
                return true
            else
                return false
        })
        //console.log(r)
        this.setState({'results':r})
       
    }


    send(){
        if(!$('#mess').val())
            return

        var to=$('#mess').val().split(' ')[0].substr(1)
        var mess=$('#mess').val().split(' ').slice(1).join(' ')

        if(!this.state.friends.find((e)=>e==to)){
            this.setState({'inv_usr':true})
            setTimeout(() => {
                this.setState({'inv_usr':false})
            }, 1500);
            return
        }


        let payload={'token':localStorage.getItem('token'),
                'dta':{'from':this.state.name,
                    'to':to,
                    'message':mess,
                    'time':Date.now()}
            }

       //console.log(payload)
        
        
        
        this.setState({'messages':this.state.messages.concat(payload.dta),'last':to})
        $('#mess').val('')

        $.post(BACKEND+'send',payload,(data)=>{
            if(data.error){
                ;
                /*localStorage.removeItem('token')
                this.props.login(false);*/

            }

        })


        
    }
   

    filter(){
        //console.log($('#filter input').val())
        if($('#filter input').val()=='')
            this.setState({'filter':'All',fpop:'none'})
        else if($('#filter input').val()=='All' || this.state.friends.includes($('#filter input').val()))
            this.setState({'filter':$('#filter input').val(),fpop:'none'})
        else{
            this.setState({'inv_usr':true,fpop:'none'})
            setTimeout(()=>this.setState({'inv_usr':false}),1500)
        }

    }


    

    render(){
        
       
       


        return(
            <div id='rooot'>
               {/*<div style={{'height':'100vh','width':'100%','position':'fixed','zIndex':'-1'}}></div>*/}
             <div className='chatwin'>
             
                
              
                 <div className='top'>

                <span style={{'margin':'10px',flex:'10','fontFamily':"'Poppins', sans-serif",'fontWeight':'400','fontSize':'1.2em',maxWidth:'70%',overflowX:'hidden'}}>{this.state.name}</span>

                 <span className='material-icons' style={{'margin':'10px ',flex:'1','cursor':'pointer',fontSize:'1.8em',fontWeight:'200'}} onClick={()=>{localStorage.removeItem('token');this.props.login(false)}}>power_settings_new</span>

                 <span className='material-icons' style={{'margin':'10px',flex:'1','cursor':'pointer',fontWeight:'200',fontSize:'1.8em'}} onClick={()=>{if(this.state.pop=='none')this.setState({'fpop':this.state.fpop=='none'?'flex':'none'})}}> filter_list </span>

                 <span className='material-icons' style={{'margin':'10px',flex:'1','cursor':'pointer',fontWeight:'200',fontSize:'1.8em'}} onClick={()=>{if(this.state.fpop=='none')this.setState({'pop':this.state.pop=='none'?'flex':'none','adderr':''})}}> add_circle </span>
                <span className='material-icons ' style={{'margin':'10px',flex:'1','cursor':'pointer',fontWeight:'200',fontSize:'1.8em'}} onClick={()=>$('.main').scrollTop($('.main')[0].scrollHeight)}> keyboard_arrow_down </span>
                 
                 </div>
                 <div className='main' >
                 <div className='add'style={{'display':this.state.pop}}>
                     <input type='text' placeholder='Search for users' className='inp' style={{'flex':'3',marginBottom:'10px'}}/>
                     <button className='button' onClick={this.add} style={{'flex':'1',}}>Add</button>
                     {this.state.adderr && <span style={{'width':'100%','margin':'10px'}}>{this.state.adderr}</span>}
                 </div>




                 <div id='filter' className='add'style={{'display':this.state.fpop}}>
                     <datalist id='ffriends'>
                         <option value='All'></option>
                         {this.state.friends.map((f)=>{
                            return <option value={f}></option>
                         })}
                     </datalist>
                     <input type='search' list='ffriends' placeholder='Search for users' className='inp' style={{'flex':'3',marginBottom:'10px'}}/>
                     <button className='button' onClick={this.filter} style={{'flex':'1',}}>Filter</button>
                     
                 </div>

                
                    {this.state.welcome}
                    {!this.state.welcome &&
                    <div style={{margin:'auto'}}>
                        Getting Messages ...
                    </div>
                    
                    }

                   {this.state.messages.map((b)=>{
                       return (<Bubble  name={this.state.name==b.from?b.to:b.from} type={this.state.name==b.from?'sen':'rec'}
                                time={b.time} message={b.message} filter={this.state.filter}/>)
                   })}
                   

                 </div>


                 <div className='suggestions'>
                         {this.state.results && this.state.results.map((r)=>{
                             return(<div onClick={()=>{$('#mess').val('@'+r+' ');$('#mess').focus();this.setState({'results':[]})}}>{'@'+r}</div>)
                         })}
                    </div>

                {this.state.last &&  <div className='bottom'>
                    
                    {this.state.inv_usr && 
                    <span style={{'width':'100%','padding':'10px 0px','color':'red'}}>Invalid User</span>
                    }

                     

                  

                     <textarea className='inp' id='mess' placeholder={'@'+this.state.last+' '}  style={{flex:'1',paddingTop:'8px',boxSizing:'border-box',minHeight:'40px'}} onInput={this.type}/>

                         
                  

                     <button id='send' className='button'
                     style={{'width':'auto','height':'40px',minWidth:'60px','float':'right',
                     fontFamily:"'Open Sans',sans-serif",fontWeight:'700',fontSize:'1.8em'}} onClick={this.send}>
                    

                    <span className='material-icons large'>send</span></button>

                    
                        
                 </div> }

                </div>
                 

             </div>
               
            
        
        )
    }
}

export default Chat