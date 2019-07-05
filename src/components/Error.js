/* 
Author: Sebastian Mancipe
Date: Apr 28 - 2019
Last update: July 5 - 2019
Description: 
This component shows an error message if the url was not found
*/
import React, { Component } from 'react'
import img_1 from '../images/man.png'
import img_2 from '../images/question-sign.png'


const text_style ={
  color: '#000000'
}

const image_style={
  'max-width':'100%',
    height:'auto'
}

class Error extends Component{
  render(){
    return (
      <div class="content">
        <header id="header" >
          <h1 style={text_style}>Ups, no hay nada por aquí</h1>
          <img src={img_1} alt="Logo" />
          <img style={image_style} src={img_2} alt="Logo2" />
        </header>
      </div>
    );
  }
}

export default Error;
